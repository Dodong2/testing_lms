import { EvaluationEntry } from "@/types/evaluationManagetypes"

interface EvaluationDetailModalProps {
    evaluation: EvaluationEntry;
    onClose: () => void;
}

const EvaluationDetailModal = ({ evaluation, onClose }: EvaluationDetailModalProps) => {
    const { ratings, suggestions, venue, titleOfSeminar, user } = evaluation
    return (
        <div className="fixed flex inset-0 items-center justify-center z-50" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
            <div className="bg-[#E7E7E7] rounded-lg shadow-lg max-w-md w-full relative max-h-[80vh] overflow-y-auto">
                <button onClick={onClose}>Close</button>
                <div className="space-y-8">
                    <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>

                    <div className="border-t pt-4">
                        <p className="font-semibold text-gray-700">Title:</p>
                        <p className="text-gray-600">{titleOfSeminar}</p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-700">Venue:</p>
                        <p className="text-gray-600">{venue}</p>
                    </div>

                    <div className="border-t pt-4">
                        <p className="font-semibold text-gray-700 mb-2">Ratings:</p>

                        <div className="space-y-2">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Content:</p>
                                <p className="text-gray-800">{ratings.content.join(", ")}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Materials:</p>
                                <p className="text-gray-800">{ratings.materials.join(", ")}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Resource Person:</p>
                                <p className="text-gray-800">{ratings.resourcePerson.join(", ")}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Overall:</p>
                                <p className="text-gray-800">{ratings.overall.join(", ")}</p>
                            </div>
                        </div>
                    </div>

                    {suggestions && (
                        <div className="border-t pt-4">
                            <p className="font-semibold text-gray-700">Suggestions:</p>
                            <p className="text-gray-600">{suggestions}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EvaluationDetailModal