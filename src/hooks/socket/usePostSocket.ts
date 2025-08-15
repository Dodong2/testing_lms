import { useEffect } from "react";
import socket from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Post {
    id: string,
    content: string
    authorId: string
    programId: string
    createdAt: string
    author: {
        id: string
        name: string
        image: string
    }
    comments: {
        id: string
        content: string
        author: {
            id: string
            name: string
            image: string
        }
    }[]
}


export const usePostEvents = (programId: string) => {
    const queryClient = useQueryClient()
    const { data: session } = useSession()

    useEffect(() => {
        //get lahat ng post
        socket.on('post-created', (newPost) => {
            if(newPost.programId !== programId) return
            
            queryClient.setQueryData<Post[]>(['post', programId], (oldData) => {
                if(!oldData) return [newPost]
                const exists = oldData.some(p => String(p.id) === String(newPost.id))
                if(exists) return oldData
                return [newPost, ...oldData]
            })
        })

        //get lahat ng comments sa post
        socket.on('comment-created', (newComment) => {
            queryClient.setQueryData(['post', programId], (oldData: Post[]) => {
                if(!oldData) return oldData

                return oldData.map(post => {
                    if(post.id === newComment.postId) {

                        const comments = post.comments ?? []
                        const exists = comments.some(c => String(c.id) === String(newComment.id))
                        if(exists) return post

                        return {
                            ...post,
                            comments: [...comments, newComment]
                        }
                    }
                    return post
                })
            })
        })

        return () => {
            socket.off("post-created")
            socket.off("comment-created")
        }

    },[queryClient, programId, session?.user?.id])
}