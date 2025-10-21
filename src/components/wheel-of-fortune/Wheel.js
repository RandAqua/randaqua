'use client';

export default function Wheel({ rotation, children }) {
  return (
    <div
      className="wheel"
      style={{
        transform: `rotate(${rotation}deg)`,
        background:
          'repeating-conic-gradient(from -90deg, #fbbf24 0deg 45deg, #ffffff 45deg 90deg)',
        transition: 'none'
      }}
    >
      {children}
    </div>
  );
}


