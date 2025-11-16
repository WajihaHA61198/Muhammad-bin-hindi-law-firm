import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Service Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The service you're looking for doesn't exist.
        </p>
        <Link
          href="/services"
          className="inline-block bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand/90 transition-colors"
        >
          View All Services
        </Link>
      </div>
    </div>
  );
}