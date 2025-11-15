import { apiFetch } from "./apiClient";
import { CreateEvaluationInput, EDAResponse } from "@/types/evaluationManagetypes";


export async function createEvaluation(data: CreateEvaluationInput) {
  return apiFetch("/api/evaluation", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getDailyEDA(programId: string): Promise<EDAResponse> {
  return apiFetch(`/api/program/${programId}/eda?range=daily`);
}

export async function getWeeklyEDA(programId: string): Promise<EDAResponse> {
  return apiFetch(`/api/program/${programId}/eda?range=weekly`);
}

export async function getMonthlyEDA(programId: string): Promise<EDAResponse> {
  return apiFetch(`/api/program/${programId}/eda?range=monthly`);
}