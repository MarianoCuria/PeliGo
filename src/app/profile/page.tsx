"use client";

import { useState } from "react";
import {
  User,
  Tv,
  Bell,
  Heart,
  Moon,
  Sun,
  Globe,
  Smartphone,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
} from "lucide-react";
import { PLATFORMS_CATALOG } from "@/lib/mock-data";

const MENU_ITEMS = [
  { icon: Bell, label: "Alertas", href: "#", badge: "3" },
  { icon: Heart, label: "Favoritos", href: "/favorites" },
  { icon: HelpCircle, label: "Ayuda", href: "#" },
];

export default function ProfilePage() {
  const [isDark, setIsDark] = useState(true);
  const [userPlatforms, setUserPlatforms] = useState<string[]>([
    "netflix",
    "amazon",
    "disney",
  ]);

  const togglePlatform = (slug: string) => {
    setUserPlatforms((prev) =>
      prev.includes(slug) ? prev.filter((p) => p !== slug) : [...prev, slug]
    );
  };

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <User size={24} className="text-[var(--color-accent)]" />
        <h1 className="font-[var(--font-display)] text-2xl font-bold">
          Mi Perfil
        </h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center mb-3 shadow-lg">
          <span className="text-2xl font-bold text-white font-[var(--font-display)]">
            MR
          </span>
        </div>
        <h2 className="text-lg font-semibold">Martín Rodriguez</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          martin@email.com
        </p>
        <button className="mt-2 px-4 py-1.5 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors">
          Editar perfil
        </button>
      </div>

      {/* My Platforms */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Tv size={18} className="text-[var(--color-secondary)]" />
          <h3 className="font-semibold">Mis plataformas</h3>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mb-3">
          Seleccioná los servicios que tenés para filtrar resultados
        </p>
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS_CATALOG.map((p) => {
            const isActive = userPlatforms.includes(p.slug);
            return (
              <button
                key={p.slug}
                onClick={() => togglePlatform(p.slug)}
                className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                    : "border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-text-secondary)]"
                }`}
              >
                {isActive && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name[0]}
                </div>
                <span className="text-xs text-center line-clamp-1">
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Menu Items */}
      <section className="mb-6 space-y-1">
        {MENU_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
                  {item.badge}
                </span>
              )}
              <ChevronRight
                size={16}
                className="text-[var(--color-text-secondary)]"
              />
            </div>
          </a>
        ))}

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon size={20} className="text-[var(--color-text-secondary)]" />
            ) : (
              <Sun size={20} className="text-[var(--color-text-secondary)]" />
            )}
            <span className="text-sm font-medium">Tema</span>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
              isDark ? "bg-[var(--color-secondary)]" : "bg-[var(--color-bg-tertiary)]"
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-md ${
                isDark ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-[var(--color-text-secondary)]" />
            <span className="text-sm font-medium">Idioma</span>
          </div>
          <span className="text-sm text-[var(--color-text-secondary)]">
            Español 🇦🇷
          </span>
        </div>

        {/* Install PWA */}
        <button className="flex items-center justify-between w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-colors">
          <div className="flex items-center gap-3">
            <Smartphone size={20} className="text-[var(--color-accent)]" />
            <span className="text-sm font-medium text-[var(--color-accent)]">
              Instalar app
            </span>
          </div>
          <ChevronRight size={16} className="text-[var(--color-accent)]" />
        </button>
      </section>

      {/* Logout */}
      <button className="flex items-center gap-3 w-full py-3.5 px-4 rounded-xl hover:bg-[var(--color-error)]/10 transition-colors mb-6">
        <LogOut size={20} className="text-[var(--color-error)]" />
        <span className="text-sm font-medium text-[var(--color-error)]">
          Cerrar sesión
        </span>
      </button>

      {/* Footer */}
      <div className="text-center text-xs text-[var(--color-text-secondary)] pb-4 space-y-1">
        <p>PeliGo v1.0.0</p>
        <p>Hecho con ❤️ en Argentina</p>
      </div>
    </div>
  );
}
