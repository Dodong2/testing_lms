"use client"
import { useState } from "react"
import { useMeetings } from "@/hooks/meeting/useMeetings"
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"

interface MeetingProps {
    programId: string
    onClose: () => void
    onSuccess: () => void
}

const CreateMeetingModal = ({ programId, onClose, onSuccess }: MeetingProps) => {
    useLockBodyScroll(true)
    const [formData, setFormData] = useState({ title: "", link: "", startTime: "", endTime: "" })
    const { mutate: createMeeting, isPending } = useMeetings(programId).useCreateMeeting()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createMeeting(formData)
        onSuccess()
    }

  return (
     <div className="fixed flex inset-0 items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
      <div className="bg-[#E7E7E7] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl text-gray-950 font-semibold mb-4">Create Meeting</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Meeting Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
             className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
          <input
            type="url"
            placeholder="Meeting Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
            className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />

          {/* start time */}
          <label className="text-sm font-medium text-gray-950">Start Time</label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
             className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />

          {/* end time */}
          <label className="text-sm font-medium text-red-500">End Time</label>
          <input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
            className="bg-white shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white font-medium rounded-full hover:shadow-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer active:scale-95 transition-transform" >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMeetingModal