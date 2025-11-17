import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type EvaluationRatings = {
  content: number[];
  materials: number[];
  resourcePerson: number[];
  overall: number[];
};

type Distribution = Record<1 | 2 | 3 | 4 | 5, number>;

type SummaryDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

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
  summary: SummaryDistribution;
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; date: string }> }
) {
  try {
    const { id: programId, date } = await params;

    // Fetch evaluations for this specific date ONLY
    const evaluations = await prisma.evaluation.findMany({
      where: { programId, date },
      select: { ratings: true }
    });

    if (evaluations.length === 0) {
      return NextResponse.json({
        totalRespondents: 0,
        questionDistributions: [],
        summary: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    // Process ratings
    const questionMap: Record<string, number[]> = {};
    const summary: Distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

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
        if (rating >= 1 && rating <= 5) {
          const key = rating as 1 | 2 | 3 | 4 | 5;
          distribution[key]++;
          summary[key]++;
        }
      });

      const ratings: RatingCount[] = (Object.entries(distribution) as [
        string,
        number
      ][]).map(([value, count]) => ({
        value: Number(value),
        count
      }));

      return {
        question,
        totalAnswers: values.length,
        ratings
      };
    });

    const response: EDAResponse = {
      totalRespondents: evaluations.length,
      questionDistributions,
      summary
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("ERROR getting historical EDA for date:", error);
    return NextResponse.json(
      { error: "Failed to load EDA data" },
      { status: 500 }
    );
  }
}