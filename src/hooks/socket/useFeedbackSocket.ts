import { useEffect } from "react";
import socket from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type Feedback = {
    id: string
    subject: string
    description: string
    type: string
    visibility: string
    createdAt: string
    user: {
        id: string
        name: string
        role: string    
    }
    program: {
        id: string
    title: string
    }
}

export const useFeedbackEvents = () => {
    const queryClient = useQueryClient()
    const { data: session } = useSession()

    useEffect(() => {
        // console.log("🧲 useFeedbackSocket mounted")
        
        // socket.on("connected", () => {
        //     console.log("✅ Socket connected:", socket.id)
        // })

        socket.on('feedback-created', (newFeedback: Feedback) => {
            // console.log("🔥 New feedback received:", newFeedback)

            // Update feedback list for admins
            if(session?.user?.role === 'ADMIN') {
                queryClient.setQueryData<Feedback[]>(
                    ["feedbacks"],
                    (oldData) => {
                        if(!oldData) return [newFeedback]
                        const exists = oldData.some(f => f.id === newFeedback.id)
                        if(exists) {
                            console.log("📝 Feedback already exists, skipping duplicate")
                            return oldData
                        }
                        const newData = [newFeedback, ...oldData]
                        return newData
                    }
                )
                queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
            }
        })

        return () => {
            socket.off("feedback-created")
        }

    }, [queryClient, session?.user?.id, session?.user?.role])
    

}
