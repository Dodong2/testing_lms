
import Link from "next/link";
/* hooks */
import { useEvaluation } from "@/hooks/evaluations/useEvaluation";
/* icons */
import { FaBook } from "react-icons/fa";


export default function Evaluation({ programId }: { programId: string }) {
  const { data: dates, isLoading } = useEvaluation().useEvaluationDates(programId)

  if (isLoading) return <p className="text-white">Loading...</p>

  return (
    <div>
      <h1 className="font-bold italic text-2xl text-white">Evaluations</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3">
        {dates?.map((item) => (
          <Link href={`/home/participants/programs/${programId}/evalform/${item.date}`} key={item.date}>
            <div className="bg-[#525252] p-2 flex items-center justify-center gap-2 text-white rounded-md border border-transparent hover:border-gray-100 transition">
              <FaBook />
              <p>{item.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
