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

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "5");
        const skip = (page - 1) * limit;

        // Kunin lahat ng programs with their posts and comments count
        const programs = await prisma.program.findMany({
            select: {
                id: true,
                title: true,
                posts: {
                    select: {
                        id: true,
                        comments: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });

        // Calculate posts and comments count per program
        const programStats = programs.map(program => {
            const postsCount = program.posts.length;
            const commentsCount = program.posts.reduce((total, post) => {
                return total + post.comments.length;
            }, 0);

            return {
                id: program.id,
                name: program.title,
                posts: postsCount,
                comments: commentsCount,
                totalActivity: postsCount + commentsCount // Para sa sorting
            };
        });

        // Sort by most active (posts + comments)
        const sortedPrograms = programStats.sort((a, b) => b.totalActivity - a.totalActivity);

        // Apply pagination
        const total = sortedPrograms.length;
        const paginatedPrograms = sortedPrograms.slice(skip, skip + limit);
        const hasMore = skip + limit < total;

        return NextResponse.json({
            programs: paginatedPrograms,
            page,
            limit,
            total,
            hasMore
        });

    } catch (error) {
        console.error("Failed to get active programs", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}