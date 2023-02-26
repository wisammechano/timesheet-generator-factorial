const Tabs = ({ tabs, children, currentTab, onTabChange }) => {
  const tabClassNames = [
    "w-1/3 py-1 mb-2 flex flex-col justify-between items-center border border-solid border-gray-300 cursor-pointer",
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
            onClick={() => onTabChange(idx)}
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
