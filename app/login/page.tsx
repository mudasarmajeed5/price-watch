import Image from "next/image";
import { Eye } from "lucide-react";
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
      <div className="flex w-full max-w-sm flex-col items-center">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,61,46,0.12)]">
            <Image
              src="/app_logo.svg"
              alt="Bachat"
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold">Bachat</h1>
        </div>

        <Card className="w-full border border-[#e2ece8] bg-white shadow-[0_18px_48px_rgba(15,61,46,0.12)]">
          <CardHeader className="gap-2">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              {" "}
              Enter your email to sign in with a magic link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EmailSignInForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex w-full items-center gap-3 text-xs text-[#7a9a8c]">
              <span className="h-px flex-1 bg-[#d7e4de]" />
              Or continue with
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

            <p className="text-xs text-[#6b8a7e]">
              Don&apos;t have an account?{" "}
              <Link
                href={"/signup"}
                className="font-semibold text-[#0f6b4a] hover:text-[#0c5b3f]"
              >
                Sign up for free
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Login;
