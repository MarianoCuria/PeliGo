# PeliGo — MVP Structure & Backlog

## 1. MVP Definition

### Principle
**The minimum product that solves the core problem:** "¿Dónde puedo ver esta película/serie en Argentina?" (Where can I watch this movie/series in Argentina?)

A user must be able to open PeliGo, search for a title, and know in 5 seconds where to watch it. Everything else is secondary.

---

## 2. Features by Phase

### Phase 0 — MVP Core (Must Have)

| #  | Feature                         | Description                                                   | Priority  |
|----|--------------------------------|---------------------------------------------------------------|-----------|
| F1 | Title search                   | Search movies and series by name                              | P0        |
| F2 | Results with platforms         | See which platforms it's on (stream/rent/buy + price)         | P0        |
| F3 | Basic detail sheet             | Poster, rating, year, synopsis, genre, director, cast         | P0        |
| F4 | Argentina trending             | Top most-searched movies/series in AR (today/week)            | P0        |
| F5 | Installable PWA                | Manifest + Service Worker + basic offline                     | P0        |
| F6 | Dark mode by default           | Dark theme as the main experience                             | P0        |
| F7 | Responsive mobile-first        | Works perfectly on mobile, tablet, and desktop               | P0        |
| F8 | Landing / Home with search     | Main screen with a prominent search                          | P0        |

### Phase 1 — Basic Freemium (Should Have)

| #   | Feature                         | Description                                                  | Priority  |
|-----|--------------------------------|--------------------------------------------------------------|-----------|
| F9  | Sign up + Login                | Email/password + Google OAuth                                | P1        |
| F10 | User profile                   | Name, avatar, subscribed platforms                           | P1        |
| F11 | Favorites                      | Save titles as favorites                                     | P1        |
| F12 | Basic watchlist                | "To watch" / "watched" list                                 | P1        |
| F13 | Release alerts                 | Notification when a title is released                        | P1        |
| F14 | Platform alerts                | Notification when a title arrives on a platform             | P1        |
| F15 | Push notifications (PWA)       | Native browser notifications                                 | P1        |
| F16 | ES/EN language                 | Language switch in the app                                   | P1        |
| F17 | My platforms                   | Configure which services I have to filter results           | P1        |
| F18 | Recent searches                | History of the latest searches                              | P1        |
| F19 | Light mode                     | Alternative light theme                                     | P1        |
| F20 | Onboarding                     | 3 explanatory slides the first time                         | P1        |

### Phase 2 — Growth (Nice to Have)

| #   | Feature                         | Description                                                  | Priority  |
|-----|--------------------------------|--------------------------------------------------------------|-----------|
| F21 | Shared watchlist               | Share a list with friends via link                          | P2        |
| F22 | More LATAM countries           | Mexico, Colombia, Chile, Uruguay                            | P2        |
| F23 | Advanced filters               | By genre, year, rating, platform                            | P2        |
| F24 | Genre notifications            | "Notify me when something Sci-Fi drops on Netflix"          | P2        |
| F25 | Price comparator               | See where to rent/buy cheapest                              | P2        |
| F26 | User ratings                   | Personal rating + would you recommend it?                   | P2        |
| F27 | Watch history                  | Record of what you watched and when                         | P2        |
| F28 | SEO optimized                  | Friendly URLs, OG metadata, structured data                 | P2        |

### Phase 3 — Premium & Scale

| #   | Feature                         | Description                                                  | Priority  |
|-----|--------------------------------|--------------------------------------------------------------|-----------|
| F29 | Basic ML recommendations       | "If you liked X, you'll like Y"                             | P3        |
| F30 | Premium plan                   | Unlimited alerts, no ads, extra features                    | P3        |
| F31 | Affiliates                     | Affiliate links for rent/buy (monetization)                | P3        |
| F32 | Public API                     | For developers, partners, integrations                      | P3        |
| F33 | Analytics dashboard            | Usage metrics, internal trending, retention                 | P3        |
| F34 | Social features                | Follow users, see what friends are watching                 | P3        |
| F35 | Brazil                         | Portuguese support + BR platforms                           | P3        |
| F36 | Embeddable widget              | "¿Dónde verlo?" widget for blogs/media                      | P3        |

