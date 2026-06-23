"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getUserPlatformSlugs,
  subscribeUserPlatforms,
  toggleUserPlatform,
} from "./user-platforms";

export function useUserPlatforms() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setSlugs(getUserPlatformSlugs());
    queueMicrotask(() => {
      sync();
      setHydrated(true);
    });
    return subscribeUserPlatforms(sync);
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugs(toggleUserPlatform(slug));
  }, []);

  const isSelected = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  return {
    slugs,
    hydrated,
    hasSelection: slugs.length > 0,
    toggle,
    isSelected,
  };
}
