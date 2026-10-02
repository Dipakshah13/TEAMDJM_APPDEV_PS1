-- ============================================================
-- BillBuddy — Initial Schema
-- Migration: 0001_init.sql
-- ============================================================

-- ── Enums ────────────────────────────────────────────────────
CREATE TYPE expense_category AS ENUM (
  'food', 'groceries', 'transport', 'fuel',
  'clothing', 'entertainment', 'household', 'other'
);

CREATE TYPE receipt_source AS ENUM ('scan', 'manual', 'demo');

CREATE TYPE coach_tone AS ENUM ('roast', 'gentle');

-- ── Tables ───────────────────────────────────────────────────

-- Profiles (one per auth.users row)
CREATE TABLE profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name  text,
  avatar_url    text,
  is_anonymous  boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- User settings (one per profile)
CREATE TABLE user_settings (
  user_id              uuid PRIMARY KEY REFERENCES profiles (id) ON DELETE CASCADE,
  monthly_budget       numeric(12, 2) NOT NULL DEFAULT 15000,
  category_limits      jsonb NOT NULL DEFAULT '{}',
  tone                 coach_tone NOT NULL DEFAULT 'roast',
  small_spend_threshold numeric(12, 2) NOT NULL DEFAULT 100,
  onboarding_done      boolean NOT NULL DEFAULT false,
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- Receipts
CREATE TABLE receipts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  store        text NOT NULL DEFAULT 'Unknown Store',
  purchased_at timestamptz NOT NULL DEFAULT now(),
  total        numeric(12, 2),
  confidence   numeric(4, 3),
  source       receipt_source NOT NULL DEFAULT 'scan',
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Receipt items
CREATE TABLE receipt_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id      uuid NOT NULL REFERENCES receipts (id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  name            text NOT NULL,
  normalized_name text NOT NULL,
  price           numeric(12, 2) NOT NULL,
  category        expense_category NOT NULL DEFAULT 'other',
  regret          boolean,
  regret_at       timestamptz,
  purchased_at    timestamptz NOT NULL DEFAULT now(),
  time_known      boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Extraction log (rate limiting: max 20/hour per user)
CREATE TABLE extraction_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX receipts_user_id_purchased_at_idx
  ON receipts (user_id, purchased_at DESC);
CREATE INDEX receipt_items_user_id_purchased_at_idx
  ON receipt_items (user_id, purchased_at DESC);
CREATE INDEX receipt_items_receipt_id_idx
  ON receipt_items (receipt_id);
CREATE INDEX receipt_items_normalized_name_idx
  ON receipt_items (user_id, normalized_name);
CREATE INDEX extraction_log_user_id_created_at_idx
  ON extraction_log (user_id, created_at DESC);

-- ── Triggers: updated_at ─────────────────────────────────────
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER touch_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER touch_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER touch_receipts_updated_at
  BEFORE UPDATE ON receipts
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER touch_receipt_items_updated_at
  BEFORE UPDATE ON receipt_items
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ── Trigger: sync item purchased_at when receipt is edited ───
CREATE OR REPLACE FUNCTION sync_item_purchased_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.purchased_at IS DISTINCT FROM NEW.purchased_at THEN
    UPDATE receipt_items
    SET purchased_at = NEW.purchased_at
    WHERE receipt_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_receipt_purchased_at
  AFTER UPDATE OF purchased_at ON receipts
  FOR EACH ROW EXECUTE FUNCTION sync_item_purchased_at();

-- ── Trigger: auto-create profile + settings on sign-up ───────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url, is_anonymous)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Guest'),
    NEW.raw_user_meta_data->>'avatar_url',
    (NEW.raw_user_meta_data->>'is_anonymous')::boolean IS NOT FALSE
      AND NEW.email IS NULL
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_log  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: own row" ON profiles
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_settings: own row" ON user_settings
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "receipts: own rows" ON receipts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "receipt_items: own rows" ON receipt_items
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "extraction_log: own rows" ON extraction_log
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Function: save_receipt (atomic insert) ───────────────────
CREATE OR REPLACE FUNCTION save_receipt(payload jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_receipt_id   uuid;
  v_user_id      uuid := auth.uid();
  v_item         jsonb;
  v_purchased_at timestamptz;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_purchased_at := COALESCE(
    (payload->>'purchased_at')::timestamptz,
    now()
  );

  INSERT INTO receipts (user_id, store, purchased_at, total, confidence, source, notes)
  VALUES (
    v_user_id,
    COALESCE(payload->>'store', 'Unknown Store'),
    v_purchased_at,
    (payload->>'total')::numeric,
    (payload->>'confidence')::numeric,
    COALESCE((payload->>'source')::receipt_source, 'scan'),
    payload->>'notes'
  )
  RETURNING id INTO v_receipt_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(payload->'items')
  LOOP
    INSERT INTO receipt_items (
      receipt_id, user_id, name, normalized_name,
      price, category, time_known, purchased_at
    )
    VALUES (
      v_receipt_id,
      v_user_id,
      v_item->>'name',
      COALESCE(v_item->>'normalized_name', lower(v_item->>'name')),
      (v_item->>'price')::numeric,
      COALESCE((v_item->>'category')::expense_category, 'other'),
      COALESCE((v_item->>'time_known')::boolean, true),
      v_purchased_at
    );
  END LOOP;

  RETURN v_receipt_id;
END;
$$;

-- ── Function: reset_my_data ──────────────────────────────────
CREATE OR REPLACE FUNCTION reset_my_data(demo_only boolean DEFAULT true)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF demo_only THEN
    DELETE FROM receipts
    WHERE user_id = v_user_id AND source = 'demo';
  ELSE
    DELETE FROM receipts WHERE user_id = v_user_id;
    DELETE FROM extraction_log WHERE user_id = v_user_id;
    UPDATE user_settings
    SET monthly_budget = 15000,
        category_limits = '{}',
        tone = 'roast',
        small_spend_threshold = 100,
        onboarding_done = false
    WHERE user_id = v_user_id;
  END IF;
END;
$$;

-- ── Function: export_my_data ─────────────────────────────────
CREATE OR REPLACE FUNCTION export_my_data()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN jsonb_build_object(
    'exported_at', now(),
    'profile', (SELECT row_to_json(p) FROM profiles p WHERE p.id = v_user_id),
    'settings', (SELECT row_to_json(s) FROM user_settings s WHERE s.user_id = v_user_id),
    'receipts', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'receipt', row_to_json(r),
          'items', (
            SELECT jsonb_agg(row_to_json(i))
            FROM receipt_items i WHERE i.receipt_id = r.id
          )
        )
      )
      FROM receipts r WHERE r.user_id = v_user_id
    )
  );
END;
$$;
