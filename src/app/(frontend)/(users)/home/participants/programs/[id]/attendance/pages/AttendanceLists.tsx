// home/participants/programs/[id]/attendance/pages/AttendanceLists.tsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
/* hooks */
import { useAttendance } from "@/hooks/attendance/useAttendance";
/* components */
// import AttendanceDetailModal from "@/components/modals/AttendanceDetailModal";
import { SkeletonGrid } from "@/components/SkeletonGrid";
/* types */
import { AttendanceEntry } from "@/types/attendanceManagetypes";
/* icons */
import { FaArrowLeft } from "react-icons/fa6";

const AttendanceLists = ({
  programId,
  date,
}: {
  programId: string;
  date: string;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: attendances, isLoading: attendancesLoading } = useAttendance().useAttendancesByDate(programId, date);

  if (attendancesLoading)
    return <SkeletonGrid variant="eda" count={1} />;

  const handleBack = () => {
    router.push(`/home/participants/programs/${programId}?tab=attendance`);
  };

  return (
    <>
      <div>
        <button
          onClick={handleBack}
          className="px-3 py-2 bg-[#00306E] text-white rounded-lg hover:bg-gray-800 mb-2 transition-all duration-200 active:scale-95"
          title="back"
        >
          <FaArrowLeft size={20} />
        </button>

        <h1 className="text-white text-2xl font-bold italic mb-6">
          Attendance for {date}
        </h1>

      
        {/* Attendees List - Only visible to ADMIN */}
        {(session?.user.role === "ADMIN" || session?.user.role === 'INSTRUCTOR')  && (
          <div>
            <div className="relative group font-bold text-2xl text-white text-center italic flex items-center justify-center gap-2 mb-4">
              <div className="p-0.5 rounded-md w-full bg-white"></div>
              <span className="text-center whitespace-nowrap">
                Individual Submissions
              </span>
              <div className="p-0.5 rounded-md w-full bg-white"></div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                List of participants who submitted attendance for this date.
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#303030] text-white">
                    <th className="p-3">Name</th>
                    <th className="p-3">Sex</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {attendances?.map((attendance) => (
                    <tr
                      key={attendance.id}
                      className="border-b border-gray-600 hover:bg-[#4d4d4d] transition cursor-pointer"
                    >
                      <td
                        className="p-3"
                      >
                        <p className="font-semibold text-white">
                          {attendance.name}
                        </p>
                      </td>

                      <td className="p-3 text-white">{attendance.sex}</td>

                      <td className="p-3 text-center">
                        <button
                          className="px-2 py-1 bg-[#00306E] text-white rounded-lg hover:bg-gray-800 transition-all duration-200 active:scale-95"
                        >
                          View Details
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

      {/* {selectedAttendance && (
        <AttendanceDetailModal
          attendance={selectedAttendance}
          onClose={() => setSelectedAttendance(null)}
        />
      )} */}
    </>
  );
};

export default AttendanceLists;