"use client";

import { useState } from "react";

interface Platform {
  name: string;
  slug: string;
  logo: string;
  type: "stream" | "rent" | "buy";
  quality: string;
  price?: string;
  link: string;
}

export default function PlatformBadge({
  platform,
  size = "md",
}: {
  platform: Platform;
  size?: "sm" | "md" | "lg";
}) {
  const [imgError, setImgError] = useState(false);

  const typeColors = {
    stream: "bg-emerald-500/15 text-emerald-400",
    rent: "bg-blue-500/15 text-blue-400",
    buy: "bg-amber-500/15 text-amber-400",
  };

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  };

  const logoSizes = { sm: 14, md: 18, lg: 24 };

  const hasRealLogo = platform.logo && platform.logo.startsWith("http");

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ${sizeClasses[size]} ${typeColors[platform.type]}`}
    >
      {hasRealLogo && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={platform.logo}
          alt={platform.name}
          width={logoSizes[size]}
          height={logoSizes[size]}
          className="rounded-sm"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-bold">{platform.name[0]}</span>
      )}
      {size !== "sm" && <span>{platform.name}</span>}
    </span>
  );
}
