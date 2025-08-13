'use client'

import { useState } from "react"
// pages inside ng participants program
import UpdatesContent from "@/app/(frontend)/(users)/home/participants/programs/pages/UpdatesContent"
import InstructorsContent from "@/app/(frontend)/(users)/home/participants/programs/pages/InstructorsContent"
import FilesContent from "@/app/(frontend)/(users)/home/participants/programs/pages/FilesContent"

interface Program {
    id: string
    title: string
    explanation: string
    subtitle: string
}

interface ProgramClientProps {
    program: Program
    username: string
}

export const useNavbarTabs = ({ program, username }: ProgramClientProps) => {
    const [activeTab, setActiveTab] = useState("updates")

    const renderContent = () => {
        switch (activeTab) {
            case 'updates':
                return <UpdatesContent programId={program.id} />
            case 'files':
                return <FilesContent/>
            case 'instructors':
                return <InstructorsContent/>
            default:
                return <UpdatesContent programId={program.id}/>

        }
    }

    return { activeTab, setActiveTab, renderContent }
}

