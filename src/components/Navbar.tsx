import React from 'react';

type TabProps = {
  activeTab: string;
  setActiveTab: (key: string) => void;
};

const Navbar: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { title: "Updates", key: "updates" },
    { title: "Files", key: "files" },
    { title: "Instructors", key: "instructors" },
  ];

  return (
    <div className="bg-gray-100 flex justify-around text-sm font-medium rounded-b-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`py-2 px-4 relative transition-colors duration-200 cursor-pointer ${
            activeTab === tab.key ? "text-black" : "text-gray-700 hover:text-black"
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
