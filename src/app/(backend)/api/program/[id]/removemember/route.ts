import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emitSocketEvent } from "@/lib/emitSocketEvent";

type Context = {
    params: { id: string }
}

export async function DELETE(req: NextRequest, context: Context) {
    try{
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const programId = id
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
    })

    if(!user) {
        return NextResponse.json({ error: 'User not found' },{ status: 404 })
    }

    await prisma.programMember.deleteMany({
        where: {
            programId,
            userId: user.id
        }
    })

    emitSocketEvent("program", "remove-member", {
            programId, removedUserId: user.id
        })

    return NextResponse.json({ success: true })

    } catch(error) {
        console.error(error)
        return NextResponse.json({ error: "Internal Error" },{ status: 500 })
    }
}