---

## 3. Suggested Sprints

### Sprint 1 — Foundation (2 weeks)
**Goal:** Technical setup + working search.

| Task                                     | Points | Feature |
|------------------------------------------|--------|---------|
| Set up NestJS + Prisma project           | 3      | --      |
| Set up Next.js + Tailwind + PWA base     | 3      | F5      |
| TMDB API integration (search)            | 5      | F1      |
| Streaming Availability API integration   | 8      | F2      |
| GET /search endpoint                     | 3      | F1      |
| GET /titles/:id endpoint                 | 3      | F3      |
| GET /titles/:id/availability endpoint    | 5      | F2      |
| Home screen with search                  | 5      | F8      |
| Search results screen                    | 5      | F1      |
| Redis cache setup                        | 3      | --      |
| Deploy MVP to Railway + Vercel           | 3      | --      |

**Total: 46 points**
**Deliverable:** You can search for a title and see where it's available.

---

### Sprint 2 — Detail & Trending (2 weeks)
**Goal:** Complete detail screen + trending.

| Task                                     | Points | Feature |
|------------------------------------------|--------|---------|
| Title detail screen                      | 8      | F3      |
| Deep links to platforms                  | 3      | F2      |
| GET /trending endpoint                   | 3      | F4      |
| Cron job sync trending                   | 5      | F4      |
| Argentina trending screen                | 5      | F4      |
| Similar titles                           | 3      | F3      |
| Complete dark mode                       | 5      | F6      |
| Responsive polish (tablet + desktop)     | 5      | F7      |
| Skeleton loading                         | 3      | --      |
| Error & empty states                     | 3      | --      |
| Service Worker + offline cache           | 5      | F5      |
| Complete Web App Manifest                | 2      | F5      |

**Total: 50 points**
**Deliverable:** MVP Core complete and functional. Installable PWA.

---

### Sprint 3 — Auth & Profile (2 weeks)
**Goal:** Working user system.

| Task                                     | Points | Feature |
|------------------------------------------|--------|---------|
| Email/password sign up                   | 5      | F9      |
| Login + JWT + Refresh tokens             | 8      | F9      |
| Google OAuth                             | 5      | F9      |
| Profile screen                           | 5      | F10     |
| CRUD /users/me endpoint                  | 3      | F10     |
| Configure "my platforms"                 | 5      | F17     |
| Filter results by my platforms           | 3      | F17     |
| Recent searches                          | 3      | F18     |
| 3-slide onboarding                       | 3      | F20     |
| Rate limiting                            | 3      | --      |
| Security headers + CORS                  | 2      | --      |

**Total: 45 points**
**Deliverable:** Users can sign up, log in, and configure their profile.

---

### Sprint 4 — Favorites & Watchlist (2 weeks)
**Goal:** Engagement features.

| Task                                     | Points | Feature |
|------------------------------------------|--------|---------|
| CRUD /favorites endpoints                | 3      | F11     |
| Favorites screen                         | 5      | F11     |
| CRUD /watchlist endpoints                | 3      | F12     |
| Watchlist screen with statuses           | 5      | F12     |
| Favorite animation (heart bounce)        | 2      | F11     |
| ES/EN language (i18n setup)              | 8      | F16     |
| Complete translations                    | 5      | F16     |
| Light mode                               | 5      | F19     |
| Performance optimization                 | 3      | --      |
| Basic E2E testing                        | 5      | --      |
| Bug fixing + polish                      | 5      | --      |

**Total: 49 points**
**Deliverable:** App with engagement features. Bilingual. Polished.

---

### Sprint 5 — Notifications & Alerts (2 weeks)
**Goal:** Alert system (key differentiator).

