// for create a comments
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { emitSocketEvent } from "@/lib/emitSocketEvent";

// create a comment
export async function POST(req: NextRequest, context: { params: Promise<{ id: string, postId: string }> }) {
    try {
    const session = await getServerSession(authOptions)
    if(!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    await emitSocketEvent('post', 'comment-created', comment)

    return NextResponse.json(comment)

  } catch(error) {
    console.error(error, 'Failed to create a comments!')
    return NextResponse.json({ error: 'Internal Server Error' },{ status: 500 })
  }
}

// Delete a comment
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string, postId: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
        }
        
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if(!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { id: programId, postId } = await context.params
        const { commentId } = await req.json()

        if(!commentId || typeof commentId !== "string") {
            return NextResponse.json({ error: 'Comment ID required' },{ status: 400 })
        }

        // find comment
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: {
                post: { include: { program: true } }
            }
        })

        // check if user is author
        if(comment?.authorId !== user.id) {
            return NextResponse.json({ error: 'Forbidden: Not your comment' }, { status: 403 })
        }

        // check membership in the program
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

        // delete comment
        const deletedComment = await prisma.comment.delete({
            where: { id: commentId }
        })

        await emitSocketEvent('post', 'comment-deleted', { id: deletedComment.id, postId })

        return NextResponse.json({ success: true, id: deletedComment.id })

    } catch(error) {
        console.error(error, 'Failed to delete comment!')
        return NextResponse.json({ error: 'Internal Server Error' },{ status: 500 })
    }
}