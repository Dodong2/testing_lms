import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
// services
import { getPrograms, createProgram, addProgramMembers, getAllProgramMemberCounts, deletePrograms, updateProgram } from "@/services/programServices"

type Program = {
  id: string
  title: string
  subtitle: string
  explanation: string
}

export const useProgram = () => {

    // pang get ng program
    const usePrograms = () => {
        return useQuery<{ programs: Program[] }>({
            queryKey: ["programs"],
            queryFn: getPrograms,
        })
    }

    // para pang create ng Program
    const useCreateProgram = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: createProgram,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["programs"] })
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
                toast.success("Member successfuly added to program")
            },
            onError: () => {
                toast.error("Failed to add member")
            }
        })
    }

    //pang counts kung ilang beneficiary at instructors
    const useAllProgramCounts = () => {
        return useQuery({
            queryKey: ['all-program-member-counts'],
            queryFn: getAllProgramMemberCounts
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
            }
        })
    }

    return { usePrograms, useCreateProgram, useAddProgramMembers, useAllProgramCounts, useDeletePrograms, useUpdatePrograms }
}
