"use client"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"
import { EvaluationEntry } from "@/types/evaluationManagetypes"

interface EvaluationDetailModalProps {
    evaluation: EvaluationEntry;
    onClose: () => void;
}

const EvaluationDetailModal = ({ evaluation, onClose}: EvaluationDetailModalProps) => {
    useLockBodyScroll(true)
    const { ratings, suggestions, venue, titleOfSeminar, user } = evaluation;

    // Questions for each category
    const contentQuestions = [
        "The topics are well organized and systematically discussed (Ang paksa ay natalakay nang kumpleto at detalyado)",
        "The topics are relevant and vital to my work/task. (Ang mga paksang natalakay ay mahalaga at kapaki-pakinabang)",
        "The topics are timely. (Napapanahon ang mga impormasyong ibinahagi.)"
    ];

    const materialsQuestions = [
        "The Materials are available and prepared before the activity start. (Kumpleto ang lahat ng kinakailangang kagamitan)",
        "The visual aids and handouts were helpful in facilitating inputs and generating outputs. (Lubos na nakatulong ang mga visuals at handouts)."
    ];

    const resourcePersonQuestions = [
        "Knowledgeable and well-versed in the topic. (Malawak ang kaalaman ukol sa paksa).",
        "Concept were clearly discussed. (Malinaw na natalakay at naipaliwanag ang mga konsepto).",
        "Responsive to questions/issues raised by participants. (Nasagot ng malinaw at kumpleto ang mga katanungan).",
        "Well-poised, alert and can hold participants' attention. (May sigla at buhay ang paraan ng pagtatalakay).",
        "Motivated the participants to actively involve. (Nahikayat ang mga dumalo na aktibong lumahok sa Gawain.)"
    ];

    const overallQuestions = [
        "The entire program is well-organized. (Maayos ang pagados ng programa.)",
        "The program objectives are attained. (Ang mga layunin ng programa ay nakamit)"
    ];

    // Helper function to convert rating to text
    const getRatingText = (rating: number): string => {
        const ratingMap: Record<number, string> = {
            5: "Strongly Agree",
            4: "Agree",
            3: "Moderately Agree",
            2: "Disagree",
            1: "Strongly Disagree"
        };
        return ratingMap[rating] || "N/A";
    };

    return (
        <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
            <div className="bg-[#E7E7E7] rounded-lg shadow-lg max-w-3xl w-full relative max-h-[80vh] overflow-y-auto p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
                >
                    ✕
                </button>

                <div className="space-y-6">
                    {/* User Info */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{evaluation.name}</h2>
                        {/* <p className="text-sm text-gray-600">{user.email}</p> */}
                    </div>

                    {/* Title & Venue */}
                    <div className="border-t pt-4 space-y-2">
                        <div>
                            <p className="font-semibold text-gray-700">Title:</p>
                            <p className="text-gray-600">{titleOfSeminar}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Venue:</p>
                            <p className="text-gray-600">{venue}</p>
                        </div>
                    </div>

                    {/* Ratings */}
                    <div className="border-t pt-4">
                        <h3 className="font-bold text-gray-800 mb-4">Ratings:</h3>

                        {/* I. Content */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-2">I. Content / Nilalaman</h4>
                            <div className="space-y-3">
                                {contentQuestions.map((question, index) => (
                                    <div key={index} className="bg-white p-3 rounded">
                                        <p className="text-sm text-gray-700 mb-1">
                                            {index + 1}. {question}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Answer: <span className="text-blue-600">{getRatingText(ratings.content[index])}</span> ({ratings.content[index]})
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* II. Materials */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-2">II. Materials / Kagamitang Pantalakay</h4>
                            <div className="space-y-3">
                                {materialsQuestions.map((question, index) => (
                                    <div key={index} className="bg-white p-3 rounded">
                                        <p className="text-sm text-gray-700 mb-1">
                                            {index + 1}. {question}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Answer: <span className="text-blue-600">{getRatingText(ratings.materials[index])}</span> ({ratings.materials[index]})
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* III. Resource Person */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-2">III. Resource Person / Tagapagsalita</h4>
                            <div className="space-y-3">
                                {resourcePersonQuestions.map((question, index) => (
                                    <div key={index} className="bg-white p-3 rounded">
                                        <p className="text-sm text-gray-700 mb-1">
                                            {index + 1}. {question}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Answer: <span className="text-blue-600">{getRatingText(ratings.resourcePerson[index])}</span> ({ratings.resourcePerson[index]})
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* IV. Overall */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-2">IV. Overall Evaluation</h4>
                            <div className="space-y-3">
                                {overallQuestions.map((question, index) => (
                                    <div key={index} className="bg-white p-3 rounded">
                                        <p className="text-sm text-gray-700 mb-1">
                                            {index + 1}. {question}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Answer: <span className="text-blue-600">{getRatingText(ratings.overall[index])}</span> ({ratings.overall[index]})
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    {suggestions && (
                        <div className="border-t pt-4">
                            <p className="font-semibold text-gray-700 mb-2">Suggestions:</p>
                            <p className="text-gray-600 bg-white p-3 rounded">{suggestions}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvaluationDetailModal;