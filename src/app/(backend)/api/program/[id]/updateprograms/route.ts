import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { emitSocketEvent } from "@/lib/emitSocketEvent";


// update ng mga programs para lang sa admin 
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {

        const session = await getServerSession(authOptions)
        if(!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })
        }

        const { id } = await context.params
        const programId = id
        const body = await req.json()
        const { title, subtitle, explanation } = body

        const updatedPrograms = await prisma.program.update({
            where: { id: programId },
            data: {
                title,
                subtitle,
                explanation
            },
        })

        await emitSocketEvent('program',"program-updated", { updatedProgram: updatedPrograms })

        return NextResponse.json({ success: true, program: updatedPrograms })

    } catch(error) {
        console.error(error, 'Failed to update program')
        return NextResponse.json({ error: 'Internal server error' },{ status: 500 })
    }
}