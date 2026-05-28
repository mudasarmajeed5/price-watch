"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function EmailSignInForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    // 🚀 show success immediately (optimistic UX)
    toast.success("Check your email!", {
      description: "We have sent you a magic link.",
    });

    setLoading(false);

    const res = await signIn("nodemailer", {
      email,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Failed to send login email. Please try again.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1f3f34]">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="name@company.com"
          className="h-11 w-full rounded-lg border border-[#cfe0d8] bg-white px-4 text-sm text-[#0f3d2e] outline-none transition focus:border-[#0f6b4a] focus:ring-2 focus:ring-[#0f6b4a]/20"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-[#0f6b4a] text-white hover:bg-[#0c5b3f]"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In with Email
      </Button>
    </form>
  );
}
