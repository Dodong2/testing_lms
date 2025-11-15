'use client'
/* components */
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
/* hooks */
import { useFeedbackEvents } from "@/hooks/socket/useFeedbackSocket";
/* icons */
import { HiHome } from "react-icons/hi";
import { MdOutlineFeedback } from "react-icons/md";
import { FaChartBar } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { RiOrganizationChart } from "react-icons/ri";
import { FaWpforms } from "react-icons/fa";
/* for session */
import { useSession } from "next-auth/react";

export default function BeneficiaryLayout({ children }: { children: React.ReactNode }) {
  useFeedbackEvents()
    const { data: session } = useSession()
    if(!session) return null
  // Mga items para sa sidebar (may icon at text)
  // ito yung mga contexts o values sa href, icon, text, na ipapasa sa sidebar para ma-display
  const sidebarItems = [
    ...(session.user.role === 'BENEFICIARY' ? [
    { href: "/home/participants", icon: <HiHome />, text: "Programs" },
    { href: "/home/participants/evaluation", icon: <FaWpforms />, text: "Evaluation" },
    { href: "/home/participants/feedback", icon: <MdOutlineFeedback  />, text: "Feedback"  },
  ]: []),

    ...(session.user.role === 'INSTRUCTOR' ? [
    { href: "/home/instructors", icon: <HiHome />, text: "Programs" },
    // { href: "/home/participants/files", icon: <LuFileSpreadsheet />, text: "Files" },
    { href: "/home/participants/feedback", icon: <MdOutlineFeedback  />, text: "Feedback"  },
    ]: []),
    

    ...(session.user.role === 'ADMIN' ? [
    { href: "/home/admin", icon: <FaChartBar />, text: "Dashboard" },
    { href: "/home/admin/usermanage", icon: <FaUsers />, text: "User management" },
    { href: "/home/admin/programManage", icon: <RiOrganizationChart />, text: "Program management" },
    { href: "/home/admin/feedbackManage", icon: <MdOutlineFeedback />, text: "Feedback management"},
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
