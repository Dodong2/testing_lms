import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
// services
import { getPrograms, createProgram, addProgramMembers, deletePrograms, updateProgram, removeProgramMember, getProgramById } from "@/services/programServices"

export const useProgram = () => {

    // pang get ng program
    const usePrograms = (page: number, search: string, joinedOnly = false) => {
        return useQuery({
            queryKey: ["programs", page, search, joinedOnly],
            queryFn: () =>  getPrograms(page, search, joinedOnly),
            placeholderData: keepPreviousData
        })
    }

    // para pang create ng Program
    const useCreateProgram = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: createProgram,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["programs"] })
                toast.success("Program added successfully!")
            }
        })
    }

    // pang add ng members sa existing program
    const useAddProgramMembers = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ programId, emails }: { programId: string, emails: string[] }) =>
            addProgramMembers(programId, emails),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["programs"] })
                toast.success("Member successfully added to program")
            },
            onError: () => {
                toast.error("Failed to add member")
            }
        })
    }

    // pang-delete ng programs
    const useDeletePrograms = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: deletePrograms,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['programs'] })
                toast.success("Program successfully deleted")
            },
            onError: () => {
                toast.error("Failed to delete program")
            }
        })
    }
    
    // pang-update ng programs
    const useUpdatePrograms = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: updateProgram,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['programs'] })
                toast.success("Program updated successfully!")
            }
        })
    }

    const useRemoveProgramMember = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: ({ programId, email }: { programId:string, email: string }) => 
                removeProgramMember(programId, email),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['programs'] })
            },
            onError: () => {
                toast.error("Failed to remove member")
            }
        })
    }

    const useProgramById = (programId: string) => {
        return useQuery({
            queryKey: ['program', programId],
            queryFn: () => getProgramById(programId),
            enabled: !!programId
        })
    }

    return { usePrograms, useCreateProgram, useAddProgramMembers, useDeletePrograms, useUpdatePrograms, useRemoveProgramMember, useProgramById }
}
