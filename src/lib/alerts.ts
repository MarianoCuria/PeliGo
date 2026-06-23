import type { NormalizedPlatform } from "./tmdb";
import { hasMatchOnUserPlatforms } from "./platform-match";
import { getUserPlatformSlugs } from "./user-platforms";

export const STORAGE_KEY = "peligo_alerts";
export const EVENTS_KEY = "peligo_alert_events";
export const ALERTS_CHANGED_EVENT = "peligo:alerts-changed";
export const MAX_ACTIVE_ALERTS = 3;
export const MAX_EVENTS = 20;

export type AlertStatus = "active" | "triggered";

export interface StoredAlert {
  id: string;
  titleId: string;
  tmdbId: number;
  type: "movie" | "series";
  title: string;
  posterPath: string;
  status: AlertStatus;
  createdAt: number;
  lastCheckedAt?: number;
  lastHadMatchOnUserPlatforms: boolean;
  triggeredAt?: number;
  triggeredPlatformNames?: string[];
  lastNotifiedAt?: number;
}

export interface AlertEvent {
  id: string;
  alertId: string;
  titleId: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
}

function notifyChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ALERTS_CHANGED_EVENT));
}

function readAlerts(): StoredAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredAlert[]) : [];
  } catch {
    return [];
  }
}

function writeAlerts(alerts: StoredAlert[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    notifyChange();
  } catch {
    // quota or disabled
  }
}

function readEvents(): AlertEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as AlertEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: AlertEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
    notifyChange();
  } catch {
    // quota or disabled
  }
}

export function getAlerts(): StoredAlert[] {
  return readAlerts();
}

export function getActiveAlerts(): StoredAlert[] {
  return readAlerts().filter((a) => a.status === "active");
}

export function getAlertByTitleId(titleId: string): StoredAlert | undefined {
  return readAlerts().find((a) => a.titleId === titleId);
}

export function canCreateAlert(
  titleId: string,
  platforms: NormalizedPlatform[],
  userSlugs?: string[]
): { ok: boolean; reason?: string } {
  const slugs = userSlugs ?? getUserPlatformSlugs();

  if (slugs.length === 0) {
    return { ok: false, reason: "no_platforms" };
  }

  if (hasMatchOnUserPlatforms(platforms, slugs)) {
    return { ok: false, reason: "already_available" };
  }

  if (getAlertByTitleId(titleId)) {
    return { ok: false, reason: "duplicate" };
  }

  const activeCount = getActiveAlerts().length;
  if (activeCount >= MAX_ACTIVE_ALERTS) {
    return { ok: false, reason: "limit" };
  }

  return { ok: true };
}

export type CreateAlertInput = {
  titleId: string;
  tmdbId: number;
  type: "movie" | "series";
  title: string;
  posterPath: string;
  platforms: NormalizedPlatform[];
  lastHadMatchOnUserPlatforms: boolean;
};

export function createAlert(input: CreateAlertInput): StoredAlert | null {
  const check = canCreateAlert(input.titleId, input.platforms);
  if (!check.ok) return null;

  const alert: StoredAlert = {
    id: `alert-${input.titleId}`,
    titleId: input.titleId,
    tmdbId: input.tmdbId,
    type: input.type,
    title: input.title,
    posterPath: input.posterPath,
    status: "active",
    createdAt: Date.now(),
    lastHadMatchOnUserPlatforms: input.lastHadMatchOnUserPlatforms,
  };

  const alerts = readAlerts();
  alerts.unshift(alert);
  writeAlerts(alerts);
  return alert;
}

export function deleteAlert(id: string): void {
  writeAlerts(readAlerts().filter((a) => a.id !== id));
}

export function updateAlert(id: string, patch: Partial<StoredAlert>): void {
  const alerts = readAlerts();
  const idx = alerts.findIndex((a) => a.id === id);
  if (idx === -1) return;
  alerts[idx] = { ...alerts[idx], ...patch };
  writeAlerts(alerts);
}

export function getAlertEvents(): AlertEvent[] {
  return readEvents();
}

export function addAlertEvent(event: Omit<AlertEvent, "id" | "read">): void {
  const events = readEvents();
  events.unshift({
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    read: false,
  });
  writeEvents(events);
}

export function markEventRead(id: string): void {
  const events = readEvents().map((e) =>
    e.id === id ? { ...e, read: true } : e
  );
  writeEvents(events);
}

export function markAllEventsRead(): void {
  const events = readEvents().map((e) => ({ ...e, read: true }));
  writeEvents(events);
}

export function getUnreadEventCount(): number {
  return readEvents().filter((e) => !e.read).length;
}

export function subscribeAlerts(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onCustom = () => listener();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === EVENTS_KEY) listener();
  };

  window.addEventListener(ALERTS_CHANGED_EVENT, onCustom);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(ALERTS_CHANGED_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
