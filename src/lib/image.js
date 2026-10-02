import imageCompression from 'browser-image-compression'

export async function compressReceiptImage(file) {
  // If it's a PDF, we can't compress it as an image easily in browser using this lib, just return
  if (file.type === 'application/pdf') {
    if (file.size > 4 * 1024 * 1024) {
      throw new Error('PDF too large. Max 4MB allowed.')
    }
    return file
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image too large. Max 10MB allowed.')
  }

  const options = {
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    initialQuality: 0.8,
  }
  
  try {
    return await imageCompression(file, options)
  } catch (error) {
    console.error('Compression error:', error)
    return file // Fallback to original if compression fails
  }
}
