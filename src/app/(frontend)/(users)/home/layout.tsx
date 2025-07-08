'use client'
/* components */
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
/* icons */
import { HiHome } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
// import { IoMdPeople } from "react-icons/io";
import { LuFileSpreadsheet } from "react-icons/lu";
// import { MdOutlineHelpOutline } from "react-icons/md";
import { MdOutlineFeedback } from "react-icons/md";
import { FaChartBar } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
/* for session */
import { useSession } from "next-auth/react";

export default function BeneficiaryLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    if(!session) return null
  // Mga items para sa sidebar (may icon at text)
  // ito yung mga contexts o values sa href, icon, text, na ipapasa sa sidebar para ma-display
  const sidebarItems = [
    ...(session.user.role === 'BENEFICIARY' || session.user.role === 'INSTRUCTOR' ? [
    { href: "/home/participants", icon: <HiHome />, text: "Programs" },
    { href: "/calendar", icon: <FaCalendarAlt />, text: "Calendar" },
    { href: "/beneficiary/files", icon: <LuFileSpreadsheet />, text: "Files" },
    // { href: "/beneficiary/files", icon: <MdOutlineHelpOutline  />, text: "Help" },
    { href: "/home/participants/feedback", icon: <MdOutlineFeedback  />, text: "Feedback" },
  ]: []),
    

    ...(session.user.role === 'ADMIN' ? [
    { href: "/home/admin", icon: <FaChartBar />, text: "Dashboard" },
    { href: "/home/admin/usermanage", icon: <FaUsers />, text: "User management" },
    { href: "/home/admin/programManage", icon: <FaUsers />, text: "Program management" },
    { href: "/admin/activities", icon: <FaClipboardList />, text: "Activity logs" },
    { href: "/admin/notifications", icon: <IoNotifications />, text: "Notification" },
    { href: "/admin", icon: <MdOutlineFeedback />, text: "Feedback Management",},
    ]: []) 
  ];

  

  // Optional section ng "Programs"
  // ito yung mga contexts o values sa text na ipapasa sa sidebar para ma-display
  const programs = ["Topic", "Topic", "Finance"];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header/>

      {/* MAIN CONTENT + SIDEBAR */}
      <div className="flex flex-1 relative">
        <Sidebar items={sidebarItems} programs={programs} />
        <main className="flex-1 md:ml-60 p-6 overflow-x-hidden">{children}</main>
      </div>
  </div>
  );
}
