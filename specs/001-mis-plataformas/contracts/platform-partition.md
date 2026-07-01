# Contract: Platform partition

**Version**: 1.0.0  
**Module**: `src/src/lib/user-platforms.ts` (or `platform-match.ts`)

## Input

```typescript
interface PartitionInput {
  platforms: NormalizedPlatform[];
  userSlugs: string[];
}
```

## Output

```typescript
interface PartitionResult {
  mine: NormalizedPlatform[];
  other: NormalizedPlatform[];
  hasUserConfig: boolean;
}
```

## Function

```typescript
export function resolveCatalogSlug(platform: NormalizedPlatform): string | null;

export function partitionPlatforms(
  platforms: NormalizedPlatform[],
  userSlugs: string[]
): PartitionResult;
```

## Rules

1. `hasUserConfig === (userSlugs.length > 0)`.
2. If `!hasUserConfig`: return `{ mine: [], other: platforms, hasUserConfig: false }`.
3. If `hasUserConfig`: for each platform, if `resolveCatalogSlug(platform) ∈ userSlugs` → `mine`, else → `other`.
4. If `resolveCatalogSlug` returns `null` → always `other` (conservative).
5. Order within `mine` and `other`: preserve original TMDB order (display_priority implicit in array order from normalize).
6. MUST NOT drop platforms from union of mine + other compared to input.

## TMDB provider ID map (minimum set)

Maintained in code as `Record<number, string>` plus optional name aliases:

- `8` → `netflix`
- `119` → `amazon`
- `337` → `disney`
- `384` → `hbo`
- `531` → `paramount`
- `350` → `apple`
- `619` → `star`
- `11` → `mubi`
- `283` → `crunchyroll`

Extend only with catalog entries present in `PLATFORM_CATALOG`.

## Implementation note

Prefer setting `providerId` on `NormalizedPlatform` during `normalizeProviders` in `tmdb.ts` so `resolveCatalogSlug` can use ID first, name fallback second.
