import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// get all request to join lists
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const joinRequests = await prisma.joinRequest.findMany({
      where: { programId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // console.log("Fetched join requests:", joinRequests)
    return NextResponse.json(joinRequests)

  } catch (error) {
    console.log("failed to connect join-request API", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}