import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRandomMockReceipt } from '@/lib/vision/mockReceipts'
import { validateExtraction } from '@/lib/validation'
import Anthropic from '@anthropic-ai/sdk'
// Remove pdf-parse import completely

export const maxDuration = 45 // Vercel timeout

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse request body
    const body = await request.json()
    const { imageBase64, mediaType, demoMode } = body

    if (!imageBase64 || !mediaType) {
      return NextResponse.json({ error: 'Missing image or mediaType' }, { status: 400 })
    }

    // 3. Demo Mode Fallback Check
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY
    if (demoMode || !hasApiKey) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockReceipt = getRandomMockReceipt()
      // Fix mock receipt date to today so insights trigger
      mockReceipt.date = new Date().toISOString().split('T')[0]
      return NextResponse.json({ success: true, data: mockReceipt, source: 'demo' })
    }

    // 4. Rate Limiting via RPC
    const { data: canExtract, error: rpcError } = await supabase.rpc('check_extraction_quota')
    if (rpcError || !canExtract) {
      return NextResponse.json({ error: 'Extraction quota exceeded' }, { status: 429 })
    }

    // 5. Call LLM
    // PDF or direct document
    let contentBlock
    
    if (mediaType === 'application/pdf') {
      contentBlock = {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: imageBase64
        }
      }
    } else {
      contentBlock = {
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data: imageBase64
        }
      }
    }

    // Abort controller for 45s timeout manually (though Vercel handles maxDuration)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)

    try {
      const response = await anthropic.messages.create({
        model: process.env.VISION_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0,
        system: "You are a receipt extraction AI. You must output ONLY a valid JSON object without markdown formatting. The JSON must contain: 'store' (string), 'date' (YYYY-MM-DD), 'total' (number), 'confidence' (0 to 1), and 'items' (array of objects with 'name' (string), 'price' (number), 'category' (string: food, groceries, transport, fuel, clothing, entertainment, household, other)).",
        messages: [
          {
            role: "user",
            content: [
              contentBlock,
              { type: "text", text: "Extract the receipt details into JSON." }
            ]
          }
        ]
      }, { signal: controller.signal })

      clearTimeout(timeout)
      
      const rawText = response.content[0].text
      // Handle cases where Claude outputs markdown block despite instructions
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      const jsonString = jsonMatch ? jsonMatch[1] : rawText

      let parsedData
      try {
        parsedData = JSON.parse(jsonString.trim())
      } catch (e) {
        console.error('LLM returned invalid JSON', rawText)
        return NextResponse.json({ error: 'Failed to parse receipt data' }, { status: 500 })
      }

      // 6. Validate
      const validatedData = validateExtraction(parsedData)

      return NextResponse.json({
        success: true,
        data: validatedData,
        source: 'scan'
      })

    } catch (err) {
      clearTimeout(timeout)
      if (err.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out' }, { status: 504 })
      }
      throw err
    }

  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 })
  }
}
