# Contract: User platforms storage (client)

**Version**: 1.0.0  
**Consumers**: `profile/page`, `TitleDetailClient`, `search/page`, any future client UI

## Storage

| Property | Value |
|----------|--------|
| Key | `peligo_user_platforms` |
| Format | JSON array of strings |
| Example | `["netflix","disney","amazon"]` |
| Empty | `[]` or missing key → no personalization |

## API surface (`src/src/lib/user-platforms.ts`)

```typescript
/** All valid catalog slugs */
export const PLATFORM_CATALOG: readonly PlatformCatalogEntry[];

export function getUserPlatformSlugs(): string[];

export function setUserPlatformSlugs(slugs: string[]): void;

export function toggleUserPlatform(slug: string): string[];

export function subscribeUserPlatforms(listener: () => void): () => void;
```

## Invariants

1. `setUserPlatformSlugs` MUST filter to catalog slugs only.
2. MUST NOT throw on `localStorage` disabled — noop read, noop write.
3. After successful write, MUST dispatch `window` event `peligo:user-platforms-changed`.
4. MUST be safe to call from SSR (return `[]` on server).

## Hook contract

```typescript
export function useUserPlatforms(): {
  slugs: string[];
  hasSelection: boolean; // slugs.length > 0
  toggle: (slug: string) => void;
  isSelected: (slug: string) => boolean;
};
```

- On mount: load from storage.
- Subscribe to `peligo:user-platforms-changed` and `storage` (cross-tab) for updates.
