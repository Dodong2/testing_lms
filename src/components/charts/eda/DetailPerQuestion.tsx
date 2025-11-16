'use client'
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
/* hooks */
import { useEDA } from "@/hooks/evaluations/useEDA"
/* types */
import { RatingCount } from "@/types/evaluationManagetypes";


const DetailPerQuestion = ({ programId }: { programId: string }) => {
    const { data, isLoading } = useEDA(programId).useDailyEDA()
    if (isLoading) return <p>Loading...</p>;

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
    <div>
         {groupedQuestions && (
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
  )
}

export default DetailPerQuestion