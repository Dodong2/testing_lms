import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { programId, name, address, sex, contactNumber, date } = body

        // Validate required fields
        if (!programId || !name || !address || !sex || !contactNumber || !date) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if user already submitted attendance for this date
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                programId,
                userId: session.user.id,
                date,
            },
        });

        if (existingAttendance) {
            return NextResponse.json(
                { error: "You have already submitted attendance for this date" },
                { status: 400 }
            );
        }

        // Create attendance
        const attendance = await prisma.attendance.create({
            data: {
                programId,
                userId: session.user.id,
                name,
                address,
                sex,
                contactNumber,
                date,
            },
        });

        return NextResponse.json(attendance, { status: 201 });

    } catch (error) {
        console.error("ERROR creating attendance:", error);
        return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 });
    }
}