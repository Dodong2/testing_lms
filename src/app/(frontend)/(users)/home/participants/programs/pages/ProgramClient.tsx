'use client'
import Navbar from "@/components/Navbar"
import { useMeetings } from "@/hooks/meeting/useMeetings"
import { useNavbarTabs } from "@/hooks/useNavbarTabs"


import MeetingLists from "@/components/modals/meeting modal/MeetingLists"


interface Program {
  id: string
  title: string
  explanation: string
  subtitle: string
}

interface ProgramClientProps {
  programId: string
  program: Program
  username: string
}

const ProgramClient = ({ programId, program, username }: ProgramClientProps) => {
  const { activeTab, setActiveTab, renderContent } = useNavbarTabs({
    program: {
      id: program.id,
      title: program.title,
      explanation: program.explanation,
      subtitle: program.subtitle

    }, username
  })
  const { data: meetings, isLoading } = useMeetings(programId).useGetMeetings()
  
  if (isLoading) return <p>Loading...</p>

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 items-start">
        {/* Main content - LEFT SIDE */}
        <div className="bg-white rounded-md overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 rounded-t-1xl text-white p-5">
            <h2 className="text-lg font-semibold">{program.title}</h2>
            <h4>{program.subtitle}</h4>
            <p>explanation: {program.explanation}</p>
            <p>Welcome, {username}!</p>
          </div>

          {/* Tabs */}
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Dynamic Content based on active tab */}
          {renderContent()}
        </div>



        {/* Right Sidebar - Upcoming Meetings */}
        <MeetingLists meetings={meetings} programId={programId}/>

      </div>
            

    </div>
  )
}

export default ProgramClient