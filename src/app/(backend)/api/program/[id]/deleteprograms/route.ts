import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emitSocketEvent } from "@/lib/emitSocketEvent";


// delete ang programs admin lang ang makaka-delete
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
try {
    const session = await getServerSession(authOptions)

    // 1. Check for admin privileges
    if(!session || session.user.role !== 'ADMIN')
        return NextResponse.json({ error: 'Unauthorized' },{ status: 401 })

    // Next15 Dynamic APIs are Asynchronous (required to do this)
    const {id} = params

    // 2. Get program ID from URL
    const programId = id

    // 3. Find the program
    const programs = await prisma.program.findUnique({
        where: { id: programId }
    })

    if(!programs) {
        return NextResponse.json({ error: 'Program doesnt exist' }, { status: 404 })
    }

    // 4. Delete the program
    await prisma.program.delete({
        where: { id: programId }
    })

    await emitSocketEvent('program',"program-deleted", { id: programId })
    // 5. Return success response
    return NextResponse.json({ success: true, message: 'Program deleted' })

} catch(error){
    console.error('Failed to delete programs', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

}