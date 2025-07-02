import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";


//Get yung mga programs
export async function GET() {
    const session = await getServerSession(authOptions)
    if(!session) return NextResponse.json({ programs:[] })

    const userId = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: { id: true }
    })

    const programs = await prisma.program.findMany({
        where: {
            members: { some: { userId: userId?.id } }
        }
    })

    return NextResponse.json({ programs })
}

// gagawa ng programs
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if(!session || session.user.role !== 'ADMIN') 
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, subtitle, explanation, emails } = body

    const admin = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if(!admin) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })

        const  program = await prisma.program.create({
            data: {
                title,
                subtitle,
                explanation,
                adminId: admin.id
            }
        })

        const users = await prisma.user.findMany({
            where: { email: { in: emails } }
        })

        await prisma.programMember.createMany({
            data: [ ...users.map(user => ({
                programId: program.id,
                userId: user.id
            })),
            {
                programId: program.id,
                userId: admin.id
            }
        ],
            skipDuplicates: true
        })
        return NextResponse.json({ success: true, program })
}