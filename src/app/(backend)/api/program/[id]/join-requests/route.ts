import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user.role === 'INSTRUCTOR') return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { id } = await context.params

        const requests = await prisma.joinRequest.findMany({
            where: {
                programId: id,
                status: "PENDING"
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        })
        
        return NextResponse.json({ requests })

    } catch(error) {
        console.log("failed to connect join-request API", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}