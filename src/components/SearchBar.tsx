"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const PLACEHOLDER_TEXTS = [
  "Breaking Bad...",
  "Dune...",
  "The Last of Us...",
  "Interestelar...",
  "One Piece...",
];

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isFocused) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative flex items-center rounded-xl transition-all duration-200 ${
          isFocused
            ? "bg-[var(--color-bg-tertiary)] ring-2 ring-[var(--color-secondary)] shadow-[0_0_20px_rgba(108,43,217,0.2)]"
            : "bg-[var(--color-bg-secondary)]"
        }`}
      >
        <Search
          size={20}
          className="absolute left-4 text-[var(--color-text-secondary)] pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={`¿Qué querés ver? ${PLACEHOLDER_TEXTS[placeholderIndex]}`}
          className="w-full h-[52px] pl-12 pr-10 bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] text-base outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
