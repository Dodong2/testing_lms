import { useMeetings } from "@/hooks/meeting/useMeetings"
import MeetingLists from "@/components/modals/meeting modal/MeetingLists"


export default function MeetingContent ({ programId }: { programId :string }) {
      const { data: meetings, isLoading } = useMeetings(programId).useGetMeetings()
  return (
    <div className="rounded-md shadow mt-3">
        <MeetingLists meetings={meetings} programId={programId} />
    </div>
  )
}
