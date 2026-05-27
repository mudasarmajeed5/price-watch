"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Eye,
  Search,
  PlusIcon,
  UserCircle,
  Heart,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Watchlist", icon: Eye, href: "/watchlist" },
  { label: "", icon: PlusIcon, href: "/add-product" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Profile", icon: UserCircle, href: "/profile" },
];

function LogoHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm px-3 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
            <Image src="/app_logo.svg" alt="Bachat" width={20} height={20} />
          </div>
          <span className="text-lg font-semibold">Bachat</span>
        </div>
        <Link
          href="/favorites"
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-input bg-muted/70 hover:bg-muted transition-colors"
          aria-label="Favorites"
        >
          <Heart size={16} />
        </Link>
      </div>
    </header>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProfile = pathname?.startsWith("/profile");

  return (
    <div className="flex flex-col min-h-screen bg-muted/40 max-w-sm mx-auto relative w-full">
      {!isProfile && <LogoHeader />}
      <div className="flex-1 pb-20 w-full">{children}</div>
      <nav className="fixed bottom-0 bg-white left-1/2 -translate-x-1/2 w-full max-w-sm border-t flex items-center justify-around px-2 py-2 z-10">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname?.startsWith(href));
          const isFab = label === "";

          if (isFab) {
            return (
              <Link
                key={href}
                href={href}
                aria-label="Add"
                className={`relative -mt-4 flex items-center justify-center w-12 h-12 rounded-full transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-xl"
                    : "bg-emerald-700 text-white shadow-lg"
                }`}
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
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-muted-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span
                className={`text-[10px] ${
                  isActive ? "font-semibold" : "font-normal"
                }`}
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