import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* get kung ilan ang kasali sa bawat program for beneficiary & instructors */
export async function GET() {
    const session = await getServerSession(authOptions)
    if(!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const counts = await prisma.programMember.groupBy({
        by: ['programId'],
        _count: {
            userId: true,
        }
    })

    const result = await Promise.all(
        counts.map(async (group) => {
            const instructors = await prisma.programMember.count({
                where: {
                    programId: group.programId,
                    user: { role: 'INSTRUCTOR' },
                },
            })

            const beneficiaries = await prisma.programMember.count({
                where: {
                    programId: group.programId,
                    user: { role: 'BENEFICIARY' }
                },
            })

            return {
                programId: group.programId,
                instructors,
                beneficiaries,
            } 
        })
    )

    return NextResponse.json(result)
}