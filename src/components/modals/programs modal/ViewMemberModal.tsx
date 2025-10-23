'use client'
/* para sa pag add at remove ng Learners & Members */
import { useAddMembers } from "@/hooks/program/AddMembers"
import { useRemoveMember } from "@/hooks/program/useRemoveMember"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

interface AddProgramMembersProps {
    programId: string
    title: string
    onSuccess: () => void
    onClose: () => void
    existingMembers: { email: string; name: string; role: string }[]
    isLoading: boolean
}

const ViewMemberModal = ({ programId, title, onClose, onSuccess, existingMembers, isLoading }: AddProgramMembersProps) => {
    useLockBodyScroll(true)
    const { emailInput, setEmailInput, emailLists, handleAddToList, handleSubmit, isPending } = useAddMembers({ programId, onSuccess })
    const { selectedEmails, handleToggleEmail, handleRemove, isRemoving } = useRemoveMember(programId)

    const filteredMembers = existingMembers.filter(
        (member) => member.role === "INSTRUCTOR"
    );

    return (
        <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
            <div className="bg-white p-3 rounded-xl shadow-2xl max-w-4xl w-full relative">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold text-gray-800 text-center mb-3">Add Instructors for: <span className="text-blue-600">{title}</span></h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side: Add Members */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Instructors</h3>
                            <input
                                type="email"
                                placeholder="Add emails (comma separated)"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 mb-4"
                            />

                            <button
                                type="button"
                                onClick={handleAddToList}
                                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
                            >
                                Add to List
                            </button>

                            {/* Email lists before submit */}
                            {emailLists.length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold mb-2">Emails to be added:</h4>
                                    <ul className="list-disc list-inside h-40 overflow-y-auto space-y-1 text-sm text-gray-600">
                                        {emailLists.map((email, idx) => (
                                            <li key={idx}>{email}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Right Side: Existing Members */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Instructors</h3>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    disabled={isRemoving || selectedEmails.length === 0}
                                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isRemoving ? 'Removing...' : `Remove (${selectedEmails.length})`}
                                </button>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[200px] h-96 overflow-y-auto">
                                {isLoading ? (
                                    <p className="text-gray-500 animate-pulse">Loading members...</p>
                                ) : filteredMembers.length === 0 ? (
                                    <p className="text-gray-500 italic">No instructors found.</p>
                                ) : (
                                    <ul className="space-y-2 w-full">
                                        {filteredMembers.map((member) => (
                                            <li
                                                key={member.email}
                                                className="flex justify-between items-center py-2 px-3 hover:bg-white rounded-md transition-colors duration-150"
                                            >
                                                <div>
                                                    <p className="font-medium">{member.name}</p>
                                                    <p className="text-sm text-gray-500">{member.email}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmails.includes(member.email)}
                                                    onChange={(e) =>
                                                        handleToggleEmail(member.email, e.target.checked)
                                                    }
                                                    className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM: Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-700 hover:bg-red-500 hover:text-white font-medium rounded-full hover:shadow-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"                        >
                            Cancel
                        </button>
                        {emailLists.length > 0 && (
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-6 py-2 bg-[#2ECC40] text-white font-medium rounded-full shadow-lg hover:bg-green-600 duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform"                            >
                                {isPending ? 'Adding...' : 'Add Members'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ViewMemberModal