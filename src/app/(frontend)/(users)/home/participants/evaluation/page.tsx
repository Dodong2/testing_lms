export default function evalPage() {
    return (<>
        <div className="bg-[#E7E7E7] p-6 max-w-4xl mx-auto text-sm">
            <h1 className="text-center font-bold text-lg">EVALUATION FORM (PAGTATAYA)</h1>
            <h2 className="text-center font-semibold">FOR TECHNICAL EXPERTISE (PARA SA TEKNIKAL NA PAG-AARAL)</h2>

            <div className="mt-6">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="font-semibold">Title of Seminar/Training/Workshop (Pamagat ng Seminar):</label>
                        <select className="w-full border p-2 rounded">
                            <option>program you join only</option>
                            <option>program you join only</option>
                            <option>program you join only</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    <div className="flex-1">
                        <label className="font-semibold">Date(Petsa):</label>
                        <input type="text" className="w-full border p-2 rounded" />
                    </div>
                    <div className="flex-1">
                        <label className="font-semibold">Venue(Lugar):</label>
                        <input type="text" className="w-full border p-2 rounded" />
                    </div>
                </div>

                <p className="mt-4 text-justify">
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

                {/* TABLE */}
                <table className="mt-6 w-full border text-center text-sm">
                    <thead>
                        <tr className="border">
                            <th className="border p-2 text-left">I. Content/Paksa ng Seminar/Training:</th>
                            {[5, 4, 3, 2, 1].map(n => (
                                <th key={n} className="border p-2 w-10">{n}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Row 1 */}
                        {["The topics are well organized and systematically discussed (Ang paksa ay natalakay nang kumpleto at detalyado)",
                            "The topics are relevant and vital to my work/task. (Ang mga paksang natalakay ay mahalaga at kapaki-pakinabang)",
                            "The topics are timely. (Napapanahon ang mga impormasyong ibinahagi.)"]
                            .map((text, i) => (
                                <tr key={i} className="border">
                                    <td className="border p-2 text-left">{i + 1}. {text}</td>
                                    {[5, 4, 3, 2, 1].map((n, j) => (
                                        <td key={j} className="border relative p-0">
                                            <input
                                                type="checkbox"
                                                className="absolute inset-0 w-full h-full appearance-none cursor-pointer flex items-center justify-center checked:before:content-['✔']
    checked:before:text-black checked:before:text-xl checked:before:flex checked:before:items-center checked:before:justify-center checked:before:w-full
      checked:before:h-full checked:before:text-center border-0"/>
                                        </td>

                                    ))}
                                </tr>
                            ))}

                        {/* Materials Section */}
                        <tr>
                            <th className="border p-2 text-left" colSpan={6}>II. Materials / Kagamitang Pantalakay</th>
                        </tr>
                        {["The Materials are available and prepared before the activity start. (Kumpleto ang lahat ng kinakailangang kagamitan)",
                            "The visual aids and handouts were helpful in facilitating inputs and generating outputs. (Lubos na nakatulong ang mga visuals at handouts)."]
                            .map((text, i) => (
                                <tr key={i} className="border">
                                    <td className="border p-2 text-left">{i + 1}. {text}</td>
                                    {[5, 4, 3, 2, 1].map((n, j) => (
                                        <td key={j} className="border relative p-0">
                                            <input
                                                type="checkbox"
                                                className="absolute inset-0 w-full h-full appearance-none cursor-pointer flex items-center justify-center checked:before:content-['✔']
    checked:before:text-black checked:before:text-xl checked:before:flex checked:before:items-center checked:before:justify-center checked:before:w-full
      checked:before:h-full checked:before:text-center border-0"/>
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {/* Resource Person */}
                        <tr>
                            <th className="border p-2 text-left" colSpan={6}>III. Resource Person / Tagapagsalita</th>
                        </tr>
                        {["Knowledgeable and well-versed in the topic. (Malawak ang kaalaman ukol sa paksa).",
                            "Concept were clearly discussed. (Malinaw na natalakay at naipaliwanag ang mga konsepto).",
                            "Responsive to questions/issues raised by participants. (Nasagot ng malinaw at kumpleto ang mga katanungan).",
                            "Well-poised, alert and can hold participants’ attention. (May sigla at buhay ang paraan ng pagtatalakay).",
                            "Motivated the participants to actively involve. (Nahikayat ang mga dumalo na aktibong lumahok sa Gawain.)"]
                            .map((text, i) => (
                                <tr key={i} className="border">
                                    <td className="border p-2 text-left">{i + 1}. {text}</td>
                                    {[5, 4, 3, 2, 1].map((n, j) => (
                                        <td key={j} className="border relative p-0">
                                            <input
                                                type="checkbox"
                                                className="absolute inset-0 w-full h-full appearance-none cursor-pointer flex items-center justify-center checked:before:content-['✔']
    checked:before:text-black checked:before:text-xl checked:before:flex checked:before:items-center checked:before:justify-center checked:before:w-full
      checked:before:h-full checked:before:text-center border-0"/>
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {/* Overall */}
                        <tr>
                            <th className="border p-2 text-left" colSpan={6}>IV. Over all Evaluation/Pangkalahatang Pagtataya</th>
                        </tr>
                        {["The entire program is well-organized. (Maayos ang pagados ng programa.)",
                            "The program objectives are attained. (Ang mga layunin ng programa ay nakamit)"]
                            .map((text, i) => (
                                <tr key={i} className="border">
                                    <td className="border p-2 text-left">{i + 1}. {text}</td>
                                    {[5, 4, 3, 2, 1].map((n, j) => (
                                        <td key={j} className="border relative p-0">
                                            <input
                                                type="checkbox"
                                                className="absolute inset-0 w-full h-full appearance-none cursor-pointer flex items-center justify-center checked:before:content-['✔']
    checked:before:text-black checked:before:text-xl checked:before:flex checked:before:items-center checked:before:justify-center checked:before:w-full
      checked:before:h-full checked:before:text-center border-0"/>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* Suggestions */}
                <div className="mt-6">
                    <label className="font-semibold">SUGGESTIONS/COMMENTS</label>
                    <textarea className="w-full border rounded p-2 mt-2 h-24"></textarea>
                </div>

                {/* Signature */}
                <div className="mt-6">
                    <label className="font-semibold">Signature over printed name (optional)</label>
                    <input type="text" className="w-full border p-2 rounded mt-2" />
                </div>
            </div>
        </div><br />
        <div className="flex items-center justify-end">
            <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 active:scale-90">submit</button>
        </div>
    </>);
}