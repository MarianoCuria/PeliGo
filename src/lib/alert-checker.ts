import { fetchTitle } from "./api";
import {
  addAlertEvent,
  getActiveAlerts,
  updateAlert,
  type StoredAlert,
} from "./alerts";
import { hasMatchOnUserPlatforms, partitionPlatforms } from "./platform-match";
import { showAlertNotification } from "./notifications";
import { getUserPlatformSlugs } from "./user-platforms";

export interface CheckResult {
  alertId: string;
  triggered: boolean;
  error?: string;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function checkSingleAlert(
  alert: StoredAlert,
  userSlugs: string[]
): Promise<CheckResult> {
  if (userSlugs.length === 0) {
    return { alertId: alert.id, triggered: false };
  }

  try {
    const { title } = await fetchTitle(alert.tmdbId, alert.type);
    const nowMatch = hasMatchOnUserPlatforms(title.platforms, userSlugs);
    const now = Date.now();

    if (!alert.lastHadMatchOnUserPlatforms && nowMatch) {
      const { mine } = partitionPlatforms(title.platforms, userSlugs);
      const platformNames = mine.map((p) => p.name);
      const message =
        platformNames.length > 0
          ? `Ya está en ${platformNames.join(", ")}`
          : "Ya está en tus plataformas";

      updateAlert(alert.id, {
        status: "triggered",
        triggeredAt: now,
        triggeredPlatformNames: platformNames,
        lastHadMatchOnUserPlatforms: true,
        lastCheckedAt: now,
      });

      addAlertEvent({
        alertId: alert.id,
        titleId: alert.titleId,
        title: alert.title,
        message,
        createdAt: now,
      });

      showAlertNotification({
        alertId: alert.id,
        title: alert.title,
        body: `${message} en tus plataformas.`,
        url: `/title/${alert.titleId}`,
      });

      updateAlert(alert.id, { lastNotifiedAt: now });

      return { alertId: alert.id, triggered: true };
    }

    updateAlert(alert.id, {
      lastHadMatchOnUserPlatforms: nowMatch,
      lastCheckedAt: now,
    });

    return { alertId: alert.id, triggered: false };
  } catch (e) {
    const message = e instanceof Error ? e.message : "check failed";
    if (process.env.NODE_ENV === "development") {
      console.warn(`[alert-checker] ${alert.id}:`, message);
    }
    return { alertId: alert.id, triggered: false, error: message };
  }
}

export async function runAlertChecks(options?: {
  maxAlerts?: number;
  delayMs?: number;
}): Promise<CheckResult[]> {
  const maxAlerts = options?.maxAlerts ?? 5;
  const delayMs = options?.delayMs ?? 300;
  const userSlugs = getUserPlatformSlugs();

  if (userSlugs.length === 0) return [];

  const active = getActiveAlerts()
    .sort((a, b) => (a.lastCheckedAt ?? 0) - (b.lastCheckedAt ?? 0))
    .slice(0, maxAlerts);

  const results: CheckResult[] = [];

  for (let i = 0; i < active.length; i++) {
    if (i > 0) await delay(delayMs);
    results.push(await checkSingleAlert(active[i], userSlugs));
  }

  return results;
}
