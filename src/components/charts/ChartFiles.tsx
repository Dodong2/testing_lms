'use client'
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
/* Hooks */
import { useStats } from "@/hooks/stats/useStats";
/* icons */
import { FaRegFolderOpen } from "react-icons/fa";


const COLORS = ["#2563eb", "#16a34a"];

const ChartFiles = () => {
    const { data: filesStats, isLoading, error } = useStats().useFilesStats()

    if (isLoading) {
        return (
            <div className="bg-[#00306E] p-4 rounded-2xl shadow-md text-white border border-gray-100 h-[100px] flex items-center justify-center">
                <p className="text-gray-300">Loading...</p>
            </div>
        )
    }
    
    if (error || !filesStats) return <p>Failed to load files stats</p>

    const pieData = [
        { name: "Instructors", value: filesStats.instructorFiles },
        { name: "Beneficiary", value: filesStats.beneficiaryFiles },
    ]

    // Kunin yung role na may pinaka maraming files
    const mostFilesText = filesStats.mostFilesRole === "TIE"
        ? "Equal files"
        : filesStats.mostFilesRole === "INSTRUCTOR"
            ? "Most files: Instructor"
            : "Most files: Beneficiary";

    return (
        <div className="bg-[#00306E] p-4 border border-transparent hover:border-gray-100 transition rounded-2xl shadow-md flex flex-col text-white">
            {/* Pie Chart */}
            <div className="flex flex-col text-left">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2 mb-1">
                        <FaRegFolderOpen className="w-5 h-5 text-blue-400" />
                        <h3 className="text-sm font-semibold text-gray-300">Files Uploaded</h3>
                    </div>
                    <div className="text-sm text-gray-300 mt-1">{mostFilesText}</div></div>
                <div className="text-white mb-1">
                    Total Files: <span className="text-2xl font-bold">{filesStats.total}</span>
                </div>

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

export default ChartFiles