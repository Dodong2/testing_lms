"use client"

import Link from "next/link"
import { Meeting } from "@/types/meetingManagetypes"
import { useMeetingsModal } from "@/hooks/meeting/useMeetingsModal"
import CreateMeetingModal from "@/components/modals/meeting modal/CreateMeetingModal"

interface MeetingListsProps {
  meetings: Meeting[] | undefined
  programId: string
}

const MeetingLists = ({ meetings, programId }: MeetingListsProps) => {
    const { createMeet, createToggleMeet } = useMeetingsModal()

  if (!meetings || meetings.length === 0) {
    return (
      <aside className="hidden md:block bg-gray-100 rounded-md p-4">
        <h3 className="text-gray-700 font-semibold mb-4">Upcoming</h3>
        <p className="text-sm text-gray-500">No upcoming meetings</p>
      </aside>
    )
  }

  return (
    <div>
    <aside className="hidden md:block bg-gray-100 rounded-md p-4">
        <button onClick={createToggleMeet}>+</button>
      <h3 className="text-gray-700 font-semibold mb-4">Upcoming</h3>
      <ul className="space-y-3">
        {meetings.map((meeting) => (
          <li key={meeting.id} className="flex items-start gap-3">
            <div className="mt-1 w-6 h-6 rounded-full bg-gray-400"></div>
            <div>
              <Link href={meeting.link} target="_blank" rel="noopener noreferrer">
                <p className="text-sm font-semibold">{meeting.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(meeting.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  –{" "}
                  {new Date(meeting.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {new Date(meeting.startTime).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </aside>

        {createMeet && (
            <CreateMeetingModal programId={programId} onClose={createToggleMeet} onSuccess={createToggleMeet} />
            )}

    </div>
  )
}

export default MeetingLists
