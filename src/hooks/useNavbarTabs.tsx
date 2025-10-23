'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
// pages inside ng participants program
import UpdatesContent from "@/app/(frontend)/(users)/home/participants/programs/pages/UpdatesContent"
import MemberContent from "@/app/(frontend)/(users)/home/participants/programs/pages/MemberContent"
import AssignmentContent from "@/app/(frontend)/(users)/home/participants/programs/pages/AssignmentContent"
import MeetingContent from "@/app/(frontend)/(users)/home/participants/programs/pages/MeetingContent"
import EDA from "@/app/(frontend)/(users)/home/participants/programs/pages/EDA"
import Evaluation from "@/app/(frontend)/(users)/home/participants/programs/pages/Evaluation"
import Attendance from "@/app/(frontend)/(users)/home/participants/programs/pages/Attendance"

interface Program {
    id: string
    title: string
    explanation: string
    subtitle: string
}

interface ProgramClientProps {
    program: Program
    username: string
    role: "INSTRUCTOR" | "BENEFICIARY" | "ADMIN"
}

export const useNavbarTabs = ({ program, username, role }: ProgramClientProps) => {
    const { data: session, status } = useSession()
    const [activeTab, setActiveTab] = useState("updates")

    const renderContent = () => {
        switch (activeTab) {
            case 'updates':
                return role === 'ADMIN' || role === 'BENEFICIARY' || role === 'INSTRUCTOR' ? (<UpdatesContent programId={program.id} />)
                : ( <p className="text-center text-gray-500 mt-4">Only admin and beneficiary can view this tab.</p> )
            case 'assignments':
                return role === 'BENEFICIARY' || role === 'INSTRUCTOR' ? (<AssignmentContent programId={program.id} />)
                : ( <p className="text-center text-gray-500 mt-4">Only instructors and beneficiary can view this tab.</p> )
            case 'members':
                return role === 'BENEFICIARY' || role === 'INSTRUCTOR' ? (<MemberContent programId={program.id} />)
                : ( <p className="text-center text-gray-500 mt-4">Only instructors and beneficiary can view this tab.</p> )
            case 'meetings':
                return role === 'BENEFICIARY' || role === 'INSTRUCTOR' ? (<MeetingContent programId={program.id} />)
                : ( <p className="text-center text-gray-500 mt-4">Only instructors and beneficiary can view this tab.</p> )
            case 'eda':
                return role === "INSTRUCTOR" || role === 'ADMIN' ? (<EDA programId={program.id} />)
                : ( <p className="text-center text-gray-500 mt-4">Only instructors can view this tab.</p>)
            case 'evaluation':
                return role === "INSTRUCTOR" || role === 'ADMIN' ? ( <Evaluation programId={program.id} />)
                : ( <p className="text-center text-gray-500 mt-4">Only instructors can view this tab.</p> )
            case 'attendance':
                return role === "INSTRUCTOR" || role === 'ADMIN' ? (<Attendance programId={program.id} />)
                : ( <p className="text-center text-gray-500 mt-4">Only instructors can view this tab.</p> )
            default:
                return <UpdatesContent programId={program.id} />

        }
    }

    return { activeTab, setActiveTab, renderContent }
}

