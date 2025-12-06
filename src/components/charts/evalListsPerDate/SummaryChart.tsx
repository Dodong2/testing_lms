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

interface SummaryChartProps {
  totalRespondents: number;
  data: { label: string; value: number }[];
}

const SummaryChart = ({ totalRespondents, data }: SummaryChartProps) => {
  return (
    <div className="bg-[#00306E] p-3 rounded shadow text-white mb-6 border border-transparent hover:border-gray-100 transition">
      <h2 className="font-semibold mb-2">Overall Summary (All Questions)</h2>
      <p className="text-sm mb-4">Total Respondents: {totalRespondents}</p>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="#FFF" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: "#FFF", fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#FFF" }} />
            <Tooltip formatter={(v: number) => [v, "Rating"]} />
            <Legend />
            <Bar dataKey="value" fill="#FFBD17" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SummaryChart;
