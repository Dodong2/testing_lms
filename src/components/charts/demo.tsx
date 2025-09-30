"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Jan", sales: 400, users: 240 },
  { name: "Feb", sales: 300, users: 139 },
  { name: "Mar", sales: 200, users: 980 },
  { name: "Apr", sales: 278, users: 390 },
  { name: "May", sales: 189, users: 480 },
  { name: "Jun", sales: 239, users: 380 },
];


const COLORS = ["#2563eb", "#16a34a", "#f59e0b"];

export default function DashboardPage() {
  return (
    <div className="p-6 grid gap-8 md:grid-cols-2">
      {/* Line Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Monthly Sales & Users</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#2563eb" />
            <Bar dataKey="users" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      
    </div>
  );
}
