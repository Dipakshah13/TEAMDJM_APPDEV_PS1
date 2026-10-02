-- 1. extraction_log: users may read, but not insert/delete; writes go through the RPC
drop policy if exists "extraction_log: own rows" on extraction_log;
create policy "extraction_log: read own" on extraction_log
  for select using (auth.uid() = user_id);

create or replace function check_extraction_quota(max_per_hour int default 20)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_count int;
begin
  if v_user is null then raise exception 'Not authenticated'; end if;
  select count(*) into v_count from extraction_log
   where user_id = v_user and created_at > now() - interval '1 hour';
  if v_count >= max_per_hour then return false; end if;
  insert into extraction_log (user_id) values (v_user);
  return true;
end $$;

-- 2. constraints and defaults
alter table receipt_items add constraint receipt_items_price_chk check (price >= 0 and price <= 1000000);
alter table receipts      add constraint receipts_total_chk      check (total is null or (total >= 0 and total <= 10000000));
alter table receipts      add constraint receipts_conf_chk       check (confidence is null or confidence between 0 and 1);
alter table user_settings add constraint settings_budget_chk     check (monthly_budget >= 0);
alter table user_settings alter column category_limits set default
  '{"food":6000,"groceries":4000,"transport":2000,"fuel":2500,"clothing":3000,"entertainment":2000,"household":1500,"other":1500}'::jsonb;
update user_settings set category_limits =
  '{"food":6000,"groceries":4000,"transport":2000,"fuel":2500,"clothing":3000,"entertainment":2000,"household":1500,"other":1500}'::jsonb
 where category_limits = '{}'::jsonb;
create index if not exists receipt_items_unswiped_idx on receipt_items (user_id) where regret is null;

-- 3. correct anonymous flag
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name, avatar_url, is_anonymous)
  values (NEW.id,
          coalesce(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1), 'Guest'),
          NEW.raw_user_meta_data->>'avatar_url',
          coalesce(NEW.is_anonymous, false))
  on conflict (id) do nothing;
  insert into user_settings (user_id) values (NEW.id) on conflict (user_id) do nothing;
  return NEW;
end $$;

-- 4. harden save_receipt (validation, size limits)
create or replace function save_receipt(payload jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_receipt_id uuid; v_user uuid := auth.uid(); v_item jsonb; v_ts timestamptz; v_n int;
begin
  if v_user is null then raise exception 'Not authenticated'; end if;
  v_n := coalesce(jsonb_array_length(payload->'items'), 0);
  if v_n < 1 or v_n > 100 then raise exception 'Receipt must have 1 to 100 items'; end if;
  v_ts := coalesce((payload->>'purchased_at')::timestamptz, now());
  insert into receipts (user_id, store, purchased_at, total, confidence, source, notes)
  values (v_user, left(coalesce(nullif(trim(payload->>'store'),''),'Unknown Store'), 120), v_ts,
          (payload->>'total')::numeric, (payload->>'confidence')::numeric,
          coalesce((payload->>'source')::receipt_source,'scan'), left(payload->>'notes', 500))
  returning id into v_receipt_id;
  for v_item in select * from jsonb_array_elements(payload->'items') loop
    insert into receipt_items (receipt_id, user_id, name, normalized_name, price, category, time_known, purchased_at, regret, regret_at)
    values (v_receipt_id, v_user, left(v_item->>'name',160),
            left(coalesce(nullif(lower(trim(v_item->>'normalized_name')),''), lower(v_item->>'name')),160),
            (v_item->>'price')::numeric,
            coalesce((v_item->>'category')::expense_category,'other'),
            coalesce((v_item->>'time_known')::boolean,true), v_ts,
            (v_item->>'regret')::boolean,
            case when v_item->>'regret' is null then null else now() end);
  end loop;
  return v_receipt_id;
end $$;

-- 5. account deletion
create or replace function delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  delete from auth.users where id = auth.uid();   -- cascades to profiles and everything below
end $$;

-- 6. lock down execute rights
revoke execute on function save_receipt(jsonb), reset_my_data(boolean), export_my_data(),
                           check_extraction_quota(int), delete_my_account() from public, anon;
grant  execute on function save_receipt(jsonb), reset_my_data(boolean), export_my_data(),
                           check_extraction_quota(int), delete_my_account() to authenticated;
