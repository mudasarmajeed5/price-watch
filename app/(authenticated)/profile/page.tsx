import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-4 px-5 pt-6 pb-20">
      <h1 className="text-xl font-bold">Profile</h1>

      <Card className="rounded-xl border shadow-none">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={24} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {session?.user?.email || "No email provided"}
            </p>
          </div>
        </CardContent>
      </Card>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
        className="mt-6"
      >
        <Button
          type="submit"
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300 flex items-center justify-center gap-2 h-12 rounded-xl"
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </form>
    </div>
  );
}
