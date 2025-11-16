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

// 🧠 Determine if date is NOT Monday
function isNotSameWeek(startDate: Date): boolean {
  const today = new Date();
  const todayIsMonday = today.getDay() === 1; // Monday = 1
  const savedIsMonday = startDate.getDay() === 1;

  // If today is Monday and latest record is NOT Monday → reset
  return todayIsMonday && !savedIsMonday;
}

// 🧠 Group into content_Q1, overall_Q1, etc.
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: programId } = await params;

    const evaluations = await prisma.evaluation.findMany({
      where: { programId },
      select: { ratings: true, createdAt: true }
    });

    // 🧹 WEEKLY AUTO-RESET → If Today = Monday AND last record is NOT Monday
    if (evaluations.length > 0) {
      const latest = evaluations[evaluations.length - 1];

      if (isNotSameWeek(latest.createdAt)) {
        const empty: SummaryDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        const resetData: EDAResponse = {
          totalRespondents: 0,
          questionDistributions: [],
          summary: empty
        };

        return NextResponse.json(resetData);
      }
    }

    // 🧠 If NOT reset → process data normally
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

    const totalRespondents = evaluations.length;

    const response: EDAResponse = {
      totalRespondents,
      questionDistributions,
      summary
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
