"use client";

import { useRouter } from "next/navigation";

export default function ServiceError({ error, reset }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Service
        </h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-brand text-white px-4 py-2 rounded"
          >
            Retry
          </button>
          <button
            onClick={() => router.push("/services")}
            className="border border-brand text-brand px-4 py-2 rounded"
          >
            View All Services
          </button>
        </div>
      </div>
    </div>
  );
}
