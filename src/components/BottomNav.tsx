"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, Heart, User } from "lucide-react";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/trending", icon: Flame, label: "Tendencias" },
  { href: "/favorites", icon: Heart, label: "Favoritos" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-around h-[60px] px-4">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                isActive
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <tab.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
              />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
