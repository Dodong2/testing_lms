"use client"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { RatingCount } from "@/types/evaluationManagetypes";

interface QuestionItem {
  question: string;
  ratings: RatingCount[];
}

interface QuestionChartsProps {
  groupedQuestions: Record<string, QuestionItem[]>;
}

const QuestionCharts = ({ groupedQuestions }: QuestionChartsProps) => {
  const formatChartData = (ratings: RatingCount[]) =>
    ratings.map((r) => ({ rating: r.value, count: r.count }));

  return (
    <div className="space-y-2">
      {Object.keys(groupedQuestions)
        .sort((a, b) => {
          if (a === "overall") return 1;
          if (b === "overall") return -1;
          return 0;
        })
        .map((category) => (
          <div key={category}>
            <h2 className="font-bold text-white text-lg mb-2 text-center">
              {category.toUpperCase()}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedQuestions[category].map((q) => (
                <div
                  key={q.question}
                  className="bg-[#00306E] p-2 rounded shadow text-white border border-transparent hover:border-gray-100 transition"
                >
                  <h3 className="font-semibold mb-1">{q.question}</h3>

                  <div style={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <BarChart data={formatChartData(q.ratings)}>
                        <CartesianGrid stroke="#FFF" strokeDasharray="3 3" />
                        <XAxis dataKey="rating" tick={{ fill: "white" }} />
                        <YAxis allowDecimals={false} tick={{ fill: "white" }} />
                        <Tooltip
                          formatter={(value: number) => [value, "Students"]}
                          cursor={{ fill: "rgba(255,255,255,0.2)" }}
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
  );
};

export default QuestionCharts;
