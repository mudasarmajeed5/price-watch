"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type DialogProps = React.ComponentPropsWithoutRef<"div"> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
  ...props
}: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-[1.25rem] border border-slate-200/80 bg-background/95 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-md",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-description" : undefined}
        onClick={(event) => event.stopPropagation()}
        {...props}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
            {description ? (
              <p
                id="dialog-description"
                className="text-sm text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
