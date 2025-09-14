import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


// GET notifications for admin (with optional pagination)
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const skip = (page - 1) * limit

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where: { },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.notification.count()
    ])

    return NextResponse.json({
        notifications,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    })

}

// POST: create notification (triggered from backend e.g., after feedback created)
export async function POST(req: NextRequest) {
    const { userId, type, message, referenceId } = await req.json()

    if(!userId || !type || !message) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const notif = await prisma.notification.create({
        data: { userId, type, message, referenceId }
    })

    return NextResponse.json(notif)
}