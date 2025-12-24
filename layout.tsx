import '../styles/globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'MeetingPulse - Was this meeting worth it?',
  description: 'Lightweight post-meeting feedback to make meetings better',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0A0E1B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>" />
      </head>
      <body className="bg-pulse-dark min-h-screen">
        <div className="fixed inset-0 bg-gradient-dark pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
        <Toaster 
          position="top-center"
          toastOptions={{
            className: 'glass-card',
            style: {
              background: 'rgba(10, 14, 27, 0.9)',
              color: '#E8EBF0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
      </body>
    </html>
  )
}
