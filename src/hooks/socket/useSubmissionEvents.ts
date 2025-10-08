import { useEffect } from "react"
import socket from "@/lib/socket"
import { useQueryClient } from "@tanstack/react-query"

interface Submission {
    id: string
    postId: string;
    student: { id: string; name: string; image?: string };
    files?: { name: string; url: string; type: string }[];
    links?: string;
    grade?: number | null;
    feedback?: string | null;
    createdAt: string;
}

export const useSubmissionEvents = (programId: string, postId: string) => {
    const queryClient = useQueryClient()

    useEffect(() => {
        // When someone submits
        socket.on("submission-created", (newSubmission: Submission) => {
            if(newSubmission.postId !== postId) return
            queryClient.setQueryData<Submission[]>(["submissions", programId, postId], (old = []) => {
                const exists = old.some((s) => s.id === newSubmission.id)
                return exists ? old : [newSubmission, ...old]
            })
        })

        // When instructor grades a submission
        socket.on("submission-graded", (updated: Submission) => {
            if(updated.postId !== postId) return
            queryClient.setQueryData<Submission[]>(["submissions", programId, postId], (old = []) =>
                old.map((s) => (s.id === updated.id ? updated : s))
            )
        })


        return () => {
            socket.off("submission-created")
            socket.off("submission-graded")
        }

    }, [programId, postId, queryClient])
}