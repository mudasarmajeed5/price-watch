"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function OtpPage() {
  const [value, setValue] = useState("");
  const router = useRouter();

  return (
    <main className="min-h-dvh flex justify-center items-start bg-[#f3f7f5] px-4 text-[#0f3d2e]">
      <div className="w-11/12 max-w-sm">
        <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#0f6b4a]">
          <button
            onClick={() => router.push("/signup")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7e4de] bg-white text-[#0f6b4a] hover:bg-[#f0f0f0] transition"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          Back
        </div>
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#dff2ea] shadow-[0_12px_30px_rgba(15,61,46,0.12)]">
            <Image
              src="/app_logo.svg"
              alt="Bachat"
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold text-[#13261f]">
            OTP Verification
          </h1>
          <p className="mt-2 text-sm text-[#6b8a7e]">
            Enter the 6-digit code sent to your email address to continue.
          </p>
        </div>

        <div className="space-y-5">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            containerClassName="w-full"
          >
            <InputOTPGroup className="w-full justify-between gap-2 rounded-none border-0">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={`otp-slot-${index}`}
                  index={index}
                  className="h-12 w-12 rounded-lg border border-[#cfe0d8] bg-white text-base font-semibold text-[#0f3d2e] shadow-none"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button className="h-11 w-full bg-[#0f6b4a] text-white hover:bg-[#0c5b3f]">
            Verify OTP
          </Button>

          <p className="text-center text-xs text-[#7a9a8c]">
            Didn&apos;t receive the code?{" "}
            <button className="font-semibold text-[#0f6b4a] hover:text-[#0c5b3f]">
              Resend
            </button>
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-[#dfe9e5] bg-[#eef4fb] p-4 text-[#3b5b4f] shadow-[0_10px_24px_rgba(15,61,46,0.08)]">
          <div className="flex items-start gap-3">
            <Info className="h-8 w-8" />

            <div>
              <p className="text-sm font-semibold">Privacy First</p>
              <p className="mt-1 text-xs text-[#5f7f73]">
                Bachat uses end-to-end encryption for all financial verification
                processes to keep your data secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
