"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
/* types */
import { Meeting } from "@/types/meetingManagetypes"
/* hooks */
import { useMeetingsModal } from "@/hooks/meeting/useMeetingsModal"
/* components */
import CreateMeetingModal from "@/components/modals/meeting modal/CreateMeetingModal"
/* icons */
import { IoAdd } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";

interface MeetingListsProps {
  meetings: Meeting[] | undefined
  programId: string
}

const MeetingLists = ({ meetings, programId }: MeetingListsProps) => {
  const { data: session } = useSession()
    const { createMeet, createToggleMeet } = useMeetingsModal()

  return (
    <div className="relative bg-[#525252] rounded-md p-4">
      {session?.user.role === 'INSTRUCTOR' && (
            <button onClick={createToggleMeet} className="absolute right-5 p-1 bg-amber-300 shadow-2xl hover:bg-amber-500 rounded-full cursor-pointer active:scale-95 transition-transform"><IoAdd size={25} /></button>
    )}
    {!meetings || meetings.length === 0 ? (
        <aside className="rounded-md p-4">
          <h3 className="text-white font-semibold mb-4">Upcoming Meetings</h3>
          <p className="text-sm text-gray-500">No upcoming meetings</p>
        </aside>
      ) : (
        <aside>
          <h3 className="text-white font-semibold text-2xl mb-4">Upcoming Meetings</h3>
          <ul className="space-y-3">
            {meetings.map((meeting) => (
              <li key={meeting.id} className="flex items-start gap-3 p-2 text-white hover:bg-gray-300 hover:text-gray-950 transition-all duration-200 rounded-lg">
                <div className="mt-2 w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-gray-950"><FaVideo/></div>
                  <Link href={meeting.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <p className="text-lg font-semibold ">{meeting.title}</p>
                    <p className="text-md">
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
              </li>
            ))}
          </ul>
        </aside>
      )}


        {createMeet && (
            <CreateMeetingModal programId={programId} onClose={createToggleMeet} onSuccess={createToggleMeet} />
            )}

    </div>
  )
}

export default MeetingLists
