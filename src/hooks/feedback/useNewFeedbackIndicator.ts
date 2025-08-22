import { useState, useEffect } from "react"
import { useFeedback } from "@/hooks/feedback/useFeedback"
import { hashId } from "@/lib/hash"

export const useNewFeedbackIndicator = () => {
  const [hasNewFeedback, setHasNewFeedback] = useState<boolean>(false)
  const { data: feedbacksData, isLoading } = useFeedback().useGetFeedbacks()

  useEffect(() => {
    const checkForNewFeedback = async () => {
      if (!feedbacksData || feedbacksData.length === 0) {
        setHasNewFeedback(false)
        return
      }

      // Get stored read feedback IDs from localStorage
      let readIds: Set<string> = new Set()
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("readFeedbackIds")
        if (stored) {
          try {
            const parsed: string[] = JSON.parse(stored)
            readIds = new Set(parsed)
          } catch {
            console.error("Invalid localStorage data for readFeedbacks")
          }
        }
      }

      // Check if there are any unread feedbacks
      let hasUnread = false
      for (const feedback of feedbacksData) {
        const hashedId = await hashId(feedback.id)
        if (!readIds.has(hashedId)) {
          hasUnread = true
          break
        }
      }

      setHasNewFeedback(hasUnread)
    }

    if (!isLoading) {
      checkForNewFeedback()
    }
  }, [feedbacksData, isLoading])

  // Listen to localStorage changes to update indicator when feedback is read
  useEffect(() => {
    const handleStorageChange = () => {
      // Re-check for new feedback when localStorage changes
      if (!isLoading && feedbacksData) {
        const checkForNewFeedback = async () => {
          let readIds: Set<string> = new Set()
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("readFeedbackIds")
            if (stored) {
              try {
                const parsed: string[] = JSON.parse(stored)
                readIds = new Set(parsed)
              } catch {
                console.error("Invalid localStorage data for readFeedbacks")
              }
            }
          }

          let hasUnread = false
          for (const feedback of feedbacksData) {
            const hashedId = await hashId(feedback.id)
            if (!readIds.has(hashedId)) {
              hasUnread = true
              break
            }
          }

          setHasNewFeedback(hasUnread)
        }

        checkForNewFeedback()
      }
    }

    // Listen for storage events (when localStorage is updated)
    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for a custom event we'll dispatch when localStorage is updated in the same tab
    window.addEventListener('localStorageUpdate', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageUpdate', handleStorageChange)
    }
  }, [feedbacksData, isLoading])

  return {
    hasNewFeedback,
    isLoading
  }
}