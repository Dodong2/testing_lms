"use client";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function ModalFileViewer({ isOpen, onClose, children }: ModalProps) {
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
      <div className="rounded-lg p-4 max-w-7xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
