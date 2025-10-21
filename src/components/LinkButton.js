export default function LinkButton({ href, children, className = "" }) {
  return (
    <a href={href} className={`text-blue-600 hover:text-blue-800 text-sm font-medium ${className}`}>
      {children}
    </a>
  );
}
