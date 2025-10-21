export default function FormContainer({ title, children }) {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg form-container p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">{title}</h1>
        {children}
      </div>
    </div>
  );
}
