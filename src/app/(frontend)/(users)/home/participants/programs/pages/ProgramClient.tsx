'use client'
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
/* hooks */
import { useNavbarTabs } from "@/hooks/useNavbarTabs"
/* components */
import Navbar from "@/components/Navbar"
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
  const { data: session } = useSession()
  const [showExplanation, setExplanation] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

   const role = (session?.user?.role as "INSTRUCTOR" | "BENEFICIARY") || "BENEFICIARY"

  const ToggleExplanations = () => {
    setExplanation((prev) => !prev)
  }

  const currentTab = searchParams.get('tab') || 'updates'

  const { activeTab, setActiveTab, renderContent } = useNavbarTabs({
    program: {
      id: program.id,
      title: program.title,
      explanation: program.explanation,
      subtitle: program.subtitle

    }, username, role, initialTab: currentTab
  })

  

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto  gap-4">
        {/* Main content - LEFT SIDE */}
        <div className="rounded-md overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-400 to-white rounded-t-1xl text-gray-900 p-5">
            <h2 className="text-3xl font-semibold">{program.title}</h2>
            <h4 className="text-1xl font-semibold">{program.subtitle}</h4>

            {/* explanations */}
            <div>
              <button onClick={ToggleExplanations} className={`absolute top-5 right-5 transition-all duration-200`} title="view program description">
                {showExplanation ? <IoMdInformationCircle className="text-amber-600" size={30} /> : <IoMdInformationCircleOutline size={30} />}
              </button>
              {showExplanation && (
                <div className="bg-white/30 p-2 rounded-md border border-gray-300 mt-2">
                  <h1 className="text-1xl font-bold text-gray-700 whitespace-pre-wrap">Program descriptions:</h1>
                  {/* <div className="p-0.5 rounded-md w-full bg-gray-700"></div> */}
                  <span className="text-sm text-gray-700 whitespace-pre-wrap">{program.explanation}</span>
                </div>
              )}
            </div>
            {/* <h2 className="text-1xl">Welcome, {username}!</h2> */}
          </div>

          {/* Tabs */}
          <Navbar activeTab={activeTab} setActiveTab={handleTabChange} role={role} />

          {/* Dynamic Content based on active tab */}
          {renderContent()}
        </div>
      </div>


    </div>
  )
}

export default ProgramClient