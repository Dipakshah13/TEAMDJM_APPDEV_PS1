/**
 * @file vision/provider.js
 * Abstraction layer for the vision LLM.
 * Swap providers by changing VISION_MODEL env var.
 * Currently supports: Anthropic Claude (default).
 *
 * Add a new provider by adding a case to `callVisionModel`.
 */

import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a receipt-parsing engine. Read the receipt image or PDF and return ONLY valid JSON, no markdown, no commentary.

Schema:
{
  "store": string,
  "date": "YYYY-MM-DD" or null,
  "time": "HH:mm" or null,
  "total": number,
  "confidence": number,
  "items": [
    {
      "name": string,
      "normalized_name": string,
      "price": number,
      "category": "food"|"groceries"|"transport"|"fuel"|"clothing"|"entertainment"|"household"|"other"
    }
  ]
}

Rules:
- Include every purchased line item. Do not include taxes (GST, CGST, SGST, service charge), discounts, rounding or subtotals as items; "total" is the final amount paid.
- If quantity > 1, include the line once with the line total as price.
- "food": restaurants, cafes, snacks, drinks, delivery food. "groceries": supermarket goods. "household": cleaning, toiletries, home items. "transport": cab, auto, metro, bus, parking, tolls. "fuel": petrol/diesel/CNG. "clothing": apparel and footwear. "entertainment": movies, games, events, streaming. Otherwise "other".
- Receipts may be English, Hindi or Marathi, printed, thermal or handwritten. Write normalized_name in English.
- If date/time is unreadable use null. Never invent items.
- Output must be parseable by JSON.parse.`

/**
 * Call the configured vision model with a receipt image/PDF.
 *
 * @param {{ imageBase64: string, mediaType: 'image/jpeg'|'image/png'|'application/pdf' }} input
 * @returns {Promise<string>} Raw JSON string from model
 * @throws {Error} On API error or timeout
 */
export async function callVisionModel({ imageBase64, mediaType }) {
  const model = process.env.VISION_MODEL || 'claude-opus-4-5'

  // Route to correct provider based on model name prefix
  if (model.startsWith('claude')) {
    return callAnthropic({ imageBase64, mediaType, model })
  }

  throw new Error(`Unknown vision model: ${model}. Add a provider case in lib/vision/provider.js`)
}

/**
 * @param {{ imageBase64: string, mediaType: string, model: string }} params
 * @returns {Promise<string>}
 */
async function callAnthropic({ imageBase64, mediaType, model }) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const isPdf = mediaType === 'application/pdf'

  const message = await client.messages.create({
    model,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: isPdf
          ? [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: imageBase64,
                },
              },
              { type: 'text', text: 'Parse this receipt.' },
            ]
          : [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              { type: 'text', text: 'Parse this receipt.' },
            ],
      },
    ],
  })

  const block = message.content.find((b) => b.type === 'text')
  if (!block || block.type !== 'text') throw new Error('No text content in model response')
  return block.text
}
