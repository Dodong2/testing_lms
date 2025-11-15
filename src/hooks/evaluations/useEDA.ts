// hooks/eda/useEDA.ts
import { useQuery } from "@tanstack/react-query";
import { EDAResponse } from "@/types/evaluationManagetypes";
import { getDailyEDA, getWeeklyEDA, getMonthlyEDA } from "@/services/evaluationServices";

export const useEDA = (programId: string) => {
  const useDailyEDA = () =>
    useQuery<EDAResponse>({
      queryKey: ["eda", programId, "daily"],
      queryFn: () => getDailyEDA(programId)
    });

  const useWeeklyEDA = () =>
    useQuery<EDAResponse>({
      queryKey: ["eda", programId, "weekly"],
      queryFn: () => getWeeklyEDA(programId)
    });

  const useMonthlyEDA = () =>
    useQuery<EDAResponse>({
      queryKey: ["eda", programId, "monthly"],
      queryFn: () => getMonthlyEDA(programId)
    });

  return {
    useDailyEDA,
    useWeeklyEDA,
    useMonthlyEDA,
  };
};
