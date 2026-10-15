const PERMISSION_CACHE_KEY = "peligo_notification_permission";

export type NotificationSupport = "supported" | "unsupported";

export function getNotificationSupport(): NotificationSupport {
  if (typeof window === "undefined") return "unsupported";
  return "Notification" in window ? "supported" : "unsupported";
}

export function getPermission(): NotificationPermission | "unsupported" {
  if (getNotificationSupport() === "unsupported") return "unsupported";
  return Notification.permission;
}

function cachePermission(permission: NotificationPermission | "unsupported"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PERMISSION_CACHE_KEY, permission);
  } catch {
    // quota or disabled
  }
}

export async function requestNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (getNotificationSupport() === "unsupported") return "unsupported";
  const result = await Notification.requestPermission();
  cachePermission(result);
  return result;
}

export async function showAlertNotification(params: {
  alertId: string;
  title: string;
  body: string;
  url: string;
}): Promise<void> {
  if (getNotificationSupport() === "unsupported") return;
  if (Notification.permission !== "granted") return;

  const options: NotificationOptions = {
    body: params.body,
    tag: params.alertId,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: params.url },
  };

  // Android Chrome and installed iOS PWAs only allow notifications through a
  // service worker; `new Notification()` throws there.
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) {
      await registration.showNotification(params.title, options);
      return;
    }
  } catch {
    // fall through to the page-level API
  }

  try {
    const notification = new Notification(params.title, options);
    notification.onclick = () => {
      window.focus();
      notification.close();
      window.location.href = params.url;
    };
  } catch {
    // unsupported or blocked
  }
}
