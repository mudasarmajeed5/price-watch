import Image from "next/image";
import { ArrowLeft, ArrowRight, Eye, Lock, Mail, User } from "lucide-react";
import { FaApple, FaGoogle } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { signIn } from "@/auth";
import { EmailSignUpForm } from "@/components/email-signup-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f3f7f5] px-4 py-8 text-[#0f3d2e]">
      <div className="w-full max-w-sm">
     

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
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#f59e0b] text-[10px] font-semibold text-white shadow-[0_6px_12px_rgba(245,158,11,0.4)]">
              %
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-[#13261f]">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-[#6b8a7e]">
            Join Bachat and start your journey towards intelligent financial
            savings.
          </p>
        </div>

        <Card className="w-full border border-[#e2ece8] bg-white shadow-[0_18px_48px_rgba(15,61,46,0.12)]">
          <CardHeader className="pb-0">
            <CardTitle className="text-base"> </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EmailSignUpForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-0">
            <div className="flex w-full items-center gap-3 text-[11px] text-[#7a9a8c]">
              <span className="h-px flex-1 bg-[#d7e4de]" />
              OR CONTINUE WITH
              <span className="h-px flex-1 bg-[#d7e4de]" />
            </div>

            <div className="flex w-full gap-3">
              <form
                className="flex-1"
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <Button
                  variant="outline"
                  type="submit"
                  className="h-11 w-full gap-2 border-[#d7e4de] bg-white text-[#0f3d2e] hover:bg-[#eef5f2]"
                >
                  <FaGoogle className="h-4 w-4" />
                  Google
                </Button>
              </form>
              <Button
                variant="outline"
                className="h-11 flex-1 gap-2 border-[#d7e4de] bg-white text-[#0f3d2e] hover:bg-[#eef5f2]"
              >
                <FaApple className="h-4 w-4" />
                Apple
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-[#6b8a7e]">
          Already have an account?{" "}
          <Link href={"/login"} className="font-semibold text-[#0f6b4a] hover:text-[#0c5b3f]">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
