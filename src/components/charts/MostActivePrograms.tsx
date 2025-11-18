'use client'
import React, { useState, useEffect } from 'react'
import { useStats } from '@/hooks/stats/useStats'
import { ActiveProgram } from '@/types/statstypes'

const MostActivePrograms = () => {
    const [page, setPage] = useState(1)
    const [allPrograms, setAllPrograms] = useState<ActiveProgram[]>([])
    const limit = 5

    const { data, isLoading, error } = useStats().useActivePrograms(page, limit)

    // Append new programs when data changes
    useEffect(() => {
        if (data?.programs) {
            setAllPrograms(prev => {
                // Avoid duplicates
                const existingIds = new Set(prev.map(p => p.id))
                const newPrograms = data.programs.filter(p => !existingIds.has(p.id))
                return [...prev, ...newPrograms]
            })
        }
    }, [data])

    const handleShowMore = () => {
        setPage(prev => prev + 1)
    }

    if (isLoading && page === 1) {
        return (
            <div className="bg-[#00306E] p-4 rounded-2xl shadow-md text-white">
                <h2 className="text-lg font-semibold mb-4">Active Programs</h2>
                <p className="text-gray-300">Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-[#00306E] p-4 rounded-2xl shadow-md text-white">
                <h2 className="text-lg font-semibold mb-4">Active Programs</h2>
                <p className="text-red-400">Failed to load programs</p>
            </div>
        )
    }

    return (
        <div className="bg-[#00306E] p-4 rounded-2xl shadow-md text-white overflow-hidden border border-transparent hover:border-gray-100 transition">
            <h2 className="text-lg font-semibold mb-4 text-white">Active Programs</h2>

            {/* Show total count */}
            {data && (
                <p className="text-sm text-gray-300 mb-3">
                    Showing {allPrograms.length} of {data.total} programs
                </p>
            )}

            {/* Responsive wrapper */}
            <div className="overflow-x-auto">
                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200 table-auto">
                    <thead className='bg-[#5c5c5c]'>
                        <tr>
                            <th
                                scope="col"
                                className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Program Name
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Posts
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Comments
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Total Activity
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {allPrograms.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                                    No programs found
                                </td>
                            </tr>
                        ) : (
                            allPrograms.map((p, index) => (
                                <tr key={p.id} className="hover:bg-[#5c5c5c] transition">
                                    <td className="px-4 py-3 text-sm font-medium text-white">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">#{index + 1}</span>
                                            <span className="max-w-[250px] truncate" title={p.name}>
                                                {p.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-white whitespace-nowrap text-sm">
                                        {p.posts}
                                    </td>
                                    <td className="px-4 py-3 text-white whitespace-nowrap text-sm">
                                        {p.comments}
                                    </td>
                                    <td className="px-4 py-3 text-white whitespace-nowrap text-sm font-semibold">
                                        {p.totalActivity}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Show More Button */}
            {data?.hasMore && (
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleShowMore}
                        disabled={isLoading}
                        className="text-white hover:text-gray-300 transition disabled:text-gray-500 text-sm font-medium"
                    >
                        {isLoading ? 'Loading...' : 'Show more...'}
                    </button>
                </div>
            )}

            {/* No more data message */}
            {!data?.hasMore && allPrograms.length > 0 && (
                <div className="flex justify-center mt-4">
                    <p className="text-gray-400 text-sm">No more programs to show</p>
                </div>
            )}
        </div>
    )
}

export default MostActivePrograms