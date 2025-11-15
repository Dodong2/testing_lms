import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvaluation } from "@/services/evaluationServices";
import { CreateEvaluationInput } from "@/types/evaluationManagetypes";


export const useEvaluation = () => {
    const useCreateEval = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (data: CreateEvaluationInput) => createEvaluation(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["evaluations"] })
            }
        })
    }

    return{ useCreateEval }
}