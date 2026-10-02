import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callVisionModel } from '@/lib/vision/provider'
import { getRandomMockReceipt } from '@/lib/vision/mockReceipts'
import { validateExtraction } from '@/lib/validation'

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
    // If the user explicitly requested demo mode or if the API key is missing
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY
    if (demoMode || !hasApiKey) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockReceipt = getRandomMockReceipt()
      // Make sure the mock date matches today so insights work correctly
      mockReceipt.date = new Date().toISOString().split('T')[0]
      
      return NextResponse.json({
        success: true,
        data: mockReceipt,
        source: 'demo'
      })
    }

    // 4. Rate Limiting (Log extraction)
    const { error: logError } = await supabase
      .from('extraction_log')
      .insert([{ user_id: user.id }])

    // In a real app we'd count rows in the last hour and fail if > 20.
    // For now we just log it.
    if (logError) {
      console.error('Failed to log extraction', logError)
    }

    // 5. Call LLM Provider
    const rawResult = await callVisionModel({ imageBase64, mediaType })

    // 6. Parse and Validate
    let parsedData
    try {
      parsedData = JSON.parse(rawResult)
    } catch (e) {
      console.error('LLM returned invalid JSON', rawResult)
      return NextResponse.json({ error: 'Failed to parse receipt data' }, { status: 500 })
    }

    const validatedData = validateExtraction(parsedData)

    return NextResponse.json({
      success: true,
      data: validatedData,
      source: 'scan'
    })

  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 })
  }
}
