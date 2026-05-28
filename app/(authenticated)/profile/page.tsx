import { auth } from "@/auth";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";
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

        {/* Settings Dialog */}
        <NotificationSettingsDialog />

        <div className="h-px bg-border/60 my-1" />

        {/* Delete Account */}
        <DeleteAccountButton />
      </div>
    </div>
  );
}
