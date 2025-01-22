import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: String }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <p className="text-4xl font-bold mb-4">User ID: {id}</p>
    </div>
  );
}
