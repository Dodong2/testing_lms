'use client';

import { useState } from "react";
import { useOcr } from "@/hooks/ocr/useOcr";

export default function OCRPage() {
  const [file, setFile] = useState<File | null>(null);
  const { mutate: runOcr, data, isPending, isError } = useOcr();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    runOcr(file);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">OCR Evaluation Parser</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Run OCR"}
        </button>
      </form>

      {isError && (
        <p className="text-red-500 mt-4">Failed to process OCR. Try again.</p>
      )}

      {data && (
        <pre className="bg-gray-100 mt-6 p-4 rounded text-sm  w-full">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
