export default function PrimaryButton({ children, type = "button", onClick, className = "", disabled = false }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full primary-button py-4 rounded-lg font-medium text-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
