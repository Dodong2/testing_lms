import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { 
        user: user.email, 
        provider: account?.provider,
        profileId: profile?.sub 
      })
      
      if (account?.provider === 'google') {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email || '' }
          })
          
          console.log('Existing user found:', !!existingUser)
          
          // Only allow sign in if user exists (admin must create account first)
          if (!existingUser) {
            console.log('User not found in database, blocking sign in')
            return false
          }

          // Check if account is already linked
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              }
            }
          })

          console.log('Existing account found:', !!existingAccount)

          // If account doesn't exist, create it and link to existing user
          if (!existingAccount) {
            console.log('Creating new account link for existing user')
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              }
            })
            console.log('Account link created successfully')
          }
          
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        try {
          // Get user from database to include role
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email || '' }
          })
          
          if (dbUser) {
            token.role = dbUser.role
            token.id = dbUser.id
            console.log('JWT token updated with role:', dbUser.role)
          }
        } catch (error) {
          console.error('Error in jwt callback:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      // Add role and id to session from JWT token
      if (token && session.user) {
        session.user.role = token.role
        session.user.id = token.id
        console.log('Session updated with role:', token.role)
      }
      
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }