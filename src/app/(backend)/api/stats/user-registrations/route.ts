import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const currentYear = new Date().getFullYear()

        // Fetch all users with role changes this year
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    // New users with roleUpdatedAt
                    {
                        roleUpdatedAt: {
                            gte: new Date(`${currentYear}-01-01`),
                            lte: new Date(`${currentYear}-12-31`),
                        }
                    },
                    // Old users (before roleUpdatedAt was added)
                    {
                        AND: [
                            { roleUpdatedAt: { equals: null } },
                            {
                                createdAt: {
                                    gte: new Date(`${currentYear}-01-01`),
                                    lte: new Date(`${currentYear}-12-31`),
                                }
                            }
                        ]
                    }
                ]
            },
            select: {
                createdAt: true,
                roleUpdatedAt: true,
                role: true
            }
        })

        // Aggregate by month
        const monthCounts: Record<string, { total: number; admin: number; instructor: number; beneficiary: number }> = {};

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        months.forEach((m) => {
            monthCounts[m] = { total: 0, admin: 0, instructor: 0, beneficiary: 0 };
        });

        users.forEach((user) => {
            // Use roleUpdatedAt if available, otherwise use createdAt
            const dateToUse = user.roleUpdatedAt ?? user.createdAt
            const date = new Date(dateToUse)
            const month = date.toLocaleString("default", { month: "short" })

            monthCounts[month].total++
            if (user.role === 'ADMIN') monthCounts[month].admin++
            if (user.role === 'INSTRUCTOR') monthCounts[month].instructor++
            if (user.role === 'BENEFICIARY') monthCounts[month].beneficiary++
        })

        // Convert to array for Recharts
        const chartData = months.map((m) => ({
            month: m,
            total: monthCounts[m].total,
            admin: monthCounts[m].admin,
            instructor: monthCounts[m].instructor,
            beneficiary: monthCounts[m].beneficiary,
        }))

        return NextResponse.json(chartData)
    } catch (error) {
        console.error("Failed to get monthly registrations:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}