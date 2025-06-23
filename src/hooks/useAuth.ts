import { useSession, signIn, signOut } from 'next-auth/react'
import { User } from '@/types/auth'

export function useAuth() {
  const { data: session, status } = useSession()

  const user: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name!,
    role: session.user.role,
    image: session.user.image || undefined
  } : null

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    signIn,
    signOut,
  }
}