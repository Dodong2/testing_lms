import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { emitSocketEvent } from "@/lib/emitSocketEvent"
import { sendProgramInviteEmail } from "@/lib/email/sendProgramInvite"

// instructor approve join on program
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "INSTRUCTOR") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const { userId } = await req.json()

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 })
        }

        const joinRequest = await prisma.joinRequest.findFirst({
            where: { programId: id, userId, status: 'PENDING' }
        })

        if (!joinRequest) {
            return NextResponse.json({ error: "No pending request" }, { status: 404 })
        }

        // Check if already a member
        const existingMember = await prisma.programMember.findUnique({
            where: {
                programId_userId: { programId: id, userId }
            }
        })

        if (existingMember) {
            // Just update request status to APPROVED
            await prisma.joinRequest.update({
                where: { id: joinRequest.id },
                data: { status: 'APPROVED' }
            })
        } else {
            // Update request AND add as member
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
        }

        // Emit socket event
        await emitSocketEvent("program", "member-approved", {
            programId: id,
            userId,
            status: 'APPROVED',
            requestId: joinRequest.id
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

        return NextResponse.json({
            success: true,
            message: "User approved and added to program"
        })

    } catch (error) {
        console.error("failed to approve join request", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}