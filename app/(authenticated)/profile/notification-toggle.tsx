"use client";
import { useState } from "react";
import { ReactNode } from "react";

interface NotificationToggleProps {
  icon: ReactNode;
  label: string;
  description: string;
  settingKey: string;
}

export function NotificationToggle({ icon, label, description, settingKey }: NotificationToggleProps) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-foreground">{label}</p>
        <p className="text-[12px] text-muted-foreground">{description}</p>
      </div>
      {/* Pixel-style toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
          enabled ? "bg-emerald-600" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}