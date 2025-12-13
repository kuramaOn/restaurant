import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cashier Terminal - Restaurant System',
  description: 'Point of Sale terminal for restaurant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
