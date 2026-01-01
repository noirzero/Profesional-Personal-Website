import type { Metadata } from 'next'
import '../styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Your Name — Professional Portfolio',
  description: 'Personal website: portfolio, blog, and contact.',
  metadataBase: new URL('https://yourname.com'),
  openGraph: {
    title: 'Your Name — Professional Portfolio',
    description: 'Personal website: portfolio, blog, and contact.',
    type: 'website',
    url: 'https://yourname.com'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* PWA manifest & icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="theme-color" content="#0ea5a4" />
        {/* Google Analytics (gtag) - enabled when NEXT_PUBLIC_GA_ID is set */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });`
              }}
            />
          </>
        )}
      </head>
      <body className="bg-white text-slate-900 antialiased">
        <Providers>
          {/* Skip link for keyboard users */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:p-2 focus:rounded">Skip to content</a>
          <Header />
          <main id="main-content" role="main" className="min-h-[60vh] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
