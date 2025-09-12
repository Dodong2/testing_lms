import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
// import { emitSocketEvent } from "@/lib/emitSocketEvent";

export interface FileAttachment {
  url: string
  name: string
  type: string
  size: number
}


// get yung mga assignments
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const { id } = await context.params
        const programId = id

        // Ensure membership
        const member = await prisma.programMember.findFirst({ where: { programId, userId: user.id } })
        if (!member) return NextResponse.json({ error: "Not a member of this program" }, { status: 403 });

        const assignments = await prisma.assignment.findMany({
            where: { programId },
            include: { createdBy: { select: { id: true, name: true, image: true } }, submissions: true },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(assignments)
    } catch(error) {
        console.error("Failed to get assignments", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// create assignments
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        const { id } = await context.params
        const programId = id

        const body = await req.json()
        const { title, description, dueDate, attachments } = body as { title?: string; description?: string; dueDate?: string | null; attachments?: FileAttachment[] | null }
        if (!title || typeof title !== "string") return NextResponse.json({ error: "Title required" }, { status: 400 })

        // membership check
        const member = await prisma.programMember.findFirst({ where: { programId, userId: user.id } })
        if (!member) return NextResponse.json({ error: "Not a member of this program" }, { status: 403 })

        // role check
        // if(!["ADMIN", "INSTRUCTOR"].includes(user.role)) return NextResponse.json({ error: "Only admin or instructor can create assignments" }, { status: 403 })

        const assignment = await prisma.assignment.create({
            data: {
                programId,
                title,
                description: description ?? null,
                attachments: Array.isArray(attachments),
                dueDate: dueDate ? new Date(dueDate) : null,
                createdById: user.id
            },
            include: { createdBy: { select: { id: true, name: true, image: true } } }
        })

        // await emitSocketEvent('assignment', 'assignment-created', assignment)

        return NextResponse.json(assignment)

    } catch (error) {
        console.error("Failed to create assignment", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}