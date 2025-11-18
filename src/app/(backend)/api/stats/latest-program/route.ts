import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Kunin yung latest program based sa createdAt
        const latestProgram = await prisma.program.findFirst({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                title: true,
                createdAt: true
            }
        });

        if (!latestProgram) {
            return NextResponse.json({ 
                program: null 
            });
        }

        return NextResponse.json({
            program: {
                id: latestProgram.id,
                name: latestProgram.title,
                createdAt: latestProgram.createdAt
            }
        });

    } catch (error) {
        console.error("Failed to get latest program", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}