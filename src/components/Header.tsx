"use client"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"

const titles: Record<string, string> = {
    "/beneficiary": "Home",
    "/beneficiary/files": "Files",
    "/beneficiary/feedback": "Feeback",
    "/home/admin": "Dashboard",
    "/home/admin/usermanage": "User Management",
    "/home/admin/programManage": "Program Management",
    "/admin/activities": "Activity Logs",
    "/admin/notifications": "Notification",
    "/home/admin/feedbackManage": "Feedback Management",
    // "/admin/": "",
}

const Header = () => {
    const { data: session } = useSession()
    const [show, setShow] = useState(false)

    const showProfile = () => {
      setShow(prev => !prev)
    }

    const pathname = usePathname()
    const pageTitle = titles[pathname] || "Extenstion Portal"

    if(!session) return null // Prevent render flicker
    const { name, email, role } = session.user

  return (
    <header className="relative border-b border-gray-200 bg-[#2ECC40] p-4 z-10">
        <h1 className="text-ml font-bold text-white text-center">{pageTitle}</h1>
        
          {session.user.image && (
            <div className="absolute top-4 right-4 border-2 border-cyan-700 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden cursor-pointer active:scale-95 transition-transform duration-75"
            onClick={showProfile}>
              <Image src={session.user.image} alt="Profile" width={48} height={48}
              className="rounded-full object-cover w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" /> 
            </div>
                )}

            {show && (
              <div className="absolute text-white top-20 right-1 bg-blue-600 p-4 rounded-2xl before:content-[''] before:absolute before:-top-1 before:right-6 before:w-5 before:h-3 before:bg-blue-600 before:rotate-45">
              <p className="font-bold text-lg text-center">{name}</p>
              <hr/>
              <p className="text-sm opacity-90 mt-1">{email}</p>
              <div className="flex items-center justify-left"><p className="text-xs text-blue-600 font-bold opacity-90 mt-1 mb-2 bg-white p-1  rounded-2xl">{role}</p></div>
              <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full w-full mt-2 cursor-pointer transition-transform duration-75 hover:bg-gray-100 transform active:scale-95" onClick={() => signOut({ callbackUrl: "/" })} >Sign Out</button>
              </div>
            )}
      </header>
  )
}

export default Header