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

const OverallSummary = ({ programId }: { programId: string }) => {
    const { data, isLoading } = useEDA(programId).useDailyEDA()
    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>Loading...</p>;

    const summaryData = [
        { label: "Strongly Disagree (1)", value: data.summary[1] },
        { label: "Disagree (2)", value: data.summary[2] },
        { label: "Moderately Agree (3)", value: data.summary[3] },
        { label: "Agree (4)", value: data.summary[4] },
        { label: "Strongly Agree (5)", value: data.summary[5] },
    ];

    return (
        <div className="bg-[#00306E] p-4 rounded shadow text-white">
        <h2 className="font-semibold mb-2">Overall Summary (All Questions)</h2>

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
    )
}

export default OverallSummary