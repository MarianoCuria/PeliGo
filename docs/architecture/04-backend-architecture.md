# PeliGo — Backend Architecture

## 1. Overview

A **modular monolith** architecture as the MVP, ready to migrate to microservices when needed. This strategy enables initial development speed without sacrificing future scalability.

```
                    ┌─────────────────────┐
                    │    CDN (Cloudflare)  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   PWA Frontend      │
                    │   (Next.js / SSR)   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   API Gateway       │
                    │   (Rate Limit,      │
                    │    Auth, CORS)      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐
    │  Search Module │ │  User Module │ │ Notif Module │
    │                │ │              │ │              │
    │  - TMDB API    │ │  - Auth      │ │  - Push      │
    │  - Availability│ │  - Profile   │ │  - Alerts    │
    │  - Trending    │ │  - Favorites │ │  - Email     │
    │  - Cache       │ │  - Watchlist │ │  - Scheduler │
    └────────┬───────┘ └──────┬───────┘ └──────┬───────┘
             │                │                │
    ┌────────▼────────────────▼────────────────▼───────┐
    │                  PostgreSQL                       │
    │           (Primary Database)                      │
    └──────────────────────┬───────────────────────────┘
                           │
    ┌──────────────────────▼───────────────────────────┐
    │                    Redis                          │
    │         (Cache + Sessions + Queue)                │
    └──────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer              | Technology                    | Rationale                                            |
|--------------------|-------------------------------|------------------------------------------------------|
| **Runtime**        | Node.js 20+ (LTS)            | Broad ecosystem, async performance, full-JS team     |
| **Framework**      | NestJS                        | Modular, native TypeScript, dependency injection     |
| **ORM**            | Prisma                        | Type-safe, migrations, excellent DX                  |
| **Database**       | PostgreSQL 16                 | Relational, JSONB for flexible data, battle-tested   |
| **Cache**          | Redis 7                       | Cache, sessions, pub/sub for notifications           |
| **Queue**          | BullMQ (on Redis)             | Async jobs: platform sync, push, emails              |
| **Auth**           | JWT + Refresh tokens          | Stateless, scalable, standard                        |
| **Push**           | Web Push (VAPID)              | PWA standard, no vendor lock-in                      |
| **Email**          | Resend                        | Modern API, good free tier                           |
| **Frontend**       | Next.js 14 (App Router)      | SSR/SSG, PWA ready, React ecosystem                  |
| **Deploy**         | Railway / Render (MVP)        | Simple, affordable, scales easily                    |
| **CDN**            | Cloudflare                    | Global cache, DDoS protection, free tier             |
| **Monitoring**     | Sentry + Uptime Robot         | Error tracking + uptime monitoring                   |
| **CI/CD**          | GitHub Actions                | Integrated, free for repos, familiar                 |

---

## 3. System Modules

### 3.1 Search Module (Core)

**Responsibility:** Search titles, get availability by platform, trending.

```typescript
// Main endpoints
GET  /api/search?q={query}&type={movie|series}&page={n}
GET  /api/titles/{id}
GET  /api/titles/{id}/availability?country=AR
GET  /api/trending?country=AR&period={day|week}&type={movie|series}
GET  /api/titles/{id}/similar
```

**External data providers:**

| Provider             | Data                               | Notes                          |
|---------------------|------------------------------------|--------------------------------|
| **TMDB API**        | Metadata, posters, backdrops, trending, search | Free, API key, rate limit 40req/s |
| **Streaming Availability API** | Availability by country and platform | watchmode.com or streaming-availability.com |
| **OMDB API**        | Additional ratings (IMDb, RT)      | Fallback/complement            |

**Availability data strategy:**
1. **Primary:** Streaming Availability API (streamingavailability.com) — data for 60+ countries, including Argentina.
2. **Fallback:** Controlled scraping of JustWatch (with rate limiting and respect for ToS).
3. **Aggressive cache:** Availability is cached for 6 hours (platforms don't change minute by minute).
4. **Sync job:** A BullMQ job every 6h updates trending and availability of popular titles.

**Search flow:**
```
User Search → API Gateway → Search Module
  → Check Redis Cache (TTL: 1h for searches, 6h for availability)
    → HIT: Return cached
    → MISS: Query TMDB → Get Availability → Compose response → Cache → Return
```

### 3.2 User Module

**Responsibility:** Authentication, profiles, favorites, watchlist, user platforms.

```typescript
// Auth
POST /api/auth/register        // Email + password
POST /api/auth/login           // Returns JWT + refresh token
POST /api/auth/refresh         // Refresh access token
POST /api/auth/google          // OAuth Google
POST /api/auth/logout          // Invalidate refresh token
POST /api/auth/forgot-password // Send reset email
POST /api/auth/reset-password  // Reset with token

