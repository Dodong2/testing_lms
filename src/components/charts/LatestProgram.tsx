'use client'
import React from 'react'
import { useStats } from '@/hooks/stats/useStats';
import { FaRegCalendarAlt } from "react-icons/fa";
import { format } from 'date-fns'

const LatestProgram = () => {
    const { data, isLoading, error } = useStats().useLatestProgram()

    if (isLoading) {
        return (
            <div className="bg-[#00306E] p-4 rounded-2xl shadow-md text-white border border-gray-100 h-[100px] flex items-center justify-center">
                <p className="text-gray-300">Loading...</p>
            </div>
        )
    }

    if (error || !data?.program) {
        return (
            <div className="bg-[#00306E] p-4 rounded-2xl shadow-md text-white border border-gray-100 h-[100px] flex items-center justify-center">
                <p className="text-gray-400">No programs yet</p>
            </div>
        )
    }

    const program = data.program
    const formattedDate = format(new Date(program.createdAt), 'MMM dd, yyyy')

    return (
        <div className="bg-[#00306E] p-4 rounded-2xl shadow-md text-white border border-transparent hover:border-gray-100 transition flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-1">
                <FaRegCalendarAlt className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-gray-300">Latest Program</h3>
            </div>
            
            <div>
                <h2 className="text-xl font-bold text-white truncate" title={program.name}>
                    {program.name}
                </h2>
                <p className="text-xs text-gray-300 mt-1">
                    Created: <span className="font-semibold text-blue-400">{formattedDate}</span>
                </p>
            </div>
        </div>
    )
}

export default LatestProgram