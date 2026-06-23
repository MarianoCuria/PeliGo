"use client";

import Link from "next/link";
import { Bell, Trash2, Search, AlertCircle } from "lucide-react";
import PosterImage from "@/components/PosterImage";
import {
  deleteAlert,
  markEventRead,
} from "@/lib/alerts";
import { useAlerts } from "@/lib/use-alerts";
import {
  getNotificationSupport,
  getPermission,
} from "@/lib/notifications";

export default function AlertsPage() {
  const { alerts, events, hydrated, refresh } = useAlerts();
  const unreadEvents = events.filter((e) => !e.read);
  const support = getNotificationSupport();
  const permission = getPermission();
  const showPermissionBanner =
    support === "unsupported" || permission === "denied";

  const handleDelete = (id: string) => {
    deleteAlert(id);
    refresh();
  };

  const handleMarkRead = (id: string) => {
    markEventRead(id);
    refresh();
  };

  if (!hydrated) {
    return (
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell size={24} className="text-[var(--color-accent)]" />
          <h1 className="font-[var(--font-display)] text-2xl font-bold">
            Mis alertas
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell size={24} className="text-[var(--color-accent)]" />
        <h1 className="font-[var(--font-display)] text-2xl font-bold">
          Mis alertas
        </h1>
      </div>

      {showPermissionBanner && (
        <div className="mb-6 flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <AlertCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            {support === "unsupported" ? (
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Tu navegador no soporta notificaciones del sistema. Te avisamos
                acá dentro de la app cuando un título llegue a tus plataformas.
              </p>
            ) : (
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Tenés las notificaciones desactivadas. Las alertas siguen
                guardadas y vas a ver los avisos acá cuando un título esté
                disponible en tus plataformas.
              </p>
            )}
          </div>
        </div>
      )}

      {unreadEvents.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--color-accent)] mb-3">
            Avisos recientes
          </h2>
          <div className="space-y-2">
            {unreadEvents.map((event) => (
              <Link
                key={event.id}
                href={`/title/${event.titleId}`}
                onClick={() => handleMarkRead(event.id)}
                className="block p-4 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-colors"
              >
                <p className="font-semibold text-sm">{event.title}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {event.message}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
          Mis alertas
        </h2>

        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex gap-3 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
              >
                <Link href={`/title/${alert.titleId}`} className="shrink-0">
                  <PosterImage
                    src={alert.posterPath}
                    alt={alert.title}
                    className="w-14 h-20 rounded-lg object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/title/${alert.titleId}`}>
                    <p className="font-semibold text-sm truncate">{alert.title}</p>
                  </Link>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                      alert.status === "triggered"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]"
                    }`}
                  >
                    {alert.status === "triggered"
                      ? alert.triggeredPlatformNames?.length
                        ? `Disponible en ${alert.triggeredPlatformNames.join(", ")}`
                        : "Disponible"
                      : "Esperando"}
                  </span>
                  {alert.status === "active" && (
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Te avisamos cuando esté en tus plataformas
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(alert.id)}
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] transition-colors"
                  aria-label="Eliminar alerta"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mb-4">
              <Bell size={32} className="text-[var(--color-text-secondary)]" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No tenés alertas activas</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 max-w-xs">
              Cuando un título no esté en tus plataformas, podés pedir que te
              avisemos desde su ficha.
            </p>
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              <Search size={16} />
              Buscar títulos
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
