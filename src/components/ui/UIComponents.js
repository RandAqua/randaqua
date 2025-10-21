'use client';

// Help Link Component
export function HelpLink() {
  return (
    <div className="text-center">
      <a href="#" className="text-gray-600 hover:text-gray-800 text-sm font-medium" style={{ color: '#4b5563' }}>
        Нужна помощь?
      </a>
    </div>
  );
}

// Link Button Component
export function LinkButton({ href, children, className = "" }) {
  return (
    <a href={href} className={`text-blue-600 hover:text-blue-800 text-sm font-semibold ${className}`} style={{ color: '#2563eb' }}>
      {children}
    </a>
  );
}

// Form Container Component
export function FormContainer({ title, children }) {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-lg form-container p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4 sm:mb-6" style={{ color: '#111827' }}>{title}</h1>
        {children}
      </div>
    </div>
  );
}

// Primary Button Component
export function PrimaryButton({ children, type = "button", onClick, className = "", disabled = false, isLoading = false }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full primary-button py-4 rounded-lg font-semibold text-lg text-white transition-all duration-200 ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:-translate-y-1 hover:shadow-lg'} ${className}`}
      style={{ 
        backgroundColor: disabled || isLoading ? '#9ca3af' : '#0ea5e9',
        color: '#ffffff'
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Загрузка...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Tab Button Component
export function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold tab-button ${
        active ? 'active text-white' : 'text-gray-600'
      }`}
      style={{ 
        color: active ? '#ffffff' : '#4b5563',
        backgroundColor: active ? '#0ea5e9' : 'transparent'
      }}
    >
      {children}
    </button>
  );
}
