'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

export default function HomePage() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <h1>Welcome to LMS</h1>
      <div>
        <h2>Profile Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.image && (
          <Image
            src={user.image} 
            alt="Profile" 
            width={50} 
            height={50}
            style={{ borderRadius: '50%' }}
          />
        )}
      </div>
      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  )
}