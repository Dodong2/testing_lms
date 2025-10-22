'use client'
import { useState } from "react"
import { useProgram } from "@/hooks/program/useProgram"


const ProgramCountCard = () => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const { data: programCounts, isLoading, error } = useProgram().usePrograms(page, search)

    if (isLoading) return <p>Loading...</p>;
    if (error || !programCounts) return <p>Failed to load program data</p>;

    return (
        <div className="bg-[#00306E] p-4 rounded-2xl shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Existing Programs</h2>
            <span className="text-4xl font-bold text-blue-600">{programCounts.total}</span>
            <p className="text-gray-500">Total Programs</p>
        </div>
    )
}

export default ProgramCountCard