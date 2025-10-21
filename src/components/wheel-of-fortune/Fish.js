'use client';

export default function Fish({ show, swimming, fishTopPx, onEnd }) {
  if (!show) return null;
  return (
    <div
      className={`fish-spinner ${swimming ? 'fish-swimming' : ''}`}
      style={{ '--fish-top': fishTopPx != null ? `${fishTopPx}px` : undefined }}
      onAnimationEnd={onEnd}
    >
      <img
        src="/BackgroundEraser_20251021_194530773.png"
        alt="Clownfish"
        draggable={false}
        style={{ width: '160px', height: 'auto', display: 'block', opacity: 0.7 }}
      />
    </div>
  );
}


