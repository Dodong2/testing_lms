import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await context.params
    const programId = id

    const meetings = await prisma.meeting.findMany({
      where: {
        programId,
        expiresAt: { gt: new Date() }
      },
      orderBy: { startTime: 'asc' }
    })

    return NextResponse.json(meetings)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await context.params
    const programId = id
    const body = await req.json()
    const { title, link, startTime, endTime } = body

    const expiresAt = new Date(new Date(startTime).getTime() + 24 * 60 * 60 * 1000)

    const meeting = await prisma.meeting.create({
      data: {
        title,
        link,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        expiresAt,
        programId,
        createdBy: session.user.id
      }
    })

    return NextResponse.json(meeting)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}