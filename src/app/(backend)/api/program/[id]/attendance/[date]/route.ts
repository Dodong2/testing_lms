import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; date: string }> }
) {
    try {
        const { id: programId, date } = await params;

        // Fetch all attendances for that date
        const attendances = await prisma.attendance.findMany({
            where: {
                programId,
                date,
            },
            select: {
                id: true,
                name: true,
                address: true,
                sex: true,
                contactNumber: true,
                date: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(attendances);
    } catch (error) {
        console.error("ERROR getting attendances per date:", error);
        return NextResponse.json(
            { error: "Failed to load attendances" },
            { status: 500 }
        );
    }
}