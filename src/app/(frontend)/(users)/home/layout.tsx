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

export default function BeneficiaryLayout({ children }: { children: React.ReactNode }) {
  // Mga items para sa sidebar (may icon at text)
  // ito yung mga contexts o values sa href, icon, text, na ipapasa sa sidebar para ma-display
  const sidebarItems = [
    { href: "/beneficiary", icon: <HiHome />, text: "Programs" },
    { href: "/calendar", icon: <FaCalendarAlt />, text: "Calendar" },
    { href: "/beneficiary/files", icon: <LuFileSpreadsheet />, text: "Files" },
    // { href: "/beneficiary/files", icon: <MdOutlineHelpOutline  />, text: "Help" },
    { href: "/beneficiary/feedback", icon: <MdOutlineFeedback  />, text: "Feedback" },
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
