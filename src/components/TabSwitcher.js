'use client';

import TabButton from './TabButton';

export default function TabSwitcher({ activeTab, onTabChange, tabs }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          active={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </TabButton>
      ))}
    </div>
  );
}
