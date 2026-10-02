import { z } from 'zod'
import { CATEGORIES } from './models'

// Ensure we only accept the strict categories defined in our models
const ExpenseCategorySchema = z.enum(CATEGORIES)

export const ReceiptItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  normalized_name: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  category: ExpenseCategorySchema.default('other'),
  regret: z.boolean().nullable().optional(),
  time_known: z.boolean().default(true),
})

export const ExtractedReceiptSchema = z.object({
  store: z.string().default('Unknown Store'),
  date: z.string().nullable().optional(),
  purchased_at: z.string().nullable().optional(), // allow Claude to output this
  time: z.string().nullable().optional(),
  total: z.number().nullable().optional(),
  confidence: z.number().min(0).max(1).default(1),
  items: z.array(ReceiptItemSchema).default([]),
})

/**
 * Validate raw JSON from the LLM against the receipt schema.
 * @param {unknown} data
 * @returns {import('./models').ExtractedReceipt}
 */
export function validateExtraction(data) {
  return ExtractedReceiptSchema.parse(data)
}
