import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
            return NextResponse.json({ error: "No pending request found" }, { status: 404 })
        }

        await prisma.joinRequest.update({
            where: { id: joinRequest.id },
            data: { status: 'REJECTED' }
        })


        return NextResponse.json({ success: true, message: "Join request rejected" })

    } catch (error) {
        console.log("failed to connect reject-join", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}