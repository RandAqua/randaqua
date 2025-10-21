'use client';

export default function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium tab-button ${
        active ? 'active' : ''
      }`}
    >
      {children}
    </button>
  );
}
