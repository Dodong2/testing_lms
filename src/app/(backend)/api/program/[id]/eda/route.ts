// api/program/[id]/eda/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type EvaluationRatings = {
  content: number[];
  materials: number[];
  resourcePerson: number[];
  overall: number[];
};

type Distribution = Record<1 | 2 | 3 | 4 | 5, number>;

type RatingCount = {
  value: number;
  count: number;
};

type QuestionDistribution = {
  question: string;
  totalAnswers: number;
  ratings: RatingCount[];
};

type EDAResponse = {
  totalRespondents: number;
  questionDistributions: QuestionDistribution[];
};

function extractRatings(raw: EvaluationRatings): Record<string, number[]> {
  const map: Record<string, number[]> = {};
  Object.entries(raw).forEach(([category, values]) => {
    values.forEach((rating, idx) => {
      const questionName = `${category}_Q${idx + 1}`;
      if (!map[questionName]) map[questionName] = [];
      map[questionName].push(rating);
    });
  });
  return map;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: programId } = await params;
    const evaluations = await prisma.evaluation.findMany({
      where: { programId },
      select: { ratings: true },
    });

    const questionMap: Record<string, number[]> = {};

    evaluations.forEach((evaluation) => {
      const extracted = extractRatings(evaluation.ratings as EvaluationRatings);
      Object.entries(extracted).forEach(([question, values]) => {
        if (!questionMap[question]) questionMap[question] = [];
        questionMap[question].push(...values);
      });
    });

    const questionDistributions: QuestionDistribution[] = Object.entries(
      questionMap
    ).map(([question, values]) => {
      const distribution: Distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      values.forEach((rating) => {
        if (rating >= 1 && rating <= 5) distribution[rating as 1 | 2 | 3 | 4 | 5]++;
      });

      const ratings: RatingCount[] = (Object.entries(distribution) as [
        string,
        number
      ][]).map(([value, count]) => ({ value: Number(value), count }));

      return {
        question,
        totalAnswers: values.length,
        ratings,
      };
    });

    const totalRespondents = evaluations.length;

    const response: EDAResponse = {
      totalRespondents,
      questionDistributions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load EDA data" },
      { status: 500 }
    );
  }
}
