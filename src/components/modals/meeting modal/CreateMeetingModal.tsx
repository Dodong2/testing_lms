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
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Meeting</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Meeting Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full border-b p-2"
          />
          <input
            type="url"
            placeholder="Meeting Link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
            className="w-full border-b p-2"
          />
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
            className="w-full border-b p-2"
          />
          <input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
            className="w-full border-b p-2"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMeetingModal