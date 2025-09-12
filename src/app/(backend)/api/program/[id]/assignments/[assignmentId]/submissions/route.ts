import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
// import { emitSocketEvent } from "@/lib/emitSocketEvent";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string, assignmentId: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const { id: programId, assignmentId } = await context.params
        const body = await req.json()
        const { files, comment } = body as { files: unknown; comment?: string }

        // Validate membership
        const member = await prisma.programMember.findFirst({ where: { programId, userId: user.id } })
        if (!member) return NextResponse.json({ error: "Not a member of this program" }, { status: 403 })

        // Ensure assignment exists and belongs to program
        const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } })
        if (!assignment || assignment.programId !== programId) return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
        
        // files should be the UploadThing response array; basic validation
        if (!files || !Array.isArray(files)) return NextResponse.json({ error: "Files required" }, { status: 400 })
        
        const submission = await prisma.submission.create({
            data: {
                assignmentId,
                submitterId: user.id,
                files: files,
                comment: typeof comment === 'string' ? comment : null
            },
            include: { submitter: { select: { id: true, name: true, image: true } } }
        })

        // await emitSocketEvent('assignment', 'submission-created', submission)
        return NextResponse.json(submission)
    } catch(error) {
        console.error(error, 'Failed to create submission')
        return NextResponse.json({ error: 'Internal Server Error' },{ status: 500 })
    }
}