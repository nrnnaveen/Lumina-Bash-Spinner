import type { Metadata } from 'next'
import { Orbitron, Rajdhani, Share_Tech_Mono } from 'next/font/google'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Lumina Weekly Bash Spinner',
  description: 'Spin the wheel to pick speakers and tasks for your weekly Lumina Bash tech sessions!',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Lumina Weekly Bash Spinner',
    description: 'Interactive spinner wheel for weekly tech sessions',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(6, 13, 22, 0.95)',
              color: '#e0eaff',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              fontFamily: 'var(--font-body)',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </body>
    </html>
  )
}
