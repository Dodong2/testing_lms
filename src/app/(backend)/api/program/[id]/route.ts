import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";


// ito yung pang get ng programs by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = params
        const programId = id

        const program = await prisma.program.findUnique({
            where: { id: programId },
            include: {
                members: {
                    include: { user: true }
                }
            }
        })

        if (!program) {
            return NextResponse.json({ error: "Program not found" }, { status: 404 })
        }

        return NextResponse.json(program)


    } catch(error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal server error' },{ status: 500 })
    }
} 