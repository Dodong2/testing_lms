import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// create feedback by user
export async function POST(req: NextResponse) {
    try {
        const session = await getServerSession(authOptions)
        if(!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { subject, description, type, visibility, programId } = await req.json()

        if(!subject || !description || !type || !visibility || !programId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const feedback = await prisma.feedback.create({
            data: {
                subject,
                description,
                type,
                visibility,
                programId,
                userId: session?.user.id,
            }, 
            include: {
                user: true,
                program: true
            }
        })

        return NextResponse.json(feedback)
    } catch(error) {
        console.error('Failed to create feedback', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// get feedback for admin
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session?.user.role === 'ADMIN'  ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const feedbacks = await prisma.feedback.findMany({
            include: {
                user: true,
                program: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(feedbacks)

    } catch(error) {
        console.error('Failed to get feedbacks', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}