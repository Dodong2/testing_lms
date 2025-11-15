import { apiFetch } from "./apiClient";
import { CreateEvaluationInput } from "@/types/evaluationManagetypes";


export async function createEvaluation(data: CreateEvaluationInput) {
  return apiFetch("/api/evaluation", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
