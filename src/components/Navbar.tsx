import React from 'react';

type TabProps = {
  activeTab: string;
  setActiveTab: (key: string) => void;
  role: "INSTRUCTOR" | "BENEFICIARY" | "ADMIN"
};

const Navbar: React.FC<TabProps> = ({ activeTab, setActiveTab, role }) => {
  const beneficiaryTabs = [
    // for beneficiary
    { title: "Updates", key: "updates" },
    { title: "Assignment", key: "assignments" },
    { title: "Meetings", key: "meetings" },
    { title: "Members", key: "members" },
  ];

  // for instructors
  const instructorTabs = [
    { title: "Updates", key: "updates" },
    { title: "Assignment", key: "assignments" },
    { title: "Meetings", key: "meetings" },
    { title: "EDA", key: "eda" },
    { title: "Evaluation", key: "evaluation" },
    { title: "Attendance", key: "attendance" },
    { title: "Members", key: "members" },
  ]

  // Combine based on role
  const tabs = role === "INSTRUCTOR" ? instructorTabs : beneficiaryTabs

  return (
    <div className="bg-gray-100 flex justify-around text-sm font-medium rounded-b-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`py-2 px-4 relative transition-colors duration-200 cursor-pointer ${activeTab === tab.key ? "text-black" : "text-gray-700 hover:text-black"
            }`}
        >
          {tab.title}
          {activeTab === tab.key && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
          )}
        </button>
      ))}
    </div>
  );
};

export default Navbar
