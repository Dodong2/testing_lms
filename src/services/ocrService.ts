import { apiFetch } from "./apiClient";

export interface OcrResult {
    content: Record<string, number | null>
    materials: Record<string, number | null>
    resource: Record<string, number | null>;
    overall: Record<string, number | null>;
    name: string;
}

export const uploadImageForOcr = async (file: File): Promise<OcrResult> => {
    const formData = new FormData();
    formData.append("file", file);

     const res = await fetch("http://localhost:4000/ocr", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`OCR request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<OcrResult>;
};