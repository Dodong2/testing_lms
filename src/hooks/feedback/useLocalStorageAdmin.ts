import { useState, useEffect } from "react"

export const useLocalStorageAdmin = () => {
    const [openId, setOpenId] = useState<string | null>(null)
    const [readIds, setReadIds] = useState<Set<string>>(() => {
        if(typeof window !== "undefined") {
            const stored = localStorage.getItem("readFeedbackIds")
            if(stored) {
                return new Set(JSON.parse(stored))
            }
        }
        return new Set();
    })

    // Load localStorage para update
        useEffect(() => {
            const stored = localStorage.getItem("readFeedbackIds")
            if(stored) {
                try {
                    const parsed: string[] = JSON.parse(stored)
                    setReadIds(new Set(parsed))
                } catch {
                    console.error("Invalid localStorage data for readFeedbacks")
                }
            }
        }, [])

    // save localStorage if na open nayung feedbackId
        useEffect(() => {
            // console.log("Saving to localStorage:", Array.from(readIds));
            localStorage.setItem("readFeedbackIds", JSON.stringify(Array.from(readIds)))
        }, [readIds])

     // open & read   
        const handleToggle = (id: string, isOpen: boolean) => {
        if(isOpen) {
            setOpenId(null)
        } else {
            setOpenId(id)
            setReadIds(prev => {
                const updated = new Set(prev)
                updated.add(id)
                return updated
            })
        }
    }

    return { openId, readIds, handleToggle }
}