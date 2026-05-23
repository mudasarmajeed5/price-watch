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
              Please enter your details to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1f3f34]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                className="h-11 w-full rounded-lg border border-[#cfe0d8] bg-white px-4 text-sm text-[#0f3d2e] outline-none transition focus:border-[#0f6b4a] focus:ring-2 focus:ring-[#0f6b4a]/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#1f3f34]">
                  Password
                </label>
                <button className="text-xs font-semibold text-[#0f6b4a] hover:text-[#0c5b3f]">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  defaultValue="password"
                  className="h-11 w-full rounded-lg border border-[#cfe0d8] bg-white px-4 pr-10 text-sm text-[#0f3d2e] outline-none transition focus:border-[#0f6b4a] focus:ring-2 focus:ring-[#0f6b4a]/20"
                />
                <Eye className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b8a7e]" />
              </div>
            </div>

            <Button className="h-11 w-full bg-[#0f6b4a] text-white hover:bg-[#0c5b3f]">
              Login
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex w-full items-center gap-3 text-xs text-[#7a9a8c]">
              <span className="h-px flex-1 bg-[#d7e4de]" />
              Or continue with
              <span className="h-px flex-1 bg-[#d7e4de]" />
            </div>

            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="h-11 flex-1 gap-2 border-[#d7e4de] bg-white text-[#0f3d2e] hover:bg-[#eef5f2]"
              >
                <FaGoogle className="h-4 w-4" />
                Google
              </Button>
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
              <Link href={"/signup"} className="font-semibold text-[#0f6b4a] hover:text-[#0c5b3f]">
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
