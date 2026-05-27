"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer relative inline-flex shrink-0 items-center rounded-full border border-input bg-muted/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 data-[state=checked]:bg-emerald-700 data-[state=unchecked]:bg-slate-200 data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-9 overflow-hidden data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="absolute left-0 top-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[size=sm]:top-0.35 data-[size=sm]:h-4 data-[size=sm]:w-4"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
