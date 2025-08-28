import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { emitSocketEvent } from "@/lib/emitSocketEvent"

// delete post 
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string, postId: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user.email) {
            return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if(!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { id: programId, postId } = await context.params

        const post = await prisma.post.findUnique({
            where: { id: postId },
        })

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // only author can delete
        if(post.authorId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        
        const deletePost = await prisma.post.delete({
            where: { id: postId },
        })

        await emitSocketEvent("post", 'post-deleted', { id: deletePost.id, programId })

        return NextResponse.json({ success: true, deletePost: deletePost })

    } catch(error) {
        console.error("Fialed to delete post!", error)
    }
}