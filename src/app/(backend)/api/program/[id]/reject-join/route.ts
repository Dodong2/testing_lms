import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { emitSocketEvent } from "@/lib/emitSocketEvent";

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
            return NextResponse.json({ error: "No pending request found" }, { status: 404 })
        }

        // Update to REJECTED
        const updatedRequest = await prisma.joinRequest.update({
            where: { id: joinRequest.id },
            data: { status: 'REJECTED' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        image: true
                    }
                }
            }
        })

        // Emit socket event to notify all connected clients
        await emitSocketEvent("program", `join-request-updated:${id}`, {
            programId: id,
            userId,
            status: 'REJECTED',
            requestId: joinRequest.id
        })

        return NextResponse.json({
            success: true,
            message: "Join request rejected",
            request: updatedRequest
        })

    } catch (error) {
        console.error("failed to reject join request", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}