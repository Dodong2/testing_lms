import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { emitSocketEvent } from "@/lib/emitSocketEvent";

// Beneficiary: Submit Work
export async function POST(req: NextRequest, context: { params: Promise<{ id: string, postId: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user || user.role !== 'BENEFICIARY') {
            return NextResponse.json({ error: 'Only beneficiaries can submit' }, { status: 403 })
        }

        const { postId } = await context.params
        const { files, links } = await req.json()

        // check if task exists
        const post = await prisma.post.findUnique({ where: { id: postId } })
        if (!post || post.tag !== "TASK") {
            return NextResponse.json({ error: 'Invalid task' }, { status: 400 })
        }

        // one submission per student
        const existing = await prisma.submission.findFirst({
            where: { postId, studentId: user.id }
        })
        if (existing) {
            return NextResponse.json({ error: 'Already submitted' }, { status: 400 })
        }

        const submission = await prisma.submission.create({
            data: {
                postId,
                studentId: user.id,
                files: files ?? null,
                links: links ?? null,
                grade: null
            },
            include: {
                student: { select: { id: true, name: true, image: true } }
            }
        })

        await emitSocketEvent("submission", "submission-created", submission);

        return NextResponse.json(submission)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// Get submissions for a task
export async function GET(req: NextRequest, context: { params: Promise<{ id: string, postId: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    const { postId } = await context.params
    const url = new URL(req.url)
    const getAll = url.searchParams.get('getAll') === 'true'

    if (user?.role === "BENEFICIARY") {
        const mySubmission = await prisma.submission.findFirst({
            where: { postId, studentId: user.id },
            include: {
                student: { select: { id: true, name: true, image: true } },
                post: { select: { id: true, title: true } }
            }
        })
        return NextResponse.json(mySubmission)
    }

    if (user?.role === "INSTRUCTOR") {
        if (getAll) {
            const AllSubmissions = await prisma.submission.findMany({
                where: {
                    post: {
                        programId: (await context.params).id,
                        tag: 'TASK'
                    }
                },
                include: {
                    student: { select: { id: true, name: true, image: true } },
                    post: { select: { id: true, title: true } }
                }
            })
            return NextResponse.json(AllSubmissions)
        }
        const all = await prisma.submission.findMany({
            where: { postId },
            include: {
                student: { select: { id: true, name: true, image: true } },
                post: { select: { id: true, title: true } }
            }
        })
        return NextResponse.json(all)
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
