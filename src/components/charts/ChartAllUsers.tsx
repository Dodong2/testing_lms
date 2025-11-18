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
        <div className="bg-[#00306E] p-4 border border-transparent hover:border-gray-100 transition rounded-2xl shadow-md flex flex-col  text-white">
            {/* Pie Chart */}
            <div className="flex flex-col text-left">
                <h2 className="text-lg text-white font-semibold mb-1">User Roles Distribution</h2>
                <div className="text-white"> Total Users: <span className="text-2xl font-bold">{userRoleStats.total}</span></div>
            </div>
            <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Legend
                        layout="vertical"
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ marginRight: '-20px' }}
                    />
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={85}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />

                </PieChart>
            </ResponsiveContainer>
        </div>
        </div>
    )
}

export default ChartAllUsers