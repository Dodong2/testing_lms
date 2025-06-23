import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db';

// Define role enum manually to avoid import issues
const VALID_ROLES = ['ADMIN', 'INSTRUCTOR', 'BENEFICIARY'] as const
type ValidRole = typeof VALID_ROLES[number]

export async function POST(request: NextRequest) {
  try {
    const { email, name, role }: { email: string; name: string; role: ValidRole } = await request.json()

    // Validate required fields
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Email, name, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN, INSTRUCTOR, or BENEFICIARY' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Create user (NextAuth will handle account linking on first sign-in)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        // Don't set emailVerified here - let NextAuth handle it
      }
    })

    return NextResponse.json({ 
      message: 'User created successfully. They can now sign in with Google.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      instructions: 'The user should now visit /login and sign in with Google using this email address.'
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
          }
        }
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper endpoint to check user status
export async function PATCH(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        hasGoogleAccount: user.accounts.some(acc => acc.provider === 'google'),
        accounts: user.accounts
      }
    })

  } catch (error) {
    console.error('Error checking user status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}