// Profile
GET    /api/users/me
PATCH  /api/users/me
PATCH  /api/users/me/platforms    // Platforms the user is subscribed to
PATCH  /api/users/me/preferences  // Language, theme, notifications

// Favorites & Watchlist
GET    /api/users/me/favorites
POST   /api/users/me/favorites/{titleId}
DELETE /api/users/me/favorites/{titleId}
GET    /api/users/me/watchlist
POST   /api/users/me/watchlist/{titleId}
PATCH  /api/users/me/watchlist/{titleId}  // Change status (to watch, watched)
DELETE /api/users/me/watchlist/{titleId}
```

**Auth Flow:**
1. Register/Login → Server generates JWT (15min) + Refresh Token (7 days).
2. JWT in `Authorization: Bearer` header.
3. Refresh token in an httpOnly cookie (secure).
4. Google OAuth as an alternative (Firebase Auth or passport-google).
5. Refresh token rotation: each use generates a new one and invalidates the previous.

### 3.3 Notification Module

**Responsibility:** Availability alerts, releases, push notifications, emails.

```typescript
// Alerts
GET    /api/alerts
POST   /api/alerts
DELETE /api/alerts/{id}
PATCH  /api/alerts/{id}

// Alert types:
// - "availability": When a title is on a specific platform
// - "release": When a title is released
// - "streaming": When a title appears on any streaming platform
```

**Notification flow:**
```
1. User creates alert → Saved in DB
2. Cron Job (every 6 hours) → Checks availability of titles with alerts
3. If there's a match → Enqueue notification in BullMQ
4. Worker processes the queue:
   a. Web Push via VAPID keys → Browser notification
   b. Email via Resend → Email notification
5. Mark alert as "triggered" / "sent"
```

**Push Notifications (PWA):**
```
Frontend                           Backend
   │                                  │
   │── Register Service Worker ──→    │
   │── Request Push Permission ──→    │
   │── Subscribe to Push ──────────→  │── Save subscription in DB
   │                                  │
   │                          [Cron detects match]
   │                                  │
   │  ←──── Web Push Notification ────│
   │                                  │
```

---

## 4. Database

### 4.1 Choice: PostgreSQL

**Reasons:**
- Clear relational data (users → favorites → titles).
- JSONB for semi-structured data (title metadata, availability).
- Native full-text search for local search.
- Excellent index support (GIN for JSONB, trigram for fuzzy search).
- Scalable with read replicas when needed.
- Free and open source.

### 4.2 Main Schema

```sql
-- Users
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),
    name            VARCHAR(100),
    avatar_url      TEXT,
    google_id       VARCHAR(255),
    language        VARCHAR(5) DEFAULT 'es-AR',
    theme           VARCHAR(10) DEFAULT 'dark',
    platforms       JSONB DEFAULT '[]',
    push_subscription JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Titles (local cache of TMDB)
CREATE TABLE titles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tmdb_id         INTEGER UNIQUE NOT NULL,
    type            VARCHAR(10) NOT NULL, -- 'movie' | 'series'
    title_original  VARCHAR(500) NOT NULL,
    title_es        VARCHAR(500),
    title_en        VARCHAR(500),
    overview_es     TEXT,
    overview_en     TEXT,
    poster_path     TEXT,
    backdrop_path   TEXT,
    release_date    DATE,
    end_date        DATE,
    rating          DECIMAL(3,1),
    vote_count      INTEGER,
    genres          JSONB DEFAULT '[]',
    runtime         INTEGER,
    seasons         INTEGER,
    metadata        JSONB DEFAULT '{}',
    last_synced     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Availability by platform
CREATE TABLE availability (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id        UUID REFERENCES titles(id) ON DELETE CASCADE,
    country         VARCHAR(2) NOT NULL DEFAULT 'AR',
    platform_name   VARCHAR(100) NOT NULL,
    platform_slug   VARCHAR(100) NOT NULL,
    platform_logo   TEXT,
    type            VARCHAR(20) NOT NULL, -- 'stream' | 'rent' | 'buy'
    quality         VARCHAR(10), -- 'SD' | 'HD' | '4K'
    price           DECIMAL(10,2),
    currency        VARCHAR(3) DEFAULT 'ARS',
    link            TEXT,
    last_checked    TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(title_id, country, platform_slug, type)
);

-- Favorites
CREATE TABLE favorites (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    title_id        UUID REFERENCES titles(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, title_id)
);

-- Watchlist
CREATE TABLE watchlist (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    title_id        UUID REFERENCES titles(id) ON DELETE CASCADE,
    status          VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'watching' | 'watched'
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, title_id)
);

