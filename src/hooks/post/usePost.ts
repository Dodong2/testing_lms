import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getPosts, createPost, updatePosts, deletePost, createComment, deleteComment } from "@/services/postServices";



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
                queryClient.invalidateQueries({ queryKey: ["post", programId] })
                toast.success("Post created successfully!")
            },
            onError: () => {
                toast.error("Failed to create post")
            }
        })
    }

    // for update post
    const useUpdatePost = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ postId, content }: { postId: string, content: string } ) => 
                updatePosts(programId, postId, content),
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["post", programId] })
                    toast.success("Post updated successfully!")
                },
                onError: () => {
                    toast.error("Failed to update post")
                }
        })
    }

    // for delete
    const useDeletePost = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ postId }: { postId: string }) =>
                deletePost(programId, postId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["post", programId] })
                toast.success("Post deleted successfully!")
            }, 
            onError: () => {
                toast.error("Failed to delete post");
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

    // for delete comments
    const useDeleteComments = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ postId, commentId }: { postId: string, commentId: string }) =>
                deleteComment(programId, postId, commentId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["posts", programId] })
                toast.success("Comment deleted successfully!")
            },
            onError: () => {
                toast.error("Failed to delete comment")
            }
        })
    }

    return { usePosts, useCreatePost, useUpdatePost, useDeletePost ,useCreateComment, useDeleteComments  }

}