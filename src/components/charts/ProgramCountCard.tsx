'use client'
import { useState } from "react"
import { useProgram } from "@/hooks/program/useProgram"
/* icons */
import { RiOrganizationChart } from "react-icons/ri";

interface ProgramCountCardProps {
  className?: string
}


const ProgramCountCard = ({ className }: ProgramCountCardProps) => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const { data: programCounts, isLoading, error } = useProgram().usePrograms(page, search)

    if (isLoading) {
        return (
            <div className="bg-[#00306E] p-4 rounded-2xl shadow-md text-white border border-gray-100 h-[100px] flex items-center justify-center">
                <p className="text-gray-300">Loading...</p>
            </div>
        )
    }
    
    if (error || !programCounts) return <p>Failed to load program data</p>;

    return (
        <div className="bg-[#00306E] p-4 rounded-2xl border border-transparent hover:border-gray-100 transition shadow-md flex flex-col items-start justify-center">
            <div className="flex items-center gap-2 mb-1">
                <RiOrganizationChart className="w-5 h-5 text-blue-400"/>
                <h3 className="text-sm font-semibold text-gray-300">Total Existing Programs</h3>
            </div>
            <span className="text-4xl font-bold text-white">{programCounts.total}</span>
        </div>
    )
}

export default ProgramCountCard