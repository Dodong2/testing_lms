'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { signIn, isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('Login page - isAuthenticated:', isAuthenticated, 'user:', user)
    if (isAuthenticated) {
      router.push('/home')
    }
  }, [isAuthenticated, router, user])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const handleSignIn = async () => {
    try {
      console.log('Starting sign in...')
      const result = await signIn('google')
      console.log('Sign in result:', result)
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  return (
    <div>
      <h1>Login to LMS</h1>
      <p>Please contact admin to get your account first.</p>
      <button 
        onClick={handleSignIn}
        type="button"
      >
        Continue with Google
      </button>
      
      {/* Debug info */}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Debug Info:</h3>
        <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>User: {user ? JSON.stringify(user, null, 2) : 'None'}</p>
      </div>
    </div>
  )
}