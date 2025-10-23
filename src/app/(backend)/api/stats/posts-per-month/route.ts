import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const now = new Date()
        const months = Array.from({ length: 12 }, (_, i) => subMonths(now, i)).reverse()

        const data = await Promise.all(
            months.map(async (month) => {
                const start = startOfMonth(month)
                const end = endOfMonth(month)

                // Count total posts this month
                const totalPosts = await prisma.post.count({
                    where: {
                        createdAt: {
                            gte: start,
                            lte: end,
                        }
                    }
                })

                // Count total posts this month
                const announcementCount = await prisma.post.count({
                    where: {
                        tag: "ANNOUNCEMENT",
                        createdAt: {
                            gte: start,
                            lte: end
                        }
                    }
                })

                const taskCount = await prisma.post.count({
                    where: {
                        tag: "TASK",
                        createdAt: {
                            gte: start,
                            lte: end,
                        }
                    }
                })

                // const normalCount = await prisma.post.count({
                //     where: {
                //         tag: "NORMAL",
                //         createdAt: {
                //             gte: start,
                //             lte: end,
                //         }
                //     }
                // })

                return {
                    month: start.toLocaleString("default", { month: "short" }),
                    totalPosts,
                    announcementCount,
                    taskCount,
                    // normalCount,
                }
            })
        )

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching post stats:", error);
        return NextResponse.json({ error: "Failed to fetch post stats" }, { status: 500 });
    }
}