import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'BillBuddy — Smart Receipt Tracker',
    template: '%s | BillBuddy',
  },
  description:
    'BillBuddy scans your receipts, sorts every item into categories, forecasts when you\'ll overspend, and asks which purchases you regret.',
  keywords: ['receipt tracker', 'budget', 'spending', 'expense tracker', 'OCR', 'India'],
  authors: [{ name: 'BillBuddy Team' }],
  creator: 'BillBuddy',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://billbuddy.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'BillBuddy — Smart Receipt Tracker',
    description: 'Other apps tell you where your money went. BillBuddy tells you where it\'s about to go.',
    siteName: 'BillBuddy',
  },
  manifest: '/manifest.webmanifest',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1a4731'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-cream text-forest min-h-dvh">
        {children}
      </body>
    </html>
  )
}
