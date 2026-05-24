"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Eye, Search, BarChart2, User } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Watchlist", icon: Eye, href: "/watchlist" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Analytics", icon: BarChart2, href: "/analytics" },
  { label: "Profile", icon: User, href: "/profile" },
];

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-muted/40 max-w-sm mx-auto relative">
      <div className="flex-1 pb-20">{children}</div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-background border-t flex items-center justify-around px-2 py-2 z-10">
        {navItems.map(({ label, icon: Icon, href }) => {
          // A simple active checker based on pathname
          const isActive =
            pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-muted-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span
                className={`text-[10px] ${isActive ? "font-semibold" : "font-normal"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
