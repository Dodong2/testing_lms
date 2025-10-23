'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useStats } from "@/hooks/stats/useStats";

 const ChartUserRegistrations = () => {
  const { data, isLoading, error } = useStats().userUserRegistrations()

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Failed to load user registration stats</p>;

  return (
    <div className="bg-[#00306E] border border-gray-100 p-4 rounded-2xl shadow-md md:col-span-2 ">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Monthly User Registrations</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="admin" stroke="#f59e0b" strokeWidth={2} />
          <Line type="monotone" dataKey="instructor" stroke="#2563eb" strokeWidth={2} />
          <Line type="monotone" dataKey="beneficiary" stroke="#16a34a" strokeWidth={2} />
          <Line type="monotone" dataKey="total" stroke="#9333ea" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default ChartUserRegistrations