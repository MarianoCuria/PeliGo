# Feature Specification: Mis plataformas

**Feature Branch**: `001-mis-plataformas`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "Mis plataformas — the user chooses which streaming services they have subscribed to (Netflix, Disney+, Prime, etc.). In search and on the title detail page, show availability on those platforms first; the rest collapsed or secondary. Local persistence in the MVP; no backend. Must comply with constitution v1.0.0."

**Constitution**: Features MUST comply with `.specify/memory/constitution.md` (Argentina-first, data trust, mobile-first, YAGNI, voseo, spec-driven workflow).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure my services (Priority: P1)

As a user in Argentina, I want to indicate which streaming platforms I currently pay for so that PeliGo prioritizes that information when I search for where to watch something.

**Why this priority**: Without this configuration, the rest of the feature provides no value; it is the entry point of the differentiator versus global aggregators.

**Independent Test**: It can be tested on its own by opening the profile section, selecting/deselecting services, closing and reopening the app on the same device, and verifying that the selection is retained.

**Acceptance Scenarios**:

1. **Given** a new user with no saved platforms, **When** they enter the "Mis plataformas" configuration, **Then** they see a list of streaming services relevant to Argentina with none selected by default (or a clear empty state).
2. **Given** the list of services, **When** the user enables Netflix and Disney+, **Then** both are visually marked and the selection is saved when leaving the screen.
3. **Given** platforms already saved, **When** the user disables a platform, **Then** it stops being considered "mine" in the rest of the app within the same session and on future visits on that device.
4. **Given** any change in the selection, **When** the user returns to the configuration, **Then** they see the updated state without needing to configure again from scratch.

---

### User Story 2 - See "where to watch it" on my platforms first (Priority: P1)

As a user who already configured their services, I want the title detail page to show availability on the platforms I pay for first, so I can decide in seconds whether I can already watch it without reviewing the whole list.

**Why this priority**: It is the moment of highest intent ("do I have it or not?") and the heart of the problem PeliGo solves.

**Independent Test**: With at least one platform configured, open the detail page of a title available in AR; verify ordering and grouping without using search or other screens.

**Acceptance Scenarios**:

1. **Given** the user has Netflix and Prime configured and the title is on Netflix (included) and on Apple TV (rental), **When** they open the title detail page, **Then** Netflix appears in the primary "En tus plataformas" section (or equivalent) and Apple TV appears in a secondary collapsed section or with visually lower hierarchy.
2. **Given** the title is only available on platforms the user has not configured, **When** they open the detail page, **Then** they see an honest message indicating it is not on their platforms and can expand "Otras opciones en Argentina" to see rental/purchase/other services.
3. **Given** the title is on several of the user's platforms, **When** they open the detail page, **Then** all matches appear grouped at the top, preserving access type (included / rental / purchase) and price in pesos when present in the data.
4. **Given** the user has not configured any platform, **When** they open the detail page, **Then** they see the full availability as it is today (without prioritization) and a brief notice inviting them to configure "Mis plataformas" to personalize.

---

### User Story 3 - Search results aligned with my services (Priority: P2)

As a user searching for a title, I want to see at a glance whether it is on any of my platforms before opening the detail, to save taps and time.

**Why this priority**: It improves the discovery flow but depends on the configuration and the detail page; it can be delivered after P1 with partial value.

**Independent Test**: Search for a title with platforms configured; validate indicators in the results list without opening the detail page.

**Acceptance Scenarios**:

1. **Given** the user has Disney+ configured and a result is available on Disney+, **When** they see the search list, **Then** that result shows a clear "En tu plataforma" indicator or highlights the Disney+ badge ahead of other platforms shown on the card.
2. **Given** a result is not on any of the user's platforms but is on others in Argentina, **When** they see the card, **Then** it shows no "on your platform" indicator and may show up to N secondary platforms without creating a false sense of priority.
3. **Given** the user changes their platforms in the profile, **When** they return to an already-loaded search or run a new one, **Then** the indicators reflect the current selection.

---

### Edge Cases

