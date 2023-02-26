import React, { useState } from "react";

const Tabs = ({ tabs, children, defaultTab }) => {
  const [currentTab, setTab] = useState(defaultTab || 0);

  const tabClassNames = [
    "w-1/3 py-1 mb-2 flex flex-col justify-between items-center border border-solid border-gray-300",
    "border-l-0 first:border-l bg-gray-200",
  ].join(" ");
  const activeTabClassNames = [
    "border-t-factorial border-t-2 border-b-0 !bg-white text-factorial fill-factorial",
  ];

  return (
    <div>
      <div className="flex">
        {tabs.map((tab, idx) => (
          <div
            role="tab"
            aria-selected={currentTab === idx}
            key={tab.name}
            onClick={() => setTab(idx)}
            className={`${tabClassNames} ${
              currentTab === idx && activeTabClassNames
            }`}
          >
            <div>{tab.icon}</div>
            <div>{tab.name}</div>
          </div>
        ))}
      </div>
      {children[currentTab]}
    </div>
  );
};

export default Tabs;
