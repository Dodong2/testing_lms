import React, { useState, useRef } from 'react';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

type TabProps = {
  activeTab: string;
  setActiveTab: (key: string) => void;
  role: "INSTRUCTOR" | "BENEFICIARY" | "ADMIN"
};

const Navbar: React.FC<TabProps> = ({ activeTab, setActiveTab, role }) => {
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const beneficiaryTabs = [
    { title: "Updates", key: "updates" },
    { title: "Assignment", key: "assignments" },
    { title: "Meetings", key: "meetings" },
    { title: "Members", key: "members" },
  ];

  const instructorTabs = [
    { title: "Updates", key: "updates" },
    { title: "Assignment", key: "assignments" },
    { title: "Meetings", key: "meetings" },
    { title: "EDA", key: "eda" },
    { title: "Evaluation", key: "evaluation" },
    { title: "Members", key: "members" },
  ];

  const adminTabs = [
    { title: "Updates", key: "updates" },
    { title: "EDA", key: "eda" },
    { title: "Evaluation", key: "evaluation" },
  ];

  {/* for filter role tabs */}
  const tabs = role === "ADMIN" ? adminTabs : role === 'INSTRUCTOR' ? instructorTabs : beneficiaryTabs;

  {/* scroll when mobile view for tabs */}
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowRightIndicator(scrollLeft + clientWidth < scrollWidth - 5);
      setShowLeftIndicator(scrollLeft > 5);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleRef = (el: HTMLDivElement | null) => {
    scrollContainerRef.current = el;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const shouldShowRight = scrollLeft + clientWidth < scrollWidth - 5;
      const shouldShowLeft = scrollLeft > 5;
      if (shouldShowRight !== showRightIndicator) {
        setShowRightIndicator(shouldShowRight);
      }
      if (shouldShowLeft !== showLeftIndicator) {
        setShowLeftIndicator(shouldShowLeft);
      }
    }
  };

  return (
    <div className="relative">
      <div ref={handleRef} onScroll={checkScroll}
        className="bg-[#525252] flex justify-around text-sm font-medium rounded-b-sm overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
        style={{WebkitOverflowScrolling: 'touch',}}>

        {/* main tabs */}
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-2 px-4 relative transition-colors duration-200 cursor-pointer whitespace-nowrap ${activeTab === tab.key ? "text-amber-400" : "text-white hover:text-amber-400"
              }`}
          >
            {tab.title}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />
            )}
          </button>
        ))}
      </div>
      
      {/* scroll when mobile view for tabs */}
      {showLeftIndicator && (
        <div onClick={scrollLeft} className="absolute left-0 top-0 bottom-0 flex items-center cursor-pointer bg-gradient-to-r from-[#525252] via-[#525252]/80 to-transparent pr-8 pl-2 hover:from-[#5a5a5a]">
          <FaArrowLeft className="text-amber-400 animate-pulse" size={20} />
        </div>
      )}

      {showRightIndicator && (
        <div onClick={scrollRight} className="absolute right-0 top-0 bottom-0 flex items-center cursor-pointer bg-gradient-to-l from-[#525252] via-[#525252]/80 to-transparent pl-8 pr-2 hover:from-[#5a5a5a]">
          <FaArrowRight className="text-amber-400 animate-pulse" size={20} />
        </div>
      )}
    </div>
  );
};

export default Navbar;