- What happens if the user selects zero platforms? → Behavior equivalent to "not personalized": no prioritization; optional CTA to configuration.
- What happens if a catalog service does not match the provider name in the availability data? → Show availability under "Otras opciones"; do not fabricate matches; document in support/help that matching may be incomplete.
- What happens if the user clears browser data? → They lose the selection; they must configure again (expected behavior in the MVP with no account).
- What happens if the title has no availability in Argentina? → Existing honest empty message; the feature does not change that message.
- What about rental/purchase vs included subscription? → Both types can count as "on your platform" if the provider matches; the access type must remain visible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST offer a "Mis plataformas" configuration where the user selects one or more streaming services from a fixed catalog oriented to Argentina.
- **FR-002**: The system MUST persist the user's selection on the device without requiring registration or sign-in in the MVP.
- **FR-003**: The system MUST recover the saved selection on subsequent visits on the same device and browser.
- **FR-004**: On the title detail page, the system MUST separate availability into at least two groups when the user has platforms configured: (a) available on "your platforms" and (b) "other options in Argentina".
- **FR-005**: The "your platforms" group MUST be listed before "other options" and be visible without expanding secondary sections when at least one match exists.
- **FR-006**: The "other options" group MUST be collapsed by default or have lower visual hierarchy when there are matches in "your platforms".
- **FR-007**: The system MUST NOT hide real availability in Argentina: everything shown today must remain accessible via expansion or a secondary section.
- **FR-008**: The system MUST NOT fabricate platforms, prices, or links; only reorder and group existing availability data.
- **FR-009**: In search results, the system MUST visually indicate or prioritize the user's platforms when the title is available on at least one of them (P2).
- **FR-010**: The entire interface of this feature MUST use Rioplatense Spanish (voseo) per the constitution.
- **FR-011**: If no platforms are configured, the system MUST degrade gracefully to the current behavior without errors or blocked screens.

### Key Entities

- **User subscription (chosen platform)**: Stable identifier of the service (e.g. netflix, disney) that the user declares they have subscribed to; a set of zero to N items.
- **Platform catalog**: Curated list of services offered in the configuration; user-visible name and internal identifier to match against availability.
- **Title availability**: For each title, a set of options in Argentina with provider, type (included/rental/purchase), optional price, and link; classified as "on your platforms" or "another option" based on matching against the user's subscription.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can configure at least one platform and see the change reflected on a title detail page in under 60 seconds.
- **SC-002**: On detail pages with at least one match in "your platforms", the user sees that information without scrolling past the first block of content on standard mobile screens (viewport ~390×844).
- **SC-003**: After closing and reopening the browser on the same device, 100% of manual tests retain the platform selection without reconfiguration.
- **SC-004**: In tests with 5 varied titles, no title hides availability options that were previously visible without expanding "other options".
- **SC-005**: In search (P2), at least 80% of titles available on a user's platform show the "on your platform" indicator on the result card (measured on a test set agreed in QA).

## Assumptions

- The configuration catalog includes the services already covered in the product for Argentina (Netflix, Prime Video, Disney+, Max, Paramount+, Apple TV+, Star+, and similar backlog items); catalog extensions are minor changes outside the initial scope unless listed in a separate spec.
- Per-title availability still comes from the product's current source (data for Argentina); this feature only reorganizes presentation, it does not enrich the catalog.
- There are no user accounts in the MVP: persistence only on the device; multi-device sync is out of scope.
- Screens explicitly out of scope in this delivery: home, trending, and favorites do not reorder availability by "mis plataformas" until a future spec.
- The profile screen already exposes a selection prototype; this feature makes it functional end-to-end with persistence and effect on search and the detail page.
- Provider ↔ catalog matching may require name normalization; discrepancies are treated as "other options", never as a false match.

## Out of Scope

- Registration, login, and cloud sync of preferences.
- Alerts of the "let me know when it's on Netflix" type (separate feature).
- Filtering of listings on home or trending.
- A dedicated backend, new APIs, or sync jobs.
- Personalized recommendations based on viewing history.