-- Alerts
CREATE TABLE alerts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    title_id        UUID REFERENCES titles(id) ON DELETE CASCADE,
    type            VARCHAR(20) NOT NULL, -- 'availability' | 'release' | 'streaming'
    platform_slug   VARCHAR(100), -- NULL if type is 'release' or 'streaming'
    is_triggered    BOOLEAN DEFAULT FALSE,
    triggered_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, title_id, type, platform_slug)
);

-- Trending (cache)
CREATE TABLE trending (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_id        UUID REFERENCES titles(id) ON DELETE CASCADE,
    country         VARCHAR(2) NOT NULL DEFAULT 'AR',
    period          VARCHAR(10) NOT NULL, -- 'day' | 'week'
    type            VARCHAR(10) NOT NULL, -- 'movie' | 'series'
    position        INTEGER NOT NULL,
    trend_score     DECIMAL(5,2),
    fetched_at      TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(title_id, country, period, type)
);

-- Recent searches (per user)
CREATE TABLE search_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    query           VARCHAR(500) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_titles_tmdb ON titles(tmdb_id);
CREATE INDEX idx_titles_search ON titles USING gin(to_tsvector('spanish', title_es || ' ' || title_original));
CREATE INDEX idx_availability_title_country ON availability(title_id, country);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_watchlist_user ON watchlist(user_id, status);
CREATE INDEX idx_alerts_user ON alerts(user_id, is_triggered);
CREATE INDEX idx_trending_country ON trending(country, period, type, position);
CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);
```

---

## 5. Cache Layer (Redis)

### Cache Strategy

| Data                        | Key Pattern                         | TTL      |
|-----------------------------|-------------------------------------|----------|
| Search                      | `search:{query}:{type}:{page}`      | 1 hour   |
| Title detail                | `title:{tmdb_id}`                   | 12 hours |
| Availability                | `avail:{tmdb_id}:{country}`         | 6 hours  |
| Trending                    | `trending:{country}:{period}:{type}`| 3 hours  |
| Similar                     | `similar:{tmdb_id}`                 | 24 hours |
| Session (refresh token)     | `session:{user_id}:{token_id}`      | 7 days   |
| Rate limit                  | `ratelimit:{ip}`                    | 1 minute |

### Invalidation
- **Trending:** Overwritten with each sync job.
- **Availability:** Invalidated and regenerated every 6h by the sync job.
- **Manual:** Admin endpoint to purge cache by key pattern.

---

## 6. Security

### 6.1 Authentication & Authorization
- **JWT:** Access token signed with RS256, expires in 15 minutes.
- **Refresh Token:** Stored in an httpOnly, Secure, SameSite=Strict cookie.
- **Refresh Rotation:** Each refresh generates a new token pair.
- **Revocation:** Refresh tokens in Redis; invalidated on logout.

### 6.2 API Protection
- **Rate Limiting:** 100 req/min per IP (anonymous), 200 req/min per authenticated user.
- **CORS:** Domain whitelist (peligo.com.ar, localhost in dev).
- **Helmet:** Security headers (CSP, X-Frame-Options, etc.).
- **Input Sanitization:** `class-validator` + `class-transformer` in NestJS.
- **SQL Injection:** Prisma parameterizes queries automatically.
- **XSS:** Output sanitization + CSP headers.

### 6.3 Sensitive Data
- **Passwords:** bcrypt with cost factor 12.
- **API Keys:** In environment variables, never in code.
- **Secrets Management:** local .env, Railway/Render secrets in production.
- **HTTPS:** Enforced in production (Cloudflare SSL).

### 6.4 Anti-Abuse Protection
- **Brute Force:** Progressive lockout (5 attempts → wait 15min).
- **Account Enumeration:** Same response for "email does not exist" and "incorrect password".
- **Push Subscription Abuse:** Limit of 5 subscriptions per user.

---

## 7. Asynchronous Jobs (BullMQ)

| Job                        | Frequency    | Description                                    |
|----------------------------|--------------|------------------------------------------------|
| `sync-trending`            | Every 3 hours| Updates trending from TMDB for AR              |
| `sync-availability`        | Every 6 hours| Updates availability of popular titles         |
| `check-alerts`             | Every 6 hours| Compares active alerts vs new availability     |
| `send-push-notification`   | On demand    | Sends a push notification to the browser       |
| `send-email-notification`  | On demand    | Sends an alert email                           |
| `cleanup-expired-sessions` | Daily        | Cleans expired refresh tokens from Redis       |
| `cleanup-old-searches`     | Weekly       | Cleans search_history > 30 days                |

---

## 8. PWA Architecture

### Service Worker
```
┌───────────────────────────────────────────┐
│              Service Worker                │
│                                           │
│  ┌─────────────┐  ┌───────────────────┐   │
│  │ Cache First  │  │ Network First     │   │
│  │ (assets,     │  │ (API calls,       │   │
│  │  fonts,      │  │  search results)  │   │
│  │  images)     │  │                   │   │
│  └─────────────┘  └───────────────────┘   │
│                                           │
│  ┌─────────────────────────────────────┐  │
│  │ Push Event Handler                  │  │
│  │ → Show notification                 │  │
│  │ → Handle click → Open relevant page │  │
│  └─────────────────────────────────────┘  │
│                                           │
│  ┌─────────────────────────────────────┐  │
│  │ Background Sync                     │  │
│  │ → Queue favorite/watchlist changes  │  │
│  │ → Sync when back online             │  │
│  └─────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

