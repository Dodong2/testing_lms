'use client'
import { useFeedback } from "@/hooks/feedback/useFeedback"
/* hooks */
import { useLocalStorageAdmin } from "@/hooks/feedback/useLocalStorageAdmin";
import { useFeedbackEvents } from "@/hooks/socket/useFeedbackSocket";
/* icon */
import { FiPlus } from 'react-icons/fi';
import { IoClose } from "react-icons/io5";

export default function FeedbackManagePage() {
    useFeedbackEvents()
    const { data: feedbacksData, isLoading } = useFeedback().useGetFeedbacks()
    const { openId, readIds, handleToggle } = useLocalStorageAdmin()
    
    
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Feedbacks</h1>
            {isLoading ? (<p>Loading...</p>) : (

             feedbacksData?.map((f) => {
               
                const isAnon = f.visibility === 'Anonymous'
                const isOpen = openId === f.id
                const isRead = readIds.has(f.id)
                
                //para sa callbacks
                const userName = f.user?.name || 'Unknown User'
                const userRole = f.user?.role || 'Unknown Role'
                const programTitle = f.program?.title || 'Unknown Program'
                
                return (
                    <div key={f.id} className={`border w-full rounded-lg shadow-sm p-4 ${isRead ? "bg-white" : "bg-amber-600"}`}>
                        {/* Summary row */}
                        <div onClick={() => handleToggle(f.id, isOpen)}  className="flex gap-2 justify-between items-center">
                            <div>
                                {isAnon
                                    ? `${programTitle} (${userRole})`
                                    : `${userName} - ${programTitle} (${userRole})`
                                }
                                <span className="ml-2 text-sm text-gray-500">Date: { f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Unknown Date'}</span>
                            </div>

                            <button  className="p-1 rounded-full hover:bg-gray-100 transition">
                                {isOpen ? <IoClose size={18}/> : <FiPlus size={18}/> }
                             </button>
                        </div>

                        {/* Expanded details */}
                        {isOpen && (
                        <div className="mt-3 space-y-1 text-sm text-gray-700">
                            <div>Visibility: {f.visibility || 'Unknown'}</div>
                            <div>Type: {f.type || 'Unknown'}</div>
                            <div>Subject: {f.subject || 'Unknown'}</div>
                            <div>Description: {f.description || 'Unknown'}</div>
                        </div>
                        )}
                    </div>
                )
            })
            )}

        </div>
    )
}