"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallState = "hidden" | "prompt" | "ios";

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function InstallAppButton() {
  const [state, setState] = useState<InstallState>("hidden");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (isIos()) {
      queueMicrotask(() => setState("ios"));
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setState("prompt");
    };
    const onInstalled = () => setState("hidden");

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (state === "hidden") return null;

  const handleClick = async () => {
    if (state === "ios") {
      setShowIosHint((v) => !v);
      return;
    }
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === "accepted") setState("hidden");
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleClick()}
        className="flex items-center justify-between w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Smartphone size={20} className="text-[var(--color-accent)]" />
          <span className="text-sm font-medium text-[var(--color-accent)]">Instalar app</span>
        </div>
        <ChevronRight size={16} className="text-[var(--color-accent)]" />
      </button>
      {showIosHint && (
        <p className="text-xs text-[var(--color-text-secondary)] px-4 pt-2 leading-relaxed">
          En Safari tocá el botón <strong>Compartir</strong> y después{" "}
          <strong>Agregar a inicio</strong>.
        </p>
      )}
    </div>
  );
}
