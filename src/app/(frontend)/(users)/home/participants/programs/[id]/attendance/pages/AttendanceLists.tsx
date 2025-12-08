"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
/* hooks */
import { useAttendance } from "@/hooks/attendance/useAttendance";
import { useProgram } from "@/hooks/program/useProgram";
/* components */
import { SkeletonGrid } from "@/components/SkeletonGrid";
import AttendancePrint from "@/components/AttendancePrint";
/* types */
import { AttendanceEntry } from "@/types/attendanceManagetypes";
/* icons */
import { FaArrowLeft, FaPrint, FaEye } from "react-icons/fa6";

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
  const { data: program, isLoading: programLoading } = useProgram().useProgramById(programId);
  
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  

  if (attendancesLoading || programLoading)
    return <SkeletonGrid variant="eda" count={1} />;

  const handleBack = () => {
    router.push(`/home/participants/programs/${programId}?tab=attendance`);
  };

  

  const programName = program?.title || "Program Name";

  return (
    <>
      {!showPrintPreview ? (
        <div>
          <button
            onClick={handleBack}
            className="px-3 py-2 bg-[#00306E] text-white rounded-lg hover:bg-gray-800 mb-2 transition-all duration-200 active:scale-95"
            title="back"
          >
            <FaArrowLeft size={20} />
          </button>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-bold italic">
              Attendance for {date}
            </h1>
            <button
              onClick={() => setShowPrintPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 active:scale-95"
            >
              <FaEye size={18} />
              Print Preview
            </button>
          </div>

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
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#303030] text-white">
                      <th className="p-3">Name</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3">Sex</th>
                      <th className="p-3">Contact No.</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendances?.map((attendance) => (
                      <tr
                        key={attendance.id}
                        className="border-b border-gray-600 hover:bg-[#4d4d4d] transition cursor-pointer"
                      >
                        <td className="p-1">
                          <p className="font-semibold text-white">
                            {attendance.name}
                          </p>
                        </td>

                        <td className="p-1 text-white">{attendance.address}</td>

                        <td className="p-1 text-left text-white">{attendance.sex}</td>
                        <td className="p-1 text-left text-white">{attendance.contactNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <AttendancePrint attendances={attendances || []} date={date} programName={programName} onClose={() => setShowPrintPreview(false)} />
      )}

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          input {
            border: none !important;
            border-bottom: 1px solid black !important;
          }
        }
      `}</style>
    </>
  );
};

export default AttendanceLists;