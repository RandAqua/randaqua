'use client';

export default function CenterButton({ isClickable, onClick }) {
  return (
    <div className="wheel-center">
      <div
        className={`wheel-center-inner ${isClickable ? 'clickable' : ''}`}
        onClick={isClickable ? onClick : undefined}
      >
        {/* empty by design */}
      </div>
    </div>
  );
}


