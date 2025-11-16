export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-6 pb-6 border-b">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
