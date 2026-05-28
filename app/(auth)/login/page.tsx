import { FaApple, FaGoogle } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { signIn } from "@/auth";
import { EmailSignInForm } from "@/components/email-signin-form";

const Login = () => {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f3f7f5] px-4 text-[#0f3d2e]">
      <Card className="w-full max-w-sm border border-[#e2ece8] bg-white shadow-[0_18px_48px_rgba(15,61,46,0.12)]">
        {/* HEADER */}
        <CardHeader className="flex flex-col items-center gap-3 pt-8">
          {/* LOGO INSIDE CARD */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-[0_12px_30px_rgba(15,61,46,0.12)]">
            <svg
              width="38"
              height="36"
              viewBox="0 0 38 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 36C2.9 36 1.95833 35.6083 1.175 34.825C0.391667 34.0417 0 33.1 0 32V4C0 2.9 0.391667 1.95833 1.175 1.175C1.95833 0.391667 2.9 0 4 0H32C33.1 0 34.0417 0.391667 34.825 1.175C35.6083 1.95833 36 2.9 36 4H20C17.6333 4 15.7083 4.74167 14.225 6.225C12.7417 7.70833 12 9.63333 12 12V24C12 26.3667 12.7417 28.2917 14.225 29.775C15.7083 31.2583 17.6333 32 20 32H36C36 33.1 35.6083 34.0417 34.825 34.825C34.0417 35.6083 33.1 36 32 36H4ZM20 28C18.9 28 17.9583 27.6083 17.175 26.825C16.3917 26.0417 16 25.1 16 24V12C16 10.9 16.3917 9.95833 17.175 9.175C17.9583 8.39167 18.9 8 20 8H34C35.1 8 36.0417 8.39167 36.825 9.175C37.6083 9.95833 38 10.9 38 12V24C38 25.1 37.6083 26.0417 36.825 26.825C36.0417 27.6083 35.1 28 34 28H20ZM26 21C26.8667 21 27.5833 20.7167 28.15 20.15C28.7167 19.5833 29 18.8667 29 18C29 17.1333 28.7167 16.4167 28.15 15.85C27.5833 15.2833 26.8667 15 26 15C25.1333 15 24.4167 15.2833 23.85 15.85C23.2833 16.4167 23 17.1333 23 18C23 18.8667 23.2833 19.5833 23.85 20.15C24.4167 20.7167 25.1333 21 26 21Z"
                fill="#006C49"
              />
            </svg>
          </div>

          <CardTitle className="text-xl">Continue with email</CardTitle>

          <CardDescription className="text-center text-sm">
            We’ll send you a secure magic link to sign in or create your account
            instantly.
          </CardDescription>

        </CardHeader>

        {/* EMAIL FORM */}
        <CardContent className="space-y-4">
          <EmailSignInForm />
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="flex flex-col gap-4">
          {/* DIVIDER */}
          <div className="flex w-full items-center gap-3 text-xs text-[#7a9a8c]">
            <span className="h-px flex-1 bg-[#d7e4de]" />
            or continue with
            <span className="h-px flex-1 bg-[#d7e4de]" />
          </div>

          {/* OAUTH */}
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
    </main>
  );
};

export default Login;
