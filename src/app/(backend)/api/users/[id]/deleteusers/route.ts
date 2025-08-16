import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { emitSocketEvent } from "@/lib/emitSocketEvent";


export async function DELETE(req: NextRequest, { params }: { params: { id:string } }) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
        }

        const { id } = params
        const UserId = id

        const users = await prisma.user.findUnique({
            where: { id: UserId }
        })

        if(!users) {
            return NextResponse.json({ error: 'User doesnt exist' },{ status: 404 })
        }

        await prisma.user.delete({
            where: { id: UserId }
        })

        await emitSocketEvent("user", "user-deleted", { id: UserId })

        return NextResponse.json({ success: true, message: 'User deleted' })

    } catch(error) {
        console.error(error, 'Failed to Delete User')
        return NextResponse.json({ error: 'Interval server error' }, { status: 500 })
    }
}