| Task                                     | Points | Feature |
|------------------------------------------|--------|---------|
| CRUD /alerts endpoints                   | 5      | F13/F14 |
| Alerts screen                            | 5      | F13/F14 |
| UI to create an alert from detail        | 3      | F13/F14 |
| Web Push setup (VAPID + subscription)    | 8      | F15     |
| BullMQ job: check-alerts                 | 8      | F13/F14 |
| BullMQ job: send-push                    | 5      | F15     |
| Email notifications (Resend)             | 5      | F13     |
| Alert limit (free vs premium)            | 3      | F13     |
| Notification preferences                 | 3      | F10     |
| PWA install prompt                       | 2      | F5      |
| Bug fixing + QA                          | 5      | --      |

**Total: 52 points**
**Deliverable:** Phase 1 complete. Functional freemium product.

---

### Sprint 6 — Launch Prep (1 week)
**Goal:** Prepare for public launch.

| Task                                     | Points | Feature |
|------------------------------------------|--------|---------|
| Basic SEO (meta tags, OG images)         | 3      | F28     |
| Lighthouse audit + fixes                 | 5      | --      |
| Analytics setup (Plausible/Umami)        | 3      | --      |
| Landing page / marketing site            | 5      | --      |
| Legal: TOS + Privacy Policy              | 2      | --      |
| Basic load testing                       | 3      | --      |
| Monitoring: Sentry + Uptime              | 2      | --      |
| Soft launch + feedback loop              | --     | --      |

**Total: 23 points**
**Deliverable:** PeliGo v1.0 ready for the public.

---

## 4. Visual Timeline

```
Week    1  2  3  4  5  6  7  8  9  10  11
        ├──────┤                              Sprint 1: Foundation
              ├──────┤                        Sprint 2: Detail & Trending
                    ├──────┤                  Sprint 3: Auth & Profile
                          ├──────┤            Sprint 4: Favorites & i18n
                                ├──────┤      Sprint 5: Notifications
                                      ├───┤  Sprint 6: Launch Prep

MVP Core ready: ─────────► Week 4
Freemium v1:    ──────────────────────► Week 10
Launch:         ──────────────────────────► Week 11
```

---

## 5. MVP Success Metrics

### Product Metrics
| Metric                      | MVP Target      | 3-month Target   |
|-----------------------------|-----------------|------------------|
| Daily searches              | 100             | 1,000            |
| Registered users            | 50              | 500              |
| PWA installs                | 20              | 200              |
| Alerts created              | 30              | 300              |
| D7 Retention                | 20%             | 35%              |
| Time to result (search)     | < 2s            | < 1s             |

### Technical Metrics
| Metric                      | Target           |
|-----------------------------|------------------|
| Lighthouse Performance      | > 90             |
| Lighthouse PWA              | 100              |
| Time to First Byte          | < 200ms          |
| API Response p95            | < 500ms          |
| Uptime                      | 99.5%            |
| Cache Hit Rate              | > 70%            |

---

## 6. Risks and Mitigations

| Risk                                        | Impact | Mitigation                                       |
|---------------------------------------------|---------|--------------------------------------------------|
| Availability API changes/shuts down         | High    | Abstract with adapter pattern, have a fallback    |
| TMDB rate limit during peaks                | Medium  | Aggressive cache, queue for requests              |
| Low initial adoption                        | Medium  | SEO, social media, Product Hunt LATAM             |
| Cross-browser push notification complexity  | Medium  | Use a proven library (web-push), test on multiple browsers |
| API costs scale with users                  | Medium  | Smart cache, bulk endpoints if available          |
| Competitor launches a similar product       | Low     | Execution speed, local brand identity             |

---

## 7. Definition of Done

A feature is considered "Done" when:

1. Code implemented and working in staging.
2. Unit tests for business logic.
3. Responsive tested on 3 viewports (375px, 768px, 1200px).
4. Dark mode and light mode verified.
5. AA accessibility verified (contrast, keyboard nav, screen reader).
6. No errors in the console.
7. Performance: does not degrade the Lighthouse score.
8. Code review approved.
9. API documentation updated (if applicable).
```
