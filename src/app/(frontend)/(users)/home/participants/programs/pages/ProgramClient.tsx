'use client'
import { useState } from "react"
/* hooks */
import { useMeetings } from "@/hooks/meeting/useMeetings"
import { useNavbarTabs } from "@/hooks/useNavbarTabs"
/* components */
import Navbar from "@/components/Navbar"
import MeetingLists from "@/components/modals/meeting modal/MeetingLists"
/* icons */
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoMdInformationCircle } from "react-icons/io";

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
  const [showExplanation, setExplanation] = useState(false)

  const ToggleExplanations = () => {
    setExplanation((prev) => !prev)
  }

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
          <div className="relative bg-gray-800 rounded-t-1xl text-white p-5">
            <h2 className="text-3xl font-semibold">{program.title}</h2>
            <h4 className="text-1xl font-semibold">{program.subtitle}</h4>

            {/* explanations */}
            <div>
              <button onClick={ToggleExplanations} className={`absolute top-5 right-5`} title="view program description">
                {showExplanation ? <IoMdInformationCircle size={30}/> : <IoMdInformationCircleOutline size={30}/>}
                </button>
              {showExplanation && (
                <div className="bg-white p-2 rounded-md border border-gray-300 mt-2">
                  <h1 className="text-1xl font-bold text-gray-700 whitespace-pre-wrap">Program descriptions:</h1>
                  <div className="p-0.5 rounded-md w-full bg-gray-700"></div>
                  <span className="text-sm text-gray-700 whitespace-pre-wrap">{program.explanation}</span>
                </div>
              )}
              </div>
            {/* <h2 className="text-1xl">Welcome, {username}!</h2> */}
          </div>

          {/* Tabs */}
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Dynamic Content based on active tab */}
          {renderContent()}
        </div>



        {/* Right Sidebar - Upcoming Meetings */}
        <MeetingLists meetings={meetings} programId={programId} />

      </div>


    </div>
  )
}

export default ProgramClient