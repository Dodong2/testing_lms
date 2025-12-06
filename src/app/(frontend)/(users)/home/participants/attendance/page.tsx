// home/participants/attendance/page.tsx

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
/* hooks */
import { useProgram } from "@/hooks/program/useProgram";
import { createAttendance } from "@/hooks/attendance/createAttendance";

export default function AttendancePage() {
    const { data: session } = useSession();
    const router = useRouter();

    if (!session) return null;

    const [programId, setProgramId] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [sex, setSex] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [date, setDate] = useState("");

    // Programs from your hook
    const [page] = useState(1);
    const [search] = useState("");
    const { data: programData, isLoading } = useProgram().usePrograms(
        page,
        search,
        true
    );

    const programs =
        programData?.programs?.filter((p) =>
            session.user.role === "BENEFICIARY" ? p.joined === true : true
        ) ?? [];

    const { handleSubmit, isPending } = createAttendance({
        programId,
        name,
        address,
        sex,
        contactNumber,
        date,
        onSuccess: () => {
            // Reset form
            setProgramId("");
            setName("");
            setAddress("");
            setSex("");
            setContactNumber("");
            setDate("");
        },
    });

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="bg-[#E7E7E7] p-6 max-w-4xl mx-auto text-sm rounded-xl">
                    <h1 className="text-center font-bold text-lg mb-6">
                        ATTENDANCE FORM
                    </h1>

                    {/* PROGRAM SELECT */}
                    <div className="mb-4">
                        <label className="font-semibold block mb-2">
                            Select Program: <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="program"
                            value={programId}
                            onChange={(e) => setProgramId(e.target.value)}
                            required
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select Program</option>
                            {isLoading ? (
                                <option>Loading...</option>
                            ) : programs.length > 0 ? (
                                programs.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.title}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No programs joined yet</option>
                            )}
                        </select>
                    </div>

                    {/* DATE */}
                    <div className="mb-4">
                        <label className="font-semibold block mb-2">
                            Date: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* NAME */}
                    <div className="mb-4">
                        <label className="font-semibold block mb-2">
                            Name: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* ADDRESS */}
                    <div className="mb-4">
                        <label className="font-semibold block mb-2">
                            Address: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            placeholder="Enter your address"
                        />
                    </div>

                    {/* SEX */}
                    <div className="mb-4">
                        <label className="font-semibold block mb-2">
                            Sex: <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={sex}
                            onChange={(e) => setSex(e.target.value)}
                            required
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* CONTACT NUMBER */}
                    <div className="mb-4">
                        <label className="font-semibold block mb-2">
                            Contact Number: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            className="w-full border p-2 rounded"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            required
                            placeholder="Enter your contact number"
                        />
                    </div>
                </div>

                {/* SUBMIT */}
                <div className="flex items-center justify-end">
                    <button
                        className="mt-2 bg-[#00306E] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 active:scale-90"
                        disabled={isPending}
                    >
                        {isPending ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </>
    );
}