"use client";

import { useState } from "react";
import { Film } from "lucide-react";

export default function PosterImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--color-bg-tertiary)] ${className}`}
      >
        <Film size={32} className="text-[var(--color-text-secondary)]" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
