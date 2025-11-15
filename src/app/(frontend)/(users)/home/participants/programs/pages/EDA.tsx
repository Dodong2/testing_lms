"use client";

import { useState } from "react";
import { useEDA } from "@/hooks/evaluations/useEDA";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RatingCount } from "@/types/evaluationManagetypes";

export default function EDA({ programId }: { programId: string }) {
  const { useDailyEDA } = useEDA(programId);
  const { data, isLoading } = useDailyEDA();
  const [todayEval, setTodayEval] = useState(false);

  if (isLoading) return <p>Loading...</p>;

  const handleToggle = () => setTodayEval((prev) => !prev);

  // Format ratings for Recharts
  const formatChartData = (ratings: RatingCount[]) =>
    ratings.map((r) => ({ rating: r.value, count: r.count }));

  // Helper to extract category and question number
  const parseQuestion = (question: string) => {
    const [category, q] = question.split("_");
    return { category, q };
  };

  // Group questions by category
  const groupedQuestions = data?.questionDistributions.reduce<Record<string, typeof data.questionDistributions>>((acc, q) => {
    const { category } = parseQuestion(q.question);
    if (!acc[category]) acc[category] = [];
    acc[category].push(q);
    return acc;
  }, {} as Record<string, typeof data.questionDistributions>);

  return (
    <div className="space-y-6 rounded-md shadow mt-3">
      <h1 className="font-bold text-lg text-white">Evaluation Summary (Daily)</h1>
      <p className="text-white">Total Respondents Today: {data?.totalRespondents}</p>
      <button
        onClick={handleToggle}
        className="bg-[#00306E] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 active:scale-90"
      >
        Today eval
      </button>

      {todayEval && groupedQuestions && (
  <div className="space-y-6 mt-4">
    {Object.keys(groupedQuestions)
      .sort((a, b) => {
        if (a === "overall") return 1;       // push overall to the end
        if (b === "overall") return -1;
        return 0;
      })
      .map((category) => (
        <div key={category}>
          <h2 className="font-bold text-white text-lg mb-2">{category.toUpperCase()}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedQuestions[category].map((q) => (
              <div key={q.question} className="bg-[#00306E] p-4 rounded shadow text-white">
                <h3 className="font-semibold mb-1">{q.question}</h3>
                {/* <p>Total answers: {q.totalAnswers}</p> */}
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={formatChartData(q.ratings)}>
                      <CartesianGrid stroke="#FFF" strokeDasharray="3 3" />
                      <XAxis dataKey="rating" tick={{ fill: "white" }} />
                      <YAxis allowDecimals={false} tick={{ fill: "white" }} />
                      <Tooltip
                        formatter={(value: number) => [value, "Students"]}
                        cursor={{ fill: "rgba(255, 255, 255, 0.2)" }}
                      />
                      <Legend wrapperStyle={{ color: "white" }} />
                      <Bar dataKey="count" fill="#FFBD17" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
  </div>
)}
    </div>
  );
}
