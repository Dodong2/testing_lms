import { NextRequest, NextResponse, userAgent } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Instructor: Grade Work
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string, postId: string, submissionId: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if(!user || user.role !== 'INSTRUCTOR') {
            return NextResponse.json({ error: 'Only instructors can grade' }, { status: 403 })
        }

        const { submissionId } = await context.params
        const { grade, feedback } = await req.json()

        const graded = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                grade,
                feedback,
                gradedAt: new Date()
            },
            include: {
                student: { select: { id: true, name: true, image: true } }
            }
        })

        return NextResponse.json(graded)
    } catch(error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' },{ status: 500 })
    }
}