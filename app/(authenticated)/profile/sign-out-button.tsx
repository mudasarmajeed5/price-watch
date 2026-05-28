"use client";
import { useState } from "react";
import { LogOut, TriangleAlert, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";

export function SignOutButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 w-9 flex items-center justify-center rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Sign Out"
      >
        <LogOut size={20} />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6"
            onClick={() => !loading && setOpen(false)}
          >
            <div
              className="w-full max-w-[260px] rounded-2xl bg-white overflow-hidden shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Body */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex justify-end mb-1">
                  <button
                    type="button"
                    onClick={() => !loading && setOpen(false)}
                    disabled={loading}
                    className="text-[13px] font-medium text-black disabled:opacity-40 leading-none"
                  >
                    X
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <TriangleAlert size={18} className="text-red-700 shrink-0" />
                  <h2 className="text-[15px] font-bold text-red-800 leading-tight">
                    Sign Out?
                  </h2>
                </div>

                <p className="text-[13px] font-medium text-black leading-snug">
                  Are you sure you want to sign out of your account?
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 px-4 pb-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-gray-400 text-white text-[13px] font-semibold transition-opacity hover:opacity-90 active:scale-[0.97] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-red-700 text-white text-[13px] font-semibold transition-opacity hover:opacity-90 active:scale-[0.97] disabled:opacity-60 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Sign Out"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}