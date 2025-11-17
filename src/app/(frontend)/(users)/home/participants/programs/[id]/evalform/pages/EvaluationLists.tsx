"use client"

import { useEvaluation } from "@/hooks/evaluations/useEvaluation";
import { useState } from "react";
import EvaluationDetailModal from "@/components/modals/EvaluationDetailModal";
import { EvaluationEntry, RatingCount } from "@/types/evaluationManagetypes";
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

const EvaluationLists = ({ programId, date }: { programId: string, date: string }) => {
  const { data: evaluations, isLoading: evalLoading } = useEvaluation().useEvaluationsByDate(programId, date);
  const { data: edaData, isLoading: edaLoading } = useEvaluation().useEvaluationEDAByDate(programId, date);
  const [selectedEval, setSelectedEval] = useState<EvaluationEntry | null>(null);

  if (evalLoading || edaLoading) return <p className="text-white">Loading...</p>;

  // Format for summary chart
  const summaryData = edaData ? [
    { label: "Strongly Disagree (1)", value: edaData.summary[1] },
    { label: "Disagree (2)", value: edaData.summary[2] },
    { label: "Moderately Agree (3)", value: edaData.summary[3] },
    { label: "Agree (4)", value: edaData.summary[4] },
    { label: "Strongly Agree (5)", value: edaData.summary[5] },
  ] : [];

  // Format ratings for detail charts
  const formatChartData = (ratings: RatingCount[]) =>
    ratings.map((r) => ({ rating: r.value, count: r.count }));

  // Group questions by category
  const parseQuestion = (question: string) => {
    const [category, q] = question.split("_");
    return { category, q };
  };

  const groupedQuestions = edaData?.questionDistributions.reduce<Record<string, typeof edaData.questionDistributions>>((acc, q) => {
    const { category } = parseQuestion(q.question);
    if (!acc[category]) acc[category] = [];
    acc[category].push(q);
    return acc;
  }, {} as Record<string, typeof edaData.questionDistributions>);

  return (
    <>
      <div>
        <h1 className="text-white text-2xl font-bold italic mb-6">
          Submitted on {date}
        </h1>

        {/* Overall Summary Chart */}
        {edaData && (
          <div className="bg-[#00306E] p-4 rounded shadow text-white mb-6">
            <h2 className="font-semibold mb-2">Overall Summary (All Questions)</h2>
            <p className="text-sm mb-4">Total Respondents: {edaData.totalRespondents}</p>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={summaryData}>
                  <CartesianGrid stroke="#FFF" strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fill: "#FFF", fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#FFF" }} />
                  <Tooltip formatter={(value: number) => [value, "Students"]} />
                  <Legend />
                  <Bar dataKey="value" fill="#FFBD17" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Detail Per Question */}
        {groupedQuestions && (
          <div className="space-y-6 mb-6">
            {Object.keys(groupedQuestions)
              .sort((a, b) => {
                if (a === "overall") return 1;
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

        {/* List of Evaluations */}
        <h2 className="text-white text-xl font-bold mb-4">Individual Submissions</h2>
        <div className="space-y-2">
          {evaluations?.map((evalData) => (
            <div
              key={evalData.id}
              onClick={() => setSelectedEval(evalData)}
              className="p-3 rounded-md bg-[#424242] text-white hover:bg-[#5a5a5a] cursor-pointer"
            >
              <p className="font-semibold">{evalData.user.name}</p>
              <p className="text-xs opacity-75">{evalData.user.email}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedEval && (
        <EvaluationDetailModal
          evaluation={selectedEval}
          onClose={() => setSelectedEval(null)}
        />
      )}
    </>
  );
};

export default EvaluationLists;