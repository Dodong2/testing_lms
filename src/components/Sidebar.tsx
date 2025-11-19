"use client"
/* hooks */
import { useState, ReactNode } from "react";
import Image from "next/image";
/* links */
import Link from "next/link";
import { usePathname } from "next/navigation";
/* icons */
import { FiMenu } from "react-icons/fi";
import { RiMenu4Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
/* for session */
import { useSession } from "next-auth/react";

// -------- TYPES / INTERFACES --------

// Ito ang shape/types ng bawat item sa sidebar
interface SidebarItem {
  href: string // URL ng link
  icon: ReactNode // icon component
  text:string // label ng link
  onClick?: () => void
}

// Props para sa buong Sidebar component
interface SidebarProps {
  defaultOpen?: boolean; // optional prop kung open or close ang sidebar sa umpisa
  items: SidebarItem[]; // list ng sidebar items
  programs?: string[]; // optional list ng "programs" sa ibaba ng sidebar
}

// -------- COMPONENTS --------

// Component para sa bawat item ng sidebar
// dito nangyayari yung pag-pasa ng href, icon, text para display galing sa ibang page
// dito babaguhin
const SidebarItem = ({ href, icon, text, onClick }: SidebarItem) => {
  const pathname = usePathname()
  const isActive = pathname === href

  const handleClick = (e: React.MouseEvent) => {
    if (isActive) {
      e.preventDefault() // ✅ prevent navigation
      return
    }
    onClick?.()
  }

  return (
  <Link
    href={href} onClick={handleClick}
    className={`group relative flex items-center gap-3 px-4 py-2 font-medium text-1xl rounded-md transition-colors  hover:animate-pulse ${isActive ? "text-blue-500" : "text-[#EFEFEF] hover:text-blue-500"}`}>
      {/* 🔵 Active indicator bar (left side lang) */}
      {isActive && (
        <div className="absolute right-0 top-0 h-full w-1 bg-blue-500 rounded-l-md"></div>
      )}
    <span className="w-5 h-5 flex items-center justify-center transform transition-transform duration-200 group-hover:scale-135">{icon}</span>
    <span className="whitespace-nowrap">{text}</span>
  </Link>
  )
};


// Main Sidebar component
// dito babaguhin design ng sidebar
const Sidebar = ({ defaultOpen = false, items }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen); // State para sa open/close ng sidebar (especially sa mobile)
  const { data: session } = useSession()
  if(!session) return null


  return (
    <>
      {/* BUTTON: Toggle button para sa mobile menu. magpapakita lang if sa mobile screen */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-2 left-3 z-40 p-2 bg-[#00306E] active:border-1 active:border-white rounded-md shadow-xl text-white "
        aria-label="Toggle menu"
      >
        {isOpen ? <IoClose className="cursor-pointer active:scale-95 transition-transform duration-75" size={24}/>  : <RiMenu4Fill className="cursor-pointer active:scale-95 transition-transform duration-75" size={24}/> }
        
      </button>

      {/* OVERLAY: Lumalabas lang sa mobile kapag bukas ang sidebar */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* SIDEBAR: Main navigation panel */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#222222] z-30 overflow-auto
        transition-transform duration-300 ease-in-out w-60
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar header */}
        <div className="relative flex items-center p-4 font-bold shadow-2xl bg-[#00306E] whitespace-nowrap">
          <div className="absolute lg:block">
          <Image src="/logo.png" alt='logo' width={35} height={35}/>
          </div>
         <p className="ml-10 text-white">EduLink</p> 
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="py-4 flex flex-col">
          {/* Main sidebar items (links) */}
          {/* ito yung components, dito na display yung href, icon, text galing sa ibang page */}
          {items.map((item, idx) => (
            <SidebarItem key={idx} href={item.href} icon={item.icon} text={item.text} onClick={() => setIsOpen(false)} />
          ))}          
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
