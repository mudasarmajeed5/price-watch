import { auth } from "@/auth";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CirclePlay, ChevronRight } from "lucide-react";
import { DeleteAccountButton } from "./delete-account-button";
import { SignOutButton } from "./sign-out-button";
import { NotificationSettingsDialog } from "./notification-settings-dialog";

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
          <SignOutButton />
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

        <Link
          href="/onboarding/tutorial"
          className="w-full justify-start gap-4 h-auto py-3 px-0 rounded-none inline-flex items-center"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <CirclePlay size={17} className="text-foreground" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[15px] font-medium text-foreground">
              Watch Tutorial
            </p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground/50" />
        </Link>

        <div className="h-px bg-border/60 my-1" />

        {/* Settings Dialog */}
        <NotificationSettingsDialog />

        <div className="h-px bg-border/60 my-1" />

        {/* Delete Account */}
        <DeleteAccountButton />
      </div>
    </div>
  );
}
