"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Eye, Search, PlusIcon, UserCircle } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Watchlist", icon: Eye, href: "/watchlist" },
  { label: "", icon: PlusIcon, href: "/add-product" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Profile", icon: UserCircle, href: "/profile" },
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
          const isFab = label === "";
          if (isFab) {
            return (
              <Link
                key={href}
                href={href}
                aria-label={label || "Add"}
                className={`relative -mt-4 flex items-center justify-center w-12 h-12 rounded-full transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-300 ${isActive ? "bg-emerald-800 text-white shadow-xl" : "bg-emerald-700 text-white shadow-lg"}`}
              >
                <Icon size={24} strokeWidth={1.8} />
              </Link>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${isActive ? "bg-emerald-50 text-emerald-700" : "text-muted-foreground"}`}
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
