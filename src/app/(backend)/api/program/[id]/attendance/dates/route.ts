import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: programId } = await params;

        const dates = await prisma.attendance.findMany({
            where: { programId },
            select: { date: true },
            distinct: ["date"],
            orderBy: { date: "desc" },
        });

        return NextResponse.json(dates);
    } catch (error) {
        console.error("Failed to load attendance dates:", error);
        return NextResponse.json(
            { error: "Failed to load attendance dates" },
            { status: 500 }
        );
    }
}