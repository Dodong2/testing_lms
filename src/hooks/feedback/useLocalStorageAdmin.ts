import { useState, useEffect } from "react"
import { hashId } from "@/lib/hash"

export const useLocalStorageAdmin = (feedbackId: string[] = []) => {
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

    const [readStatusMap, setReadStatusMap] = useState<Map<string, boolean>>(new Map())

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
            window.dispatchEvent(new CustomEvent('localStorageUpdate'))
        }, [readIds])

        // Update read status map when feedbackIds or readIds change
        useEffect(() => {
            if(feedbackId.length > 0) {
                const updateReadStatusMap = async() => {
                    const statusMap = new Map<string, boolean>()

                    await Promise.all(
                        feedbackId.map(async (id) => {
                            const hashed = await hashId(id)
                            statusMap.set(id, readIds.has(hashed))
                        })
                    )
                    setReadStatusMap(statusMap)
                }
                updateReadStatusMap()
            }
        }, [feedbackId, readIds])


        const handleToggle = async(id: string, isOpen: boolean) => {
        if(isOpen) {
            setOpenId(null)
        } else {
            setOpenId(id)
            const hashed = await hashId(id)
            setReadIds(prev => {
                const updated = new Set(prev)
                updated.add(hashed)
                return updated
            })
        }
    }

    const isIdRead = (id: string): boolean => {
        return readStatusMap.get(id) || false
    }

    return { openId, handleToggle, isIdRead }
}

