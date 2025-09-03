import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { emitSocketEvent } from "@/lib/emitSocketEvent";

// create feedback by user
export async function POST(req: NextRequest) {
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

        await emitSocketEvent('feedback', 'feedback-created', feedback)

        return NextResponse.json(feedback)
    } catch(error) {
        console.error('Failed to create feedback', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


// get feedback for admin with pagination
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1", 10)
        const limit = parseInt(searchParams.get("limit") || "5", 10)

        const skip = (page - 1) * limit

        const [feedbacks, total] = await Promise.all([
            prisma.feedback.findMany({
                include: {
                    user: true,
                    program: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.feedback.count(),
        ])

        return NextResponse.json({
            feedbacks,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        })

    } catch (error) {
        console.error("Failed to get feedbacks", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}