### Cache Strategy (Workbox)
- **App Shell:** Cache first (HTML, CSS, JS, fonts).
- **API Responses:** Network first with fallback to cache.
- **Images (posters):** Cache first with 7-day expiration, max 200 entries.
- **Offline Fallback:** Custom offline page with the latest cached searches.

### Web App Manifest
```json
{
  "name": "PeliGo - Encontrá dónde verlo",
  "short_name": "PeliGo",
  "description": "Buscá películas y series, encontrá en qué plataforma verlas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D0D0D",
  "theme_color": "#E63946",
  "orientation": "portrait",
  "lang": "es-AR",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

---

## 9. Infrastructure & Deploy

### MVP (Affordable)
```
┌─────────────────────────────────────────────────┐
│  Cloudflare (CDN + DNS + SSL)          [Free]   │
│  ├── Next.js Frontend → Vercel         [Free]   │
│  └── NestJS Backend  → Railway         [$5/mo]  │
│       ├── PostgreSQL → Railway         [incl.]  │
│       └── Redis      → Upstash        [Free]    │
│                                                  │
│  External:                                       │
│  ├── TMDB API                          [Free]    │
│  ├── Streaming Availability API        [$9/mo]   │
│  ├── Resend (emails)                   [Free]    │
│  └── Sentry (monitoring)              [Free]     │
│                                                  │
│  Estimated total MVP cost: ~$15-20/mo           │
└─────────────────────────────────────────────────┘
```

### Scaling (Phase 2+)
```
┌─────────────────────────────────────────────────┐
│  Cloudflare (CDN + Workers)                      │
│  ├── Frontend → Vercel Pro                       │
│  └── Backend  → Railway Pro / AWS ECS            │
│       ├── PostgreSQL → Supabase / RDS            │
│       ├── Redis      → Upstash Pro / ElastiCache │
│       └── BullMQ     → Dedicated workers         │
│                                                  │
│  + Elasticsearch for advanced search             │
│  + S3 for user uploads                           │
│  + CloudWatch / Datadog for observability        │
└─────────────────────────────────────────────────┘
```

---

## 10. API Design Patterns

### Response Format
```json
{
  "success": true,
  "data": { },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "TITLE_NOT_FOUND",
    "message": "El título no fue encontrado",
    "status": 404
  }
}
```

### Versioning
- URL prefix: `/api/v1/`
- Breaking changes = new version
- Deprecation headers for older versions

---

## 11. LATAM Scalability

### Multi-Country Strategy
1. **Phase 1 (MVP):** Argentina only (`country=AR`).
2. **Phase 2:** Mexico, Colombia, Chile, Uruguay (same API, change country param).
3. **Phase 3:** Brazil (requires Portuguese-language data sources).

### Considerations:
- **Availability API** already supports most LATAM countries.
- **TMDB** has translations for Spanish and English.
- **Platforms vary by country:** The `availability` table already handles this with `country`.
- **Currency:** `currency` field in availability (ARS, MXN, CLP, etc.).
- **CDN:** Cloudflare has PoPs in Buenos Aires, São Paulo, Santiago, Bogotá.
- **Latency:** Consider the South America region for Railway/Render.

---

## 12. Technical Roadmap

| Phase  | Period     | Components                                            |
|--------|-----------|-------------------------------------------------------|
| **MVP**| Month 1-2 | Search + Detail + Trending + Basic auth + PWA         |
| **v1.1**| Month 3  | Favorites + Watchlist + Push notifications             |
| **v1.2**| Month 4  | Alerts + Email notifications + Multi-country prep      |
| **v2.0**| Month 5-6| Multiple countries + Elasticsearch + Performance tuning|
| **v2.1**| Month 7-8| ML recommendations + Analytics dashboard              |
| **v3.0**| Month 9-12| Social features + Public API + Partner integrations   |
```
