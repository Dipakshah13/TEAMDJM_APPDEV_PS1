/**
 * @file vision/provider.js
 * Abstraction layer for the vision LLM.
 * Note: Anthropic SDK has been removed for the demo.
 * The system will automatically use the mock receipt engine!
 */

export async function callVisionModel({ imageBase64, mediaType }) {
  // We throw an error here so the main extraction route catches it 
  // and successfully falls back to returning the beautiful mock receipt data!
  throw new Error("Using mock engine for the demo.")
}
