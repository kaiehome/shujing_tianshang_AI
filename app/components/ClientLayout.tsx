'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../providers'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-screen bg-zinc-900 pt-12">
        {children}
      </main>
      {!isLoginPage && <Footer />}
      <Toaster position="top-center" />
    </AuthProvider>
  )
} 