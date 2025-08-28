import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { emitSocketEvent } from "@/lib/emitSocketEvent"

// for update post sa programs
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string, postId: string }> }) {
    try{
        const session = await getServerSession(authOptions)
        if(!session?.user.email) {
            return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
        }

        // chekc if yung user ay existed
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if(!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { id: programId, postId } = await context.params
        const { content } = await req.json()

        if(!content || typeof content !== "string") {
            return NextResponse.json({ error: "Content required" }, { status: 400 })
        }

        // hahanapin yung post
        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // check membership
        if(post.authorId !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const updated = await prisma.post.update({
            where: { id: postId, programId },
            data: { content },
            include: {
                author: { select: { id: true, name: true, image: true } }
            }
        })

        await emitSocketEvent("post", "post-updated", updated)


        return NextResponse.json(updated)


    } catch(error) {
        console.error("Failed to update a posts!", error)
        return NextResponse.json({ error: "Internal Server Error" },{ status: 500 })
    }
}

