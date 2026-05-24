"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Mail } from "lucide-react";

export function EmailSignUpForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const res = await signIn("nodemailer", {
      email,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Failed to send signup email. Please try again.");
    } else {
      toast.success("Check your email!", {
        description: "A magic link has been sent to your email address.",
      });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#1f3f34]">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a9a8c]" />
          <input
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            className="h-11 w-full rounded-lg border border-[#cfe0d8] bg-[#f7faf9] pl-10 pr-3 text-sm text-[#0f3d2e] outline-none transition focus:border-[#0f6b4a] focus:ring-2 focus:ring-[#0f6b4a]/20"
          />
        </div>
      </div>

      <label className="flex items-start gap-2 text-xs text-[#5f7f73]">
        <input
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-[#cfe0d8] text-[#0f6b4a]"
        />
        <span>
          I agree to the{" "}
          <button type="button" className="font-semibold text-[#0f6b4a] hover:text-[#0c5b3f]">
            Terms of Service
          </button>{" "}
          and{" "}
          <button type="button" className="font-semibold text-[#0f6b4a] hover:text-[#0c5b3f]">
            Privacy Policy
          </button>
          .
        </span>
      </label>

      <Button disabled={loading} type="submit" className="h-11 w-full bg-[#0f6b4a] text-white hover:bg-[#0c5b3f]">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign up with Email
        {!loading && (
          <span>
            <ArrowRight className="w-4 h-4"/>
          </span>
        )}
      </Button>
    </form>
  );
}
