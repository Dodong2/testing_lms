// components/AuthGuard.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  if (status === 'loading') return <div>Loading...</div>

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
      router.replace('/auth')
    }
    return null
  }

  return <>{children}</>
}
