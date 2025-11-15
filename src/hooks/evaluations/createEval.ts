import toast from "react-hot-toast"
import { useEvaluation } from "./useEvaluation"
import { CreateEvaluationInput } from "@/types/evaluationManagetypes";

type UseCreateEvalProps = {
  programs: { id: string; title: string }[];
  programId: string;
  date: string;
  venue: string;
  suggestions: string;
  name: string;
  ratings: CreateEvaluationInput["ratings"];
};

export const createEval = ({programs, programId, date, venue, suggestions, name, ratings,}: UseCreateEvalProps) => {
  const { mutateAsync, isPending } = useEvaluation().useCreateEval()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!programId) {
      toast.error("Select program first");
      return;
    }

    const payload: CreateEvaluationInput = {
      programId,
      titleOfSeminar: programs.find((p) => p.id === programId)?.title ?? "",
      date,
      venue,
      suggestions,
      name,
      ratings,
    };

    await toast.promise(
      mutateAsync(payload),
      {
        loading: "Submitting evaluation...",
        success: "Evaluation submitted successfully!",
        error: "Failed to submit evaluation.",
      }
    );
  };

  return { handleSubmit, isPending }
}
