"use client";
import { TriangleAlert, X, CheckCircle } from "lucide-react";

type Props = {
  title: string;
  description: string;
  onClose: () => void;
};

export function MissingInfoModal({ title, description, onClose }: Props) {
  const isSuccess = title?.toLowerCase().includes("success");

  return (
    <div className="fixed inset-0  z-9999 flex items-center justify-center bg-black/50 backdrop-blur-[5px]">
      <div className="w-4/5 mx-auto rounded-2xl bg-white p-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle className="size-5 text-emerald-700" />
            ) : (
              <TriangleAlert className="size-5 text-red-600" />
            )}
            <p
              className={`text-sm font-bold ${isSuccess ? "text-emerald-700" : "text-red-600"}`}
            >
              {title}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-snug mb-5">{description}</p>

        {/* OK Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={onClose}
            className={`w-3/5 mt-3 h-10 rounded-lg text-sm font-semibold text-white ${isSuccess ? "bg-emerald-700 hover:bg-emerald-800" : "bg-emerald-700 hover:bg-emerald-800"}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
