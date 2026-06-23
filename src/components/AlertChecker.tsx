"use client";

import { useEffect, useRef } from "react";
import { runAlertChecks } from "@/lib/alert-checker";
import { getActiveAlerts } from "@/lib/alerts";

const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

export default function AlertChecker() {
  const running = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (running.current) return;
      if (getActiveAlerts().length === 0) return;

      running.current = true;
      try {
        await runAlertChecks();
      } finally {
        running.current = false;
      }
    };

    void run();

    const onVisibility = () => {
      if (document.visibilityState === "visible") void run();
    };

    document.addEventListener("visibilitychange", onVisibility);
    const interval = window.setInterval(() => void run(), CHECK_INTERVAL_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
