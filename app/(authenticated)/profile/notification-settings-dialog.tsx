"use client";
import { useState } from "react";
import { Bell, ChevronRight, X, Smartphone, Mail, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type Setting = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const SETTINGS: Setting[] = [
  {
    id: "push",
    label: "Push Notifications",
    description: "Receive instant alerts on your device.",
    icon: <Smartphone size={15} />,
  },
  {
    id: "email",
    label: "Email Notifications",
    description: "Get updates and summaries by email.",
    icon: <Mail size={15} />,
  },
  {
    id: "inapp",
    label: "In-App Alerts",
    description: "Show banners inside the application.",
    icon: <BellRing size={15} />,
  },
];

export function NotificationSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    push: true,
    email: true,
    inapp: false,
  });
  const [saved, setSaved] = useState({ ...prefs });

  const handleSave = () => {
    setSaved({ ...prefs });
    setOpen(false);
  };

  const handleCancel = () => {
    setPrefs({ ...saved });
    setOpen(false);
  };

  return (
    <>
      {/* Trigger — plain button */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(true)}
        className="w-full justify-start gap-4 h-auto py-3 px-0 rounded-none"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <Bell size={17} className="text-foreground" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[15px] font-medium text-foreground">
            Notification Settings
          </p>
        </div>
        <ChevronRight size={16} className="text-muted-foreground/50" />
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35"
          onClick={(e) => e.target === e.currentTarget && handleCancel()}
        >
          <Card className="w-[340px] overflow-hidden rounded-2xl p-0 animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header */}
            <CardHeader className="flex flex-row items-start gap-3 border-b border-border/40 px-5 py-[18px] space-y-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-border/50 bg-muted">
                <Bell size={15} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-[15px] font-medium">
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-[12px]">
                  Choose how you'd like to be notified.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="h-7 w-7 rounded-full border border-border/50 text-muted-foreground"
              >
                <X size={13} />
              </Button>
            </CardHeader>

            {/* Rows */}
            <CardContent className="p-0">
              {SETTINGS.map((s, i) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 px-5 py-[14px] transition-colors hover:bg-muted/40 ${
                    i !== 0 ? "border-t border-border/40" : ""
                  }`}
                >
                  <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted text-muted-foreground">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={s.id}
                      className="block text-[13.5px] font-medium text-foreground cursor-pointer"
                    >
                      {s.label}
                    </label>
                    <span className="text-[11.5px] text-muted-foreground">
                      {s.description}
                    </span>
                  </div>
                  <Switch
                    id={s.id}
                    checked={prefs[s.id]}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, [s.id]: v }))}
                  />
                </div>
              ))}
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex gap-2 border-t border-border/40 px-5 py-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 text-[13px]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="flex-1 text-[13px]"
              >
                Save preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}