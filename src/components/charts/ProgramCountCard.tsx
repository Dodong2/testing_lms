'use client'

import { useState } from "react"
import { useProgram } from "@/hooks/program/useProgram"
import { IoIosArrowUp } from "react-icons/io"

interface ProgramCountCardProps {
    className?: string
}

const ProgramCountCard = ({ className }: ProgramCountCardProps) => {
    const [page] = useState(1)
    const [search] = useState("")
    const { data: programCounts, isLoading, error } = useProgram().usePrograms(page, search)

    if (isLoading) return <p>Loading...</p>
    if (error || !programCounts) return <p>Failed to load program data</p>

    // Example growth calculation: compare current total vs. last month’s (mocked for demo)
    const currentPrograms = programCounts.total
    const lastMonthPrograms = Math.max(currentPrograms - 6, 0) // mock example
    const growthPercent = lastMonthPrograms
        ? Math.round(((currentPrograms - lastMonthPrograms) / lastMonthPrograms) * 100)
        : 0

    return (
        <div
            className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
        >
            <div className="flex flex-col space-y-3">
                <p className="text-gray-600 text-sm font-medium">Existing Programs</p>

                <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-bold text-gray-900">{currentPrograms}</h2>
                    <div className="flex items-center text-green-600">
                        <IoIosArrowUp className="mr-1" size={18} />
                        <span className="font-semibold text-sm">{growthPercent}%</span>
                    </div>
                </div>

                <p className="flex items-center text-xs text-green-700 font-medium">
                    <IoIosArrowUp className="mr-1" size={12} />
                    Increased from last month
                </p>
            </div>
        </div>
    )
}

export default ProgramCountCard
