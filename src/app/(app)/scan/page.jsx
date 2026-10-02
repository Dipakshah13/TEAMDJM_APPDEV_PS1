import ScanFlow from '@/components/scan/ScanFlow'

export const metadata = { title: 'Scan Receipt' }

/**
 * Scan page — hosts the full scan flow:
 * Upload → Confirm → Swipe → Result
 * State managed client-side in ScanFlow with sessionStorage persistence.
 */
export default function ScanPage() {
  return <ScanFlow />
}
