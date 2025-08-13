import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

type Context = {
    params: {
        id: string
    }
}

//pang get ng mga sa specific programs post
export async function GET(req: NextRequest, context: Context) {
    try {
    const session = await getServerSession(authOptions)

    // console.log('Session in GET:', session)

    if(!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if(!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const { id } = await context.params
    const programId = id

    const member = await prisma.programMember.findFirst({
        where: { programId: programId, userId: user.id } 
    })

    if(!member) {
        return NextResponse.json({ error: 'Not a member of this program' },{ status: 403 })
    }

    const posts = await prisma.post.findMany({
        where: { programId },
        include: {
            author: { select: { id: true, name: true, image: true } },
            comments: {
                include: { author: { select: { id: true, name: true, image: true } } }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(posts)

    } catch(error) {
        console.error(error, 'Failed to get Posts')
        return NextResponse.json({ error: 'Internal Server Error' },{ status: 500 })
    }
}

//for create ng post sa programs
export async function POST(req: NextRequest, context: Context) {
    try{
    const session = await getServerSession(authOptions)

    // console.log('Session in POST:', session)

    if(!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if(!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }


    const { id } = await context.params
    const programId = id
    
    const { content } = await req.json()

    if(typeof content !== 'string' || !content.trim()) {
        return NextResponse.json({ error: 'Content required' },{ status: 400 })
    }

    // Check membership
    const member = await prisma.programMember.findFirst({
        where: { programId: programId, userId: user.id }
    })

    if(!member) {
        return NextResponse.json({ error: 'Not a member of this program' },{ status: 403 })
    }

    // Check role
    if(!['BENEFICIARY', 'INSTRUCTOR'].includes(user.role)) {
        return NextResponse.json({ error: 'Only beneficiaries or instructors can post' }, { status: 403 })
    }

    const post = await prisma.post.create({
        data: {
            content,
            programId,
            authorId: user.id
        },
        include: {
            author: { select: { id: true, name: true, image: true, email: true } }
        }
    })

    return NextResponse.json(post)
  } catch(error) {
    console.error(error, 'Failed to create a posts!')
    return NextResponse.json({ error: 'Internal Server Error' },{ status: 500 })
  }
}

