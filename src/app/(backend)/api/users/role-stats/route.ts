import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // count bawat role
        const [admins, instructors, beneficiaries] = await Promise.all([
            prisma.user.count({ where: { role: "ADMIN" } }),
            prisma.user.count({ where: { role: "INSTRUCTOR" } }),
            prisma.user.count({ where: { role: "BENEFICIARY" } }),
        ])

        // bilang ng lahat ng users
        const total = admins + instructors + beneficiaries

        return NextResponse.json({
            admins,
            instructors,
            beneficiaries,
            total
        })
    
    } catch (error) {
        console.error("Failed to get role stats", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}