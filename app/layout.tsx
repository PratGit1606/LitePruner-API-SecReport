import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LitePruner API — Security Audit Report',
  description: 'Penetration testing findings for the LitePruner compression API',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
