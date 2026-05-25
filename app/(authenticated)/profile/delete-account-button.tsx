"use client";
import { useState } from "react";
import { Trash2, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000); // auto-reset after 4s
      return;
    }
    setLoading(true);
    // await deleteAccount(); — wire your server action here
    toast.error("Account deletion is irreversible.");
    setLoading(false);
    setConfirming(false);
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="w-full flex items-center gap-4 py-3 text-left group"
    >
      <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
        {loading ? (
          <Loader2 size={17} className="text-red-600 animate-spin" />
        ) : (
          <Trash2 size={17} className="text-red-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-red-600">
          {confirming ? "Tap again to confirm" : "Delete Account"}
        </p>
        <p className="text-[12px] text-muted-foreground">
          {confirming ? "This cannot be undone" : "Permanently remove your data"}
        </p>
      </div>
      {!confirming && <ChevronRight size={16} className="text-muted-foreground/50" />}
    </button>
  );
}