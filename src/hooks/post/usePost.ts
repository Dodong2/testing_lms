import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getPosts, createPost, createComment } from "@/services/postServices";



export const usePost = (programId: string) => {
    // get posts for program
    const usePosts = () => {
        return useQuery({
            queryKey: ["post", programId],
            queryFn: () => getPosts(programId),
            enabled: !!programId
        })
    }

    // for create post on program
    const useCreatePost = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ content }: { content: string }) =>
                createPost(programId, content),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["posts", programId] })
                toast.success("Post created successfully!")
            },
            onError: () => {
                toast.error("Failed to create post")
            }
        })
    }

    // for create comment
    const useCreateComment = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ programId , postId, content }: { programId: string, postId: string, content: string }) => 
                createComment( programId , postId, content),
            onSuccess: (__data, variables) => {
                queryClient.invalidateQueries({ queryKey: ["posts", variables.programId] })
                toast.success("Comment added successfully!")
            },
            onError: () => {
                toast.error("Failed to add comment")
            }
        })
    }

    return { usePosts, useCreatePost, useCreateComment }

}