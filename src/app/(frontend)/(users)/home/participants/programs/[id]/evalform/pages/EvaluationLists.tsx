"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
/* hooks */
import { useEvaluation } from "@/hooks/evaluations/useEvaluation";
/* components */
import EvaluationDetailModal from "@/components/modals/EvaluationDetailModal";
import SummaryChart from "@/components/charts/evalListsPerDate/SummaryChart";
import QuestionCharts from "@/components/charts/evalListsPerDate/QuestionCharts";
/* types */
import { EvaluationEntry, RatingCount } from "@/types/evaluationManagetypes";
/* icons */
import { FaArrowLeft } from "react-icons/fa6";

const EvaluationLists = ({ programId, date }: { programId: string, date: string }) => {
  const { data: session } = useSession()
  const { data: evaluations, isLoading: evalLoading } = useEvaluation().useEvaluationsByDate(programId, date);
  const { data: edaData, isLoading: edaLoading } = useEvaluation().useEvaluationEDAByDate(programId, date);
  const [selectedEval, setSelectedEval] = useState<EvaluationEntry | null>(null);
  const [showQuestions, setShowQuestions] = useState(false)
  const router = useRouter()

  if (evalLoading || edaLoading) return <p className="text-white">Loading...</p>;

  const handleBack = () => {
    router.push(`/home/participants/programs/${programId}?tab=evaluation`)
  }

  const handleToggle = () => {
    setShowQuestions((prev) => !prev)
  }


  // Format for summary chart
  const summaryData = edaData ? [
    { label: "Strongly Disagree (1)", value: edaData.summary[1] },
    { label: "Disagree (2)", value: edaData.summary[2] },
    { label: "Moderately Agree (3)", value: edaData.summary[3] },
    { label: "Agree (4)", value: edaData.summary[4] },
    { label: "Strongly Agree (5)", value: edaData.summary[5] },
  ] : [];

  // Group questions by category
  const parseQuestion = (question: string) => {
    const [category, q] = question.split("_");
    return { category, q };
  };

  const groupedQuestions = edaData?.questionDistributions.reduce<Record<string, typeof edaData.questionDistributions>>((acc, q) => {
    const { category } = parseQuestion(q.question);
    if (!acc[category]) acc[category] = [];
    acc[category].push(q);
    return acc;
  }, {} as Record<string, typeof edaData.questionDistributions>);

  // logic for show detail per question
  const shouldShowCharts =
    session?.user.role === "INSTRUCTOR" ||
    (session?.user.role === "ADMIN" && showQuestions);

  return (
    <>
      <div>
        <button onClick={handleBack} className="px-3 py-2 bg-[#00306E] text-white rounded-lg hover:bg-gray-800 mb-2 transition-all duration-200 active:scale-95" title="back"><FaArrowLeft size={20} /></button>

        <h1 className="text-white text-2xl font-bold italic mb-6">
          Submitted on {date}
        </h1>

        {/* Overall Summary Chart */}
        {edaData && (
          <SummaryChart totalRespondents={edaData.totalRespondents} data={summaryData} />
        )}

        {/* hover */}
        <div className="relative group font-bold text-2xl text-white text-center italic flex items-center justify-center gap-2">
          <div className="p-0.5 rounded-md w-full bg-white" />
          <span className="text-center whitespace-nowrap">Per Questions</span>
          <div className="p-0.5 rounded-md w-full bg-white" />

          {/* Simple tooltip shown only on hover */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs px-3 py-1 rounded whitespace-nowrap">
            Breakdown of student responses per question
          </div>
        </div>

        {/* for admin */}
        {session?.user.role === 'ADMIN' && (
          <button onClick={handleToggle} className="px-3 py-2 bg-[#00306E] text-white rounded-lg hover:bg-gray-800 mb-3 transition-all duration-200 active:scale-95 font-bold">{showQuestions ? 'close' : 'Show Per Questions'}</button>
        )}

        {/* Detail Per Question */}
        {shouldShowCharts && groupedQuestions && (
          <QuestionCharts groupedQuestions={groupedQuestions} />
        )}

        {/* admin can see who submit form & can view form */}
        {session?.user.role === 'ADMIN' && (
          <div>
            {/* hover */}
            <div className="relative group font-bold text-2xl text-white text-center italic flex items-center justify-center gap-2">
              <div className="p-0.5 rounded-md w-full bg-white" ></div>
              <span className="text-center whitespace-nowrap">Individual Submissions</span>
              <div className="p-0.5 rounded-md w-full bg-white" ></div>

              {/* Simple tooltip shown only on hover */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                List of participants who submitted the evaluation form for this date.
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#303030] text-white">
                    <th className="p-3">Name</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {evaluations?.map((evalData) => (
                    <tr
                      key={evalData.id}
                      className="border-b border-gray-600 hover:bg-[#4d4d4d] transition cursor-pointer"
                    >
                      {/* NAME */}
                      <td
                        className="p-3"
                        onClick={() => setSelectedEval(evalData)}
                      >
                        <p className="font-semibold text-white">{evalData.name}</p>
                        {/* <p className="text-xs opacity-70 text-gray-300">
                        {evalData.user.email}
                      </p> */}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedEval(evalData)}
                          className="px-2 py-1 bg-[#00306E] text-white rounded-lg hover:bg-gray-800 transition-all duration-200 active:scale-95"
                        >
                          View Form
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedEval && (
        <EvaluationDetailModal
          evaluation={selectedEval}
          onClose={() => setSelectedEval(null)}
        />
      )}
    </>
  );
};

export default EvaluationLists;