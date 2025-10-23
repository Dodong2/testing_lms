'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useStats } from "@/hooks/stats/useStats";

const PostsPerMonthChart = () => {
  const { data, isLoading, error } = useStats().usePostStats()

  if (isLoading) return <p>Loading chart...</p>;
  if (error || !data) return <p>Failed to load chart data</p>;

  // Optional total this month
  const latestMonth = data[data.length - 1];
  const totalThisMonth = latestMonth?.totalPosts ?? 0;

  return (
    <div className="bg-[#00306E] border border-gray-100 p-4 rounded-2xl shadow-md">
      <h2 className="text-white text-lg font-semibold mb-4">
        Monthly Posts Activity{" "}
        <span className="text-sm text-gray-300">(This month: {totalThisMonth} posts)</span>
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="announcementCount" stackId="a" fill="#3b82f6" name="Announcement" />
          <Bar dataKey="taskCount" stackId="a" fill="#f59e0b" name="Task" />
          {/* <Bar dataKey="normalCount" stackId="a" fill="#16a34a" name="Normal" /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PostsPerMonthChart;
