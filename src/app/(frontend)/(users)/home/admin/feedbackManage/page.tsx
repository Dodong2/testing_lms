'use client'
import { useState } from "react"
import { useFeedback } from "@/hooks/feedback/useFeedback"
/* icon */
import { FiPlus } from 'react-icons/fi';
import { IoClose } from "react-icons/io5";

export default function FeedbackManagePage() {
    const { data: feedbacksData, isLoading } = useFeedback().useGetFeedbacks()
    const [openId, setOpenId] = useState<string | null>(null)

 

    return (
        <div className="p-4 space-x-4">
            <h1 className="text-xl font-bold">Feedbacks</h1>
            {isLoading && <p>Loading...</p>}

            {!isLoading && feedbacksData?.map((f) => {
                const isAnon = f.visibility === 'Anonymous'
                const isOpen = openId === f.id

                return (
                    <div key={f.id} className="border w-full rounded-lg shadow-sm p-4 bg-white">
                        {/* Summary row */}
                        <div  className="flex gap-2 justify-between items-center">
                            <div>
                                {isAnon
                                    ? `${f.program.title} (${f.user.role})`
                                    : `${f.user.name} - ${f.program.title} (${f.user.role})`
                                }
                                <span className="ml-2 text-sm text-gray-500">Date: {new Date(f.createdAt).toLocaleDateString()}</span>
                            </div>

                            <button onClick={() => setOpenId(isOpen ? null : f.id)}  className="p-1 rounded-full hover:bg-gray-100 transition">
                                {isOpen ? <IoClose size={18}/> : <FiPlus size={18}/> }
                             </button>
                        </div>

                        {/* Expanded details */}

                        {isOpen && (
                        <ul className="mt-3 space-y-1 text-sm text-gray-700">
                            <li>Visibility: {f.visibility}</li>
                            <li>Type: {f.type}</li>
                            <li>Subject: {f.subject}</li>
                            <li>Description: {f.description}</li>
                        </ul>
                        )}
                    </div>
                )
            })}

        </div>
    )
}