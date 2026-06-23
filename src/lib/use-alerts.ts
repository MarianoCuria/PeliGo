"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAlerts,
  getAlertEvents,
  getUnreadEventCount,
  subscribeAlerts,
  type AlertEvent,
  type StoredAlert,
} from "./alerts";

export function useAlerts() {
  const [alerts, setAlerts] = useState<StoredAlert[]>([]);
  const [events, setEvents] = useState<AlertEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const sync = useCallback(() => {
    setAlerts(getAlerts());
    setEvents(getAlertEvents());
    setUnreadCount(getUnreadEventCount());
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      sync();
      setHydrated(true);
    });
    return subscribeAlerts(sync);
  }, [sync]);

  return {
    alerts,
    events,
    unreadCount,
    hydrated,
    activeAlerts: alerts.filter((a) => a.status === "active"),
    refresh: sync,
  };
}
