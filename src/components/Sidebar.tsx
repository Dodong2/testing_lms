"use client"
/* hooks */
import { useState, ReactNode } from "react";
/* links */
import Link from "next/link";
/* icons */
import { FiMenu } from "react-icons/fi";

// -------- TYPES / INTERFACES --------

// Ito ang shape/types ng bawat item sa sidebar
interface SidebarItem {
  href: string // URL ng link
  icon: ReactNode // icon component
  text:string // label ng link
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
const SidebarItem = ({ href, icon, text }: SidebarItem) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
  >
    <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
    <span className="whitespace-nowrap">{text}</span>
  </Link>
);

// Component para sa bawat program name
// dito nangyayari yung pag-pasa ng text para display galing sa ibang page
// dito babaguhin
const ProgramItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 px-4 py-2">
    <div className="w-2 h-2 bg-gray-500 rounded-full" />
    <span className="text-gray-700 whitespace-nowrap">{text}</span>
  </div>
);

// Main Sidebar component
// dito babaguhin design ng sidebar
const Sidebar = ({ defaultOpen = false, items, programs = [] }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen); // State para sa open/close ng sidebar (especially sa mobile)

  return (
    <>
      {/* BUTTON: Toggle button para sa mobile menu. magpapakita lang if sa mobile screen */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-2 left-4 z-40 p-2 bg-white rounded-md shadow-md"
        aria-label="Toggle menu"
      >
        <FiMenu size={24} />
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
        className={`fixed top-0 left-0 h-full bg-gray-100 border-r border-gray-200 z-30 overflow-auto
        transition-transform duration-300 ease-in-out w-60
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar header */}
        <div className="p-4 font-bold border-b border-gray-200 whitespace-nowrap">
         <p className="ml-15">4Ps Portal</p> 
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="py-4 flex flex-col">
          {/* Main sidebar items (links) */}
          {/* ito yung components, dito na display yung href, icon, text galing sa ibang page */}
          {items.map((item, idx) => (
            <SidebarItem key={idx} href={item.href} icon={item.icon} text={item.text} />
          ))}

          {/* Programs section - optional */}
          {/* dito na display yung text, programs, galing sa ibang page */}
          {programs.length > 0 && (
            <>
              <div className="mt-4 mb-2 px-4 text-xs font-semibold text-gray-500">
                PROGRAMS
              </div>
              {programs.map((program, index) => (
                <ProgramItem key={index} text={program} />
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
