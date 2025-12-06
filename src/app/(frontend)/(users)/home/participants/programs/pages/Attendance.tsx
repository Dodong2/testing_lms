import Link from "next/link"
/* hooks */
import { useAttendance } from "@/hooks/attendance/useAttendance"
/* components */
import { SkeletonGrid } from "@/components/SkeletonGrid"
/* icons */
import { FaCalendarCheck } from "react-icons/fa";

const Attendance = ({ programId }: { programId: string }) => {
  const { data: dates, isLoading } = useAttendance().useAttendanceDates(programId)

  if (isLoading) return <SkeletonGrid variant="evalLists" count={15} />

  return (
    <div>
      <h1 className="font-bold italic text-2xl text-white">Attendance</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-3">
        {dates?.map((item) => (
          <Link
            href={`/home/participants/programs/${programId}/attendance/${item.date}`}
            key={item.date}
          >
            <div className="bg-[#525252] p-2 flex items-center justify-center gap-2 text-white rounded-md border border-transparent hover:border-gray-100 transition">
              <FaCalendarCheck />
              <p>{item.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Attendance