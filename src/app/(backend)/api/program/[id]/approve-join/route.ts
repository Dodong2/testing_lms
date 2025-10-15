import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { emitSocketEvent } from "@/lib/emitSocketEvent"
import { sendProgramInviteEmail } from "@/lib/email/sendProgramInvite"

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "INSTRUCTOR") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const { userId } = await req.json()

        const joinRequest = await prisma.joinRequest.findFirst({
            where: { programId: id, userId, status: 'PENDING' }
        })

        if (!joinRequest) {
            return NextResponse.json({ error: "No pending request" }, { status: 404 })
        }

        await prisma.$transaction([
            prisma.joinRequest.update({
                where: { id: joinRequest.id },
                data: { status: 'APPROVED' }
            }),
            prisma.programMember.create({
                data: {
                    programId: id,
                    userId
                }
            })
        ])

        await emitSocketEvent("program", "member-added", {
            programId: id,
            newMembers: [userId]
        })

        // Notify the beneficiary
        const user = await prisma.user.findUnique({ where: { id: userId } })
        const program = await prisma.program.findUnique({ where: { id } })

        if (user && program) {
            await sendProgramInviteEmail({
                email: user.email,
                name: user.name,
                programName: program.title,
                role: user.role,
            })
        }

        return NextResponse.json({ success: true, message: "User approved and added to program" })


    } catch (error) {
        console.log("failed to connect approve-join", error)
        return NextResponse.json({ error: "Internal server error " }, { status: 500 })
    }
}