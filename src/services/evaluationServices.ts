import { apiFetch } from "./apiClient";
import { CreateEvaluationInput, EDAResponse, EvaluationEntry } from "@/types/evaluationManagetypes";


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

// for evaluation pages
export async function getEvaluationDates(programId: string): Promise<{ date: string }[]> {
  return apiFetch(`/api/program/${programId}/evaluation/dates`);
}
// for evaluation view submissions
export async function getEvaluationsByDate(programId: string, date: string): Promise<EvaluationEntry[]>  {
  return apiFetch(`/api/program/${programId}/evaluation/${date}`);
}
// for evaluation eda by date graph long live not reset 
export async function getEvaluationEDAByDate(programId: string, date: string): Promise<EDAResponse> {
  return apiFetch(`/api/program/${programId}/evaluation/${date}/eda`);
}
