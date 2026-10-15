"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { GENERIC_ERROR_MESSAGE } from "@/lib/messages";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">{GENERIC_ERROR_MESSAGE}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-semibold"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
