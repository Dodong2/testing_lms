"use client"
import { usePathname } from "next/navigation"

const titles: Record<string, string> = {
    "/beneficiary": "Home",
    "/beneficiary/files": "Files",
    "/beneficiary/feedback": "Feeback",
    "/admin": "Dashboard",
    "/admin/usermanage": "User Management",
    "/admin/activities": "Activity Logs",
    "/admin/programs": "Program Management",
    "/admin/notifications": "Notification",
    // "/admin/feedback": "",
    // "/admin/": "",
}

const Header = () => {
    const pathname = usePathname()
    const pageTitle = titles[pathname] || "4PS E-Learning Platform"
  return (
    <header className="border-b border-gray-200 text-white p-4 z-10">
        <h1 className="text-ml font-bold text-black text-center">{pageTitle}</h1>
      </header>
  )
}

export default Header