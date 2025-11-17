import { QueryClient, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createEvaluation, getEvaluationDates, getEvaluationsByDate, getEvaluationEDAByDate } from "@/services/evaluationServices";
import { CreateEvaluationInput, EvaluationEntry, EDAResponse } from "@/types/evaluationManagetypes";


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

    // for evaluation pages to get per date
    const useEvaluationDates = (programId: string) => {
        return useQuery({
            queryKey: ["evaluation-dates", programId],
            queryFn: () => getEvaluationDates(programId)
        });
    };

    // for evaluation to view submissions by date
    const useEvaluationsByDate = (programId: string, date: string) => {
        return useQuery<EvaluationEntry[]>({
            queryKey: ["evaluations-by-date", programId, date],
            queryFn: () => getEvaluationsByDate(programId, date),
        });
    }

    const useEvaluationEDAByDate = (programId: string, date: string) => {
        return useQuery<EDAResponse>({
            queryKey: ["evaluation-eda-by-date", programId, date],
            queryFn: () => getEvaluationEDAByDate(programId, date),
        });
    }

    return { useCreateEval, useEvaluationDates, useEvaluationsByDate, useEvaluationEDAByDate }
}