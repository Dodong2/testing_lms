import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; date: string }> }
) {
  try {
    const { id: programId, date } = await params;

    // Fetch all evaluations for that date
    const evaluations = await prisma.evaluation.findMany({
      where: {
        programId,
        date,
      },
      select: {
        id: true,
        name: true,
        titleOfSeminar: true,
        venue: true,
        suggestions: true,
        ratings: true,
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

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error("ERROR getting evaluations per date:", error);
    return NextResponse.json(
      { error: "Failed to load evaluations" },
      { status: 500 }
    );
  }
}
