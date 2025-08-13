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

        socket.on('post-created', (newPost) => {
            if(newPost.programId !== programId) return
            
            queryClient.setQueryData<Post[]>(['posts', programId], (oldData) => {
                if(!oldData) return [newPost]
                return [newPost, ...oldData]
            })
        })

        socket.on('comment-created', (newComment) => {
            queryClient.setQueryData(['posts', programId], (oldData: Post[]) => {
                if(!oldData) return oldData

                return oldData.map(post => {
                    if(post.id === newComment.postId) {
                        return {
                            ...post,
                            comments: [...post.comments, newComment]
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