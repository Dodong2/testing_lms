// for create a comments
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Context = {
    params: {
        id: string
        postId: string
    }
}

export async function POST(req: NextRequest, context: Context) {
    try {
    const session = await getServerSession(authOptions)
    if(!session?.user?.email) {
        return NextResponse.json({}, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id: programId, postId } = await context.params
    const { content } = await req.json()

    if(typeof content !== 'string' || !content.trim()) {
        return NextResponse.json({ error: 'Content required' },{ status: 400 })
    }

    // Get post & check membership
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { program: true }
    })

    if(!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const member = await prisma.programMember.findUnique({
        where: {
            programId_userId: {
                programId,
                userId: user.id
            }
        }
    })


    if(!member) {
        return NextResponse.json({ error: 'Not a member of this program' },{ status: 403 })
    }

    const comment = await prisma.comment.create({
        data: {
            content,
            postId,
            authorId: user.id
        },
        include: {
            author: { select: { id: true, name: true, image: true } }
        }
    })

    return NextResponse.json(comment)

  } catch(error) {
    console.error(error, 'Failed to create a comments!')
    return NextResponse.json({ error: 'Internal Server Error' },{ status: 500 })
  }
}