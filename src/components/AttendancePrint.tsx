import { useState, useRef } from "react"
import { useReactToPrint } from 'react-to-print';
import Image from "next/image"
/* types */
import { AttendanceEntry } from "@/types/attendanceManagetypes"
/* icons */
import { FaArrowLeft, FaPrint } from "react-icons/fa6"

interface AttendanceProps {
    attendances: AttendanceEntry[]
    programName: string
    date: string
    onClose: () => void
}

const AttendancePrint = ({ attendances, programName, date, onClose }: AttendanceProps) => {
    const [college, setCollege] = useState("");
    const [campus, setCampus] = useState("");
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Attendance-${date}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 20mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `
    });

    return (
        <div>
            {/* Print Preview Controls */}
            <div className="mb-4 flex items-center justify-between bg-[#303030] p-4 rounded-lg">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#00306E] text-white rounded-lg hover:bg-gray-800 transition-all duration-200 active:scale-95"
                >
                    <FaArrowLeft className="inline mr-2" />
                    Back to List
                </button>

                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 active:scale-95"
                >
                    <FaPrint size={18} />
                    Print Now
                </button>
            </div>

            {/* Printable Attendance Sheet */}
            <div ref={componentRef} className="bg-white text-black p-4">
                {/* Header */}
                <div className="relative flex items-start gap-6 mb-8">
                    {/* Logo */}
                        <Image 
                            src="/LSPUlogo.png" 
                            alt='logo' 
                            width={90} 
                            height={90}
                            className=" absolute left-1"
                        />

                    {/* Header Text */}
                    <div className="flex-1 text-center pt-2">
                        <p className="text-sm mb-1">Republic of the Philippines</p>
                        <h1 className="text-xl font-serif font-medium mb-1">Laguna State Polytechnic University</h1>
                        <p className="text-sm">Province of Laguna</p>
                    </div>
                </div>

                {/* Program Title Section */}
                <div className="text-center mb-6">
                    <p className="text-sm mb-2 font-semibold">EXTENSION PROGRAM/PROJECT TITLE:</p>
                    <div className="border-b-2 border-black pb-1 mb-6 mx-8">
                        <p className="font-semibold">{programName}</p>
                    </div>

                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">DATE:</span>
                            <div className="border-b-2 border-black px-8 min-w-[200px]">
                                <span>{date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mb-6 gap-8 px-4">
                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm whitespace-nowrap font-semibold">COLLEGE:</span>
                            <div className="border-b-2 border-black flex-1 px-2 min-h-[28px]">
                                <span>{college || '\u00A0'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm whitespace-nowrap font-semibold">CAMPUS:</span>
                            <div className="border-b-2 border-black flex-1 px-2 min-h-[28px]">
                                <span>{campus || '\u00A0'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editable Fields - Only show when not printing */}
                <div className="mb-6 space-y-3 print:hidden">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-700 w-24">College:</label>
                        <input
                            type="text"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            placeholder="Enter college"
                            className="border-2 border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-700 w-24">Campus:</label>
                        <input
                            type="text"
                            value={campus}
                            onChange={(e) => setCampus(e.target.value)}
                            placeholder="Enter campus"
                            className="border-2 border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Attendance Table */}
                <div>
                    <h2 className="text-center font-bold mb-3">ATTENDANCE SHEET</h2>
                    <table className="w-full border-2 border-black border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="border-r-2 border-black p-1 text-center font-bold">Name</th>
                                <th className="border-r-2 border-black p-1 text-center font-bold">Address</th>
                                <th className="border-r-2 border-black p-1 text-center font-bold w-20">Sex</th>
                                <th className="p-1 text-center font-bold w-32">Contact No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Filled rows from data */}
                            {attendances?.map((attendance) => (
                                <tr key={attendance.id} className="border-b border-black">
                                    <td className="border-r-2 border-black p-2 text-sm">{attendance.name}</td>
                                    <td className="border-r-2 border-black p-2 text-sm">{attendance.address || ''}</td>
                                    <td className="border-r-2 border-black p-2 text-center text-sm">{attendance.sex}</td>
                                    <td className="p-2 text-sm">{attendance.contactNumber || ''}</td>
                                </tr>
                            ))}

                            {/* Empty rows to fill the page */}
                            {Array.from({ length: Math.max(0, 15 - (attendances?.length || 0)) }).map((_, index) => (
                                <tr key={`empty-${index}`} className="border-b border-black">
                                    <td className="border-r-2 border-black p-2 h-10">&nbsp;</td>
                                    <td className="border-r-2 border-black p-2">&nbsp;</td>
                                    <td className="border-r-2 border-black p-2">&nbsp;</td>
                                    <td className="p-2">&nbsp;</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AttendancePrint