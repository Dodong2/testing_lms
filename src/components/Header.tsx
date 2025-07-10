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
    // "/admin/feedback": "",
    // "/admin/": "",
}

const Header = () => {
    const { data: session, status } = useSession()
    const [show, setShow] = useState(false)

    const showProfile = () => {
      setShow(prev => !prev)
    }

    const pathname = usePathname()
    const pageTitle = titles[pathname] || "4PS E-Learning Platform"

    if(!session) return null // Prevent render flicker
    const { name, email, role } = session.user

  return (
    <header className="relative border-b border-gray-200 bg-white p-4 z-10">
        <h1 className="text-ml font-bold text-black text-center">{pageTitle}</h1>
        
          {session.user.image && (
            <div className="absolute top-4 right-4 border-2 border-cyan-700 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden cursor-pointer active:scale-95 transition-transform duration-75"
            onClick={showProfile}>
              <Image src={session.user.image} alt="Profile" width={48} height={48}
              className="rounded-full object-cover w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" /> 
            </div>
                )}

            {show && (
              <div className="absolute top-20 right-1 bg-blue-600 p-2 rounded-2xl">
              <p>{name}</p>
              <p>{email}</p>
              <p>{role}</p>
              <button className="bg-blue-50 p-1 cursor-pointer active:scale-95 transition-transform duration-75" onClick={() => signOut({ callbackUrl: "/" })} >Sign Out</button>
              </div>
            )}
      </header>
  )
}

export default Header