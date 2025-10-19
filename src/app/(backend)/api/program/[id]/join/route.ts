import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { emitSocketEvent } from "@/lib/emitSocketEvent";

// for beneficiary request to join program
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "BENEFICIARY") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const programId = id

        const program = await prisma.program.findUnique({ where: { id: programId } })
        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 })
        }

        // Check if already a member
        const existingMember = await prisma.programMember.findUnique({
            where: {
                programId_userId: { programId, userId: session.user.id },
            },
        })
        if (existingMember) {
            return NextResponse.json({ error: "Already joined" }, { status: 400 })
        }

        // Check if already requested
        const existingRequest = await prisma.joinRequest.findFirst({
            where: {
                programId,
                userId: session.user.id,
                status: "PENDING"
            },
        })
        if (existingRequest) {
            return NextResponse.json({ error: "Already requested" }, { status: 400 })
        }

        const newRequest = await prisma.joinRequest.create({
            data: { programId, userId: session.user.id },
        })

        await emitSocketEvent("program", "join-request-created", {
            programId,
            userId: session.user.id,
            requestId: newRequest.id,
        });

        return NextResponse.json({ success: true, message: "Join request sent" })

    } catch (error) {
        console.log("failed to connect server join API", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}