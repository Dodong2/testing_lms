"use client"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"
import NotificationBell from "./notifAdmin/NotificationBell"

const titles: Record<string, string> = {
    "/home/participants": "Home",
    "/home/participants/evaluation": "Evaluation Form",
    "/home/participants/feedback": "Feedback",
    "/home/participants/programs": "Programs",
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
    <header className="sticky top-0 bg-[#00306E] p-4 z-10">
        <h1 className="text-ml font-bold text-white text-center">{pageTitle}</h1>
        
          {session.user.image && (
            <div className="absolute top-1 right-3 w-12 h-12 lg:top-2 lg:right-4 border-2 border-cyan-700 sm:w-5 sm:h-5 lg:w-11 lg:h-11 rounded-full overflow-hidden cursor-pointer active:scale-95 transition-transform duration-75"
            onClick={showProfile}>
              <Image src={session.user.image} alt="Profile" width={48} height={48}
              className="rounded-full object-cover w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-10" /> 
            </div>
                )}

            {show && (
              <div className="absolute text-white top-17 right-1 bg-[#00306E] p-4 rounded-2xl before:content-[''] before:absolute before:-top-1 before:right-6 before:w-5 before:h-3 before:bg-[#00306E] before:rotate-45">
              <p className="font-bold text-lg">{name}</p>
              <div className="flex items-center justify-left"><p className="text-xs text-blue-600 font-bold opacity-90 mt-1 mb-2 bg-white p-1  rounded-2xl">{role}</p></div>
                            <p className="text-sm opacity-90 mt-1">{email}</p>
              <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full w-full mt-2 cursor-pointer transition-transform duration-75 hover:bg-gray-100 transform active:scale-95" onClick={() => signOut({ callbackUrl: "/" })} >Sign Out</button>
              </div>
            )}
              
            {session.user.role === 'ADMIN' && (
              <div className="absolute top-4 right-25 ">
                <NotificationBell/>
            </div>
            )}
            
      </header>
  )
}

export default Header