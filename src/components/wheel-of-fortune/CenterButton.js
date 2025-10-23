'use client';

export default function CenterButton({ isClickable, onClick }) {
  return (
    <div className="wheel-center">
      <div
        className={`wheel-center-inner ${isClickable ? 'clickable' : ''}`}
        onClick={isClickable ? onClick : undefined}
      >
        {/* пусто по дизайну */}
      </div>
    </div>
  );
}



