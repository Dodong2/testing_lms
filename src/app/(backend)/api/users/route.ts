import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma, Role } from "@prisma/client";

//pang get lahat ng users for admin only
// export async function GET() {
//     try {
//     const session = await getServerSession(authOptions)
//     if(!session || session.user.role !== 'ADMIN') {
//         return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
//     }

//     const usersLists = await prisma.user.findMany({
//         select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//             ProgramMember: {
//                 select: {
//                     program: {
//                         select: {
//                             id: true,
//                             title: true
//                         }
//                     }
//                 }
//             }
//         }
//     })

//     return NextResponse.json(usersLists)

//     } catch(error) {
//         console.error(error, 'failed to get users')
//         return NextResponse.json({ error: 'Internal server error' },{ status: 500 })
//     }
// }

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
        }

        // query params
        const params = Object.fromEntries(req.nextUrl.searchParams)
        const search = params.search ?? ""
        const page = Number(params.page) || 1
        const limit = Number(params.limit) || 6

        const where: Prisma.UserWhereInput = search ? {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                // check kung valid enum value yung search
                ...(Object.values(Role).includes(search.toUpperCase() as Role) ? [{ role: search.toUpperCase() as Role }] : []),
            ]
        } : {}

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    ProgramMember: {
                        select: {
                            program: { select: { id: true, title: true } },
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { name: "asc" },
            }),
            prisma.user.count({ where })
        ])

        return NextResponse.json({
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })

    } catch (error) {
        console.error(error, 'Failed to get users')
        return NextResponse.json({ error: 'Internal server error' },{ status: 500 })
    }
}