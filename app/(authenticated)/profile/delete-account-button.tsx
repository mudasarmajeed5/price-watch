"use client";
import { useState } from "react";
import { Trash2, ChevronRight, TriangleAlert } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { deleteAccount } from "./actions";
import { Button } from "@/components/ui/button";

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteAccount();
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Account deleted successfully.");
      await signOut({ callbackUrl: "/login" });
    } catch {
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(true)}
        className="w-full justify-start gap-4 h-auto py-3 px-0 rounded-none"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
          <Trash2 size={17} className="text-red-600" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[15px] font-medium text-red-600">Delete Account</p>
          <p className="text-[12px] text-muted-foreground">
            Permanently remove your data
          </p>
        </div>
        <ChevronRight size={16} className="text-muted-foreground/50" />
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6"
          onClick={(e) =>
            !loading && e.target === e.currentTarget && setOpen(false)
          }
        >
          <div className="w-full max-w-[260px] rounded-2xl bg-white overflow-hidden shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Body */}
            <div className="px-4 pt-4 pb-3">
              {/* Close */}
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

              {/* Title row */}
              <div className="flex items-center gap-2 mb-2">
                <TriangleAlert size={18} className="text-red-700 shrink-0" />
                <h2 className="text-[15px] font-bold text-red-800 leading-tight">
                  Delete Account?
                </h2>
              </div>

              {/* Description */}
              <p className="text-[13px] font-medium text-black leading-snug">
                This action is permanent and cannot be undone.
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
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-2 rounded-xl bg-red-700 text-white text-[13px] font-semibold transition-opacity hover:opacity-90 active:scale-[0.97] disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}