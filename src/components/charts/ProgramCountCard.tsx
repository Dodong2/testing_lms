'use client'
import { useState } from "react"
import { useProgram } from "@/hooks/program/useProgram"

interface ProgramCountCardProps {
  className?: string
}


const ProgramCountCard = ({ className }: ProgramCountCardProps) => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const { data: programCounts, isLoading, error } = useProgram().usePrograms(page, search)

    if (isLoading) return <p>Loading...</p>;
    if (error || !programCounts) return <p>Failed to load program data</p>;

    return (
        <div className="bg-[#00306E] p-4 rounded-2xl border border-gray-100 shadow-md flex flex-col items-start justify-center">
            <h2 className="text-lg font-semibold text-white mb-1">Total Existing Programs</h2>
            <span className="text-4xl font-bold text-white">{programCounts.total}</span>
        </div>
    )
}

export default ProgramCountCard