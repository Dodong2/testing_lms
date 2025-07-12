import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

//pang get lahat ng users for admin only
export async function GET() {
    try {
    const session = await getServerSession(authOptions)
    if(!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
    }

    const usersLists = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            // ProgramMember: {
            //     select: {
            //         program: {
            //             select: {
            //                 id: true,
            //                 title: true
            //             }
            //         }
            //     }
            // }
        }
    })

    return NextResponse.json(usersLists)

    } catch(error) {
        console.error(error, 'failed to get users')
        return NextResponse.json({ error: 'Internal server error' },{ status: 500 })
    }
}