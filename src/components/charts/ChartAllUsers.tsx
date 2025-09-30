'use client'
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
/* Hooks */
import { useUsers } from "@/hooks/users/useUsers";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b"];

const ChartAllUsers = () => {
    const { data: userRoleStats, isLoading, error } = useUsers().useUserRoleStats()

    if (isLoading) return <p>Loading...</p>
    if (error || !userRoleStats) return <p>Failed to load role stats</p>

    const pieData = [
        { name: "Admins", value: userRoleStats.admins },
        { name: "instructors", value: userRoleStats.instructors },
        { name: "Beneficiary", value: userRoleStats.beneficiaries },
    ]

    return (
        <div className="bg-white p-4 rounded-2xl shadow-md md:col-span-2">
            {/* Pie Chart */}
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold mb-1">User Roles Distribution</h2>
                <div className="text-gray-600"> Total Users <span className="text-2xl font-bold">{userRoleStats.total}</span></div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ChartAllUsers