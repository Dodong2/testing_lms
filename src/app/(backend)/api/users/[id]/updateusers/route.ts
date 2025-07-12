import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

type Context ={
    params: {
        id: string
    }
}

// pang update ng users for admin only
export async function PATCH(req: NextRequest, context: Context ) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
        }

        const { id } = await context.params
        const UserId = id
        const body = await req.json()
        const { name, email, role } = body

        const updatedUsers = await prisma.user.update({
            where: { id: UserId },
            data : {
                name,
                email,
                role
            }
        })

        return NextResponse.json({ success: true, user: updatedUsers })

    } catch(error) {
        console.error(error, 'Failed to Update User')
        return NextResponse.json({ error: 'Internal server error' },{ status: 500 })
    }
}