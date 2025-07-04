import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// services
import { getPrograms, createProgram, addProgramMembers } from "@/services/programServices"

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
            queryFn: getPrograms
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
            }
        })
    }
    
    return { usePrograms, useCreateProgram, useAddProgramMembers  }
}
