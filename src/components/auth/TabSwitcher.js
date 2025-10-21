'use client';

import { TabButton } from '../ui/UIComponents';

export default function TabSwitcher({ activeTab, onTabChange, tabs }) {
  return (
    <div className="flex bg-gray-200 rounded-lg p-1 mb-6" style={{ backgroundColor: '#e5e7eb' }}>
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
