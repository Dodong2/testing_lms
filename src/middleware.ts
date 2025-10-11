// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const pathname = req.nextUrl.pathname
  console.log("🛡️ Middleware running for:", pathname)
  
  // Always allow access to login and error pages
  const publicPaths = ['/', '/error']
  const isPublicPath = publicPaths.includes(pathname)

  // Not logged in? Redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Logged in? Restrict roles for certain routes
  if (token) {
    const userRole = token.role

    // Admin-only routes
    if (pathname.startsWith('/home/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/error?code=unauthorized', req.url))
    }

    // Program creation - only ADMIN or INSTRUCTOR
    if (pathname === '/program/create' && !['ADMIN', 'INSTRUCTOR'].includes(userRole)) {
      return NextResponse.redirect(new URL('/error?code=unauthorized', req.url))
    }

    // Already logged in? Prevent access to login page
    if (pathname === '/' && token) {
      return NextResponse.redirect(new URL('/home', req.url))
    }
  }

  return NextResponse.next()
}

// Apply to protected paths only
export const config = {
  matcher: [
    '/auth',
    '/home/:path*',
    '/program/:path*',
    '/error',
  ],
}
