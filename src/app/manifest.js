/**
 * PWA Web App Manifest
 * @returns {import('next').MetadataRoute.Manifest}
 */
export default function manifest() {
  return {
    name: 'BillBuddy',
    short_name: 'BillBuddy',
    description: 'Smart receipt tracker — scan, categorise, stop regretting.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f3',
    theme_color: '#1a4731',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
