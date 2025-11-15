"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
/* hooks */
import { useProgram } from "@/hooks/program/useProgram";
import { createEval } from "@/hooks/evaluations/createEval";



type RatingCategory =
  | "content"
  | "materials"
  | "resourcePerson"
  | "overall";

// how many rows per section
const SECTION_ROWS: Record<RatingCategory, number> = {
  content: 3,
  materials: 2,
  resourcePerson: 5,
  overall: 2,
};

export default function EvalPage() {
  const { data: session } = useSession();
  if (!session) return null;

  const [programId, setProgramId] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [name, setName] = useState(session.user.name ?? "");


  // ⬇ STATE FOR CHECKBOX RATINGS
  const [ratings, setRatings] = useState({
    content: Array(3).fill(0) as number[],
    materials: Array(2).fill(0),
    resourcePerson: Array(5).fill(0),
    overall: Array(2).fill(0),
  });

  // Helper: update rating for a single row
  const setRating = (
    category: RatingCategory,
    rowIndex: number,
    value: number,
  ) => {
    setRatings((prev) => {
      const updated = [...prev[category]];
      updated[rowIndex] = value;
      return { ...prev, [category]: updated };
    });
  };

  // Programs from your hook
  const [page] = useState(1);
  const [search] = useState("");
  const { data: programData, isLoading } = useProgram().usePrograms(page, search, true);

  const programs =
    programData?.programs?.filter((p) =>
      session.user.role === "BENEFICIARY" ? p.joined === true : true,
    ) ?? [];


  const { handleSubmit, isPending } = createEval({ programs, programId, date, venue, suggestions, name, ratings })

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="bg-[#E7E7E7] p-6 max-w-4xl mx-auto text-sm rounded-xl">
          <h1 className="text-center font-bold text-lg">
            EVALUATION FORM (PAGTATAYA)
          </h1>
          <h2 className="text-center font-semibold">
            FOR TECHNICAL EXPERTISE (PARA SA TEKNIKAL NA PAG-AARAL)
          </h2>

          {/* PROGRAM SELECT */}
          <div className="mt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-semibold">
                  Title of Seminar/Training/Workshop:
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
            </div>

            {/* DATE + VENUE */}
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <label className="font-semibold">Date (Petsa):</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold">Venue (Lugar):</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* LEGEND */}
            <p className="mt-4 text-center">
              Please evaluate the over – all activities by checking the appropriate columns where:<br />
              (Kailangan naming ang inyong pagtataya para sa pangkalahatang aktibidades, markahan ng tsek ang naaangkop sa inyong kasagutan ayon sa sumusunod na sanggunian)
            </p>

            <div className="mt-4 text-xs md:text-sm font-semibold grid grid-cols-2 sm:grid-cols-1 lg:flex items-center gap-2 md:gap-4 text-center">
              <div className="flex flex-col items-center justify-center">
                <h1>5 = Strongly Agree</h1>
                <p>(Lubos na sumasang-ayon)</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <h1>4 = Agree</h1>
                <p>(Sumasang-ayon)</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <h1>3 = Moderately Agree</h1>
                <p>(Bahagyang Sumasang-ayon)</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <h1>2 = Disagree</h1>
                <p>(Di sumasang-ayon)</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <h1>1 = Strongly Disagree</h1>
                <p>(Lubos na di sumasang-ayon)</p>
              </div>
            </div>

            {/* ==================================== */}
            {/* ============ TABLE ================= */}
            {/* ==================================== */}
            <table className="mt-6 w-full border text-center text-sm">
              <thead>
                <tr className="border">
                  <th className="border p-2 text-left">
                    I. Content / Paksa ng Seminar
                  </th>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <th key={n} className="border p-2 w-10">
                      {n}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* CONTENT ROWS */}
                {[
                  "The topics are well organized and systematically discussed (Ang paksa ay natalakay nang kumpleto at detalyado)",
                  "The topics are relevant and vital to my work/task. (Ang mga paksang natalakay ay mahalaga at kapaki-pakinabang)",
                  "The topics are timely. (Napapanahon ang mga impormasyong ibinahagi.)"
                ].map((text, i) => (
                  <tr key={i} className="border relative p-0">
                    <td className="border p-2 text-left">
                      {i + 1}. {text}
                    </td>
                    {[5, 4, 3, 2, 1].map((val) => (
                      <td key={val} className="border relative p-0">
                        <input
                          type="checkbox"
                          checked={ratings.content[i] === val}
                          onChange={() => setRating("content", i, val)}
                          className="absolute inset-0 w-full h-full appearance-none cursor-pointer flex items-center justify-center checked:before:content-['✔']
    checked:before:text-black checked:before:text-xl checked:before:flex checked:before:items-center checked:before:justify-center checked:before:w-full
      checked:before:h-full checked:before:text-center border-0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* MATERIALS HEADER */}
                <tr>
                  <th colSpan={6} className="border p-2 text-left">
                    II. Materials / Kagamitang Pantalakay
                  </th>
                </tr>

                {[
                  "The Materials are available and prepared before the activity start. (Kumpleto ang lahat ng kinakailangang kagamitan)",
                  "The visual aids and handouts were helpful in facilitating inputs and generating outputs. (Lubos na nakatulong ang mga visuals at handouts).",
                ].map((text, i) => (
                  <tr key={i} className="border">
                    <td className="border p-2 text-left">
                      {i + 1}. {text}
                    </td>
                    {[5, 4, 3, 2, 1].map((val) => (
                      <td key={val} className="border relative p-0">
                        <input
                          type="checkbox"
                          checked={ratings.materials[i] === val}
                          onChange={() => setRating("materials", i, val)}
                          className="absolute inset-0 w-full h-full appearance-none cursor-pointer flex items-center justify-center checked:before:content-['✔']
    checked:before:text-black checked:before:text-xl checked:before:flex checked:before:items-center checked:before:justify-center checked:before:w-full
      checked:before:h-full checked:before:text-center border-0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* RESOURCE PERSON */}
                <tr>
                  <th colSpan={6} className="border p-2 text-left">
                    III. Resource Person / Tagapagsalita
                  </th>
                </tr>

                {[
                  "Knowledgeable and well-versed in the topic. (Malawak ang kaalaman ukol sa paksa).",
                  "Concept were clearly discussed. (Malinaw na natalakay at naipaliwanag ang mga konsepto).",
                  "Responsive to questions/issues raised by participants. (Nasagot ng malinaw at kumpleto ang mga katanungan).",
                  "Well-poised, alert and can hold participants’ attention. (May sigla at buhay ang paraan ng pagtatalakay).",
                  "Motivated the participants to actively involve. (Nahikayat ang mga dumalo na aktibong lumahok sa Gawain.)"
                ].map((text, i) => (
                  <tr key={i} className="border">
                    <td className="border p-2 text-left">
                      {i + 1}. {text}
                    </td>
                    {[5, 4, 3, 2, 1].map((val) => (
                      <td key={val} className="border relative p-0">
                        <input
                          type="checkbox"
                          checked={ratings.resourcePerson[i] === val}
                          onChange={() => setRating("resourcePerson", i, val)}
                          className="absolute inset-0 w-full h-full appearance-none cursor-pointer flex items-center justify-center checked:before:content-['✔']
    checked:before:text-black checked:before:text-xl checked:before:flex checked:before:items-center checked:before:justify-center checked:before:w-full
      checked:before:h-full checked:before:text-center border-0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* OVERALL */}
                <tr>
                  <th colSpan={6} className="border p-2 text-left">
                    IV. Overall Evaluation
                  </th>
                </tr>

                {[
                  "The entire program is well-organized. (Maayos ang pagados ng programa.)",
                  "The program objectives are attained. (Ang mga layunin ng programa ay nakamit)"
                ].map((text, i) => (
                  <tr key={i} className="border">
                    <td className="border p-2 text-left">
                      {i + 1}. {text}
                    </td>
                    {[5, 4, 3, 2, 1].map((val) => (
                      <td key={val} className="border relative p-0">
                        <input
                          type="checkbox"
                          checked={ratings.overall[i] === val}
                          onChange={() => setRating("overall", i, val)}
                          className="absolute inset-0 w-full h-full appearance-none cursor-pointer flex items-center justify-center checked:before:content-['✔']
    checked:before:text-black checked:before:text-xl checked:before:flex checked:before:items-center checked:before:justify-center checked:before:w-full
      checked:before:h-full checked:before:text-center border-0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* SUGGESTIONS */}
            <div className="mt-6">
              <label className="font-semibold">Suggestions / Comments</label>
              <textarea
                className="w-full border rounded p-2 mt-2 h-24"
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                required
              />
            </div>

            {/* NAME */}
            <div className="mt-6">
              <label className="font-semibold">Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded mt-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex items-center justify-end">
          <button className="mt-2 bg-[#00306E] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 active:scale-90" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </>
  );
}
