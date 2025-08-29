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
        {/* POST SECTION */}
        // create post real-time
        socket.on('post-created', (newPost) => {            
            queryClient.setQueryData<Post[]>(['post', programId], (oldData) => {
                if(!oldData) return [newPost]
                const exists = oldData.some(p => String(p.id) === String(newPost.id))
                if(exists) return oldData
                return [newPost, ...oldData]
            })
        })

        // update post real-time
        socket.on("post-updated", (updatedPost: Post) => {
            queryClient.setQueryData<Post[]>(["post", programId], (oldData) => {
                if(!oldData) return oldData
                return oldData.map((post) => 
                    String(post.id) === String(updatedPost.id) ? { ...post, updatedPost } : post
                )
            })
        })

        // delete post real-time
        socket.on("post-deleted", (deleted: { id: string, programId: string }) => {
            queryClient.setQueryData<Post[]>(["post", programId], (oldData) => {
                if(!oldData) return oldData
                return oldData.filter((post) => String(post.id) !== String(deleted.id))
            })
        })

        {/* COMMENT SECTION */}
        // create comment real-time 
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

        // delete comment real-time
        socket.on('comment-deleted', (deleted: {id: string, postId: string}) => {
            queryClient.setQueryData(['post', programId], (oldData: Post[] | undefined) => {
                if(!oldData) return oldData

                return oldData.map((post) => {
                    if(post.id === deleted.postId) {
                        return {
                            ...post,
                            comments: post.comments.filter((c) => String(c.id) !== String(deleted.id))
                        }
                    }
                    return post
                })
            })
        })

        return () => {
            socket.off("post-created")
            socket.off("comment-created")
            socket.off("comment-deleted")
        }

    },[queryClient, programId, session?.user?.id])
}