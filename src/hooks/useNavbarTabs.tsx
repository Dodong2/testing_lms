'use client'

import { useState } from "react"
// pages inside ng participants program
import UpdatesContent from "@/app/(frontend)/(users)/home/participants/programs/pages/UpdatesContent"
import InstructorsContent from "@/app/(frontend)/(users)/home/participants/programs/pages/InstructorsContent"
import FilesContent from "@/app/(frontend)/(users)/home/participants/programs/pages/FilesContent"

export const useNavbarTabs = () => {
    const [activeTab, setActiveTab] = useState("updates")

    const renderContent = () => {
        switch (activeTab) {
            case 'updates':
                return <UpdatesContent/>
            case 'files':
                return <FilesContent/>
            case 'instructors':
                return <InstructorsContent/>

        }
    }

    return { activeTab, setActiveTab, renderContent }
}

