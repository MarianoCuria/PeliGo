"use client";

import Link from "next/link";
import { User, Tv, Bell, Heart, ChevronRight, Check, MessageCircle } from "lucide-react";
import { PLATFORM_CATALOG, useUserPlatforms } from "@/lib/user-platforms";
import { useAlerts } from "@/lib/use-alerts";
import InstallAppButton from "@/components/InstallAppButton";
import SiteFooter from "@/components/SiteFooter";

// Where "Mandanos sugerencias" points (a form, WhatsApp link, mailto…). Hidden when unset.
const FEEDBACK_URL = process.env.NEXT_PUBLIC_FEEDBACK_URL;

export default function ProfilePage() {
  const { toggle: togglePlatform, isSelected } = useUserPlatforms();
  const { unreadCount } = useAlerts();

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <User size={24} className="text-[var(--color-accent)]" />
        <h1 className="font-[var(--font-display)] text-2xl font-bold">
          Mi Perfil
        </h1>
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
          {PLATFORM_CATALOG.map((p) => {
            const isActive = isSelected(p.slug);
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
        <Link
          href="/alerts"
          className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-[var(--color-text-secondary)]" />
            <span className="text-sm font-medium">Alertas</span>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
            <ChevronRight
              size={16}
              className="text-[var(--color-text-secondary)]"
            />
          </div>
        </Link>

        <Link
          href="/favorites"
          className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-[var(--color-text-secondary)]" />
            <span className="text-sm font-medium">Favoritos</span>
          </div>
          <ChevronRight size={16} className="text-[var(--color-text-secondary)]" />
        </Link>

        {FEEDBACK_URL && (
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="text-[var(--color-text-secondary)]" />
              <span className="text-sm font-medium">Mandanos sugerencias</span>
            </div>
            <ChevronRight size={16} className="text-[var(--color-text-secondary)]" />
          </a>
        )}

        <InstallAppButton />
      </section>

      <SiteFooter />
    </div>
  );
}
