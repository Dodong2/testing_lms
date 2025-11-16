"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
/* components */
import OverallSummary from "@/components/charts/eda/OverallSummary";
/* hooks */
import { useEDA } from "@/hooks/evaluations/useEDA";
/* types */
import { RatingCount } from "@/types/evaluationManagetypes";
import DetailPerQuestion from "@/components/charts/eda/DetailPerQuestion";

export default function EDA({ programId }: { programId: string }) {
  const { useDailyEDA } = useEDA(programId);
  const { data, isLoading } = useDailyEDA();
  if (isLoading) return <p>Loading...</p>;



  return (
    <div className="space-y-6 rounded-md shadow mt-3">
      <h1 className="font-bold text-lg text-white">Evaluation Summary (Daily)</h1>
      <p className="text-white">Total Respondents Today: {data?.totalRespondents}</p>

      {/* overall */}
      <OverallSummary programId={programId} />

      {/* hover */}
      <div className="relative group font-bold text-2xl text-white text-center italic flex items-center justify-center gap-2">
        <div className="p-0.5 rounded-md w-full bg-white" />
        <span className="text-center whitespace-nowrap">Per Questions</span>
        <div className="p-0.5 rounded-md w-full bg-white" />

        {/* Simple tooltip shown only on hover */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs px-3 py-1 rounded whitespace-nowrap">
          This will only appear once something has been filled in.
        </div>
      </div>

      {/* Daily Details per questions */}
      <DetailPerQuestion programId={programId} />

    </div>
  );
}
