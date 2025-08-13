import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getPosts, createPost, createComment } from "@/services/postServices";

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

export const usePost = (programId: string) => {
    // get posts for program
    const usePosts = () => {
        return useQuery<Post[]>({
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
            mutationFn: ({ postId, content }: { postId: string, content: string }) => 
                createComment(postId, content),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["posts", programId] })
                toast.success("Comment added successfully!")
            },
            onError: () => {
                toast.error("Failed to add comment")
            }
        })
    }

    return { usePosts, useCreatePost, useCreateComment }

}