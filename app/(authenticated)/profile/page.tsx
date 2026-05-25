import { auth, signOut } from "@/auth";
import {
  LogOut,
  Bell,
  BellOff,
  Trash2,
  ChevronRight,
  Settings,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";
import { DeleteAccountButton } from "./delete-account-button";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 relative">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <h1 className="text-[22px] font-semibold tracking-tight">Profile</h1>
        <div className="flex items-center gap-2">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="h-9 w-9 flex items-center justify-center rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Avatar + form */}
      <ProfileForm user={session.user} />

      {/* Divider */}
      <div className="h-px bg-border mx-5 my-6" />

      {/* Account actions */}
      <div className="px-5 space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Account
        </p>

        {/* Settings Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-4 py-3 text-left group">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0 group-active:bg-muted/70 transition-colors">
                <Settings size={17} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-foreground">
                  Notification Settings
                </p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground/50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 rounded-xl p-0 overflow-hidden"
            align="end"
            sideOffset={10}
          >
            <div className="bg-muted/50 px-4 py-3 border-b">
              <h4 className="font-semibold text-sm">Notification Settings</h4>
              <p className="text-xs text-muted-foreground">
                Choose what updates you want to receive.
              </p>
            </div>
            <div className="p-4 flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">
                    Price Drop Alerts
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Get notified when wishlist items drop in price.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">
                    Weekly Deal Digs
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Receive a weekly summary of the best tech deals.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">
                    New Feature Updates
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Stay in the loop with platform improvements.
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-px bg-border/60 my-1" />

        {/* Delete Account */}
        <DeleteAccountButton />
      </div>
    </div>
  );
}
