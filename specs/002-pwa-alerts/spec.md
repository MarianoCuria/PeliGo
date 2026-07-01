# Feature Specification: PWA availability alerts

**Feature Branch**: `002-pwa-alerts`

**Created**: 2026-06-02

**Status**: Draft

**Input**: User description: "Alerts when a title arrives on one of my platforms in Argentina. PWA push in the MVP, no backend if possible using browser notifications."

**Constitution**: Features MUST comply with `.specify/memory/constitution.md` (Argentina-first, data trust, mobile-first, YAGNI, voseo, spec-driven workflow).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create an alert from a title (Priority: P1)

As a user in Argentina, I want to enable an alert from a movie or series detail page so I get notified when that title becomes available on at least one of **my platforms** as configured.

**Why this priority**: Without creating alerts there is no retention product; it is the start of the flow.

**Independent Test**: From the detail page of a title that is not on my platforms today, create an alert, and see it listed in "Mis alertas" with the title name and "Activa" status.

**Acceptance Scenarios**:

1. **Given** I have at least one platform in "Mis plataformas" and a title with no availability on them, **When** I tap "Avisame cuando esté en mis plataformas", **Then** an alert is created associated with that title and the Argentina country.
2. **Given** the title is already on one of my platforms today, **When** I try to create the same alert, **Then** the system tells me it is already available and does not create a useless duplicate alert.
3. **Given** I have not configured "Mis plataformas", **When** I try to create an alert, **Then** I am invited to configure them first with a clear message.
4. **Given** an active alert for a title, **When** I try to create another identical one, **Then** it is not duplicated (or editing the existing one is offered).

---

### User Story 2 - Allow device notifications (Priority: P1)

As a user, I want to accept browser or PWA notifications so I find out without having to open PeliGo manually every day.

**Why this priority**: Without permission, alerts only work inside the app; the permission enables the "push" value in the MVP.

**Independent Test**: The first time I create an alert or enter "Mis alertas", request permission; when granted, the state is saved; when denied, the alert is still created but only with in-app notices.

**Acceptance Scenarios**:

1. **Given** I have never granted permission, **When** I create my first alert, **Then** it is explained in Rioplatense Spanish why it is worth enabling notifications and permission is requested in a non-intrusive way.
2. **Given** I deny permission, **When** I save the alert, **Then** the alert stays active and I can see notices in a center inside the app.
3. **Given** I grant permission, **When** an alert fires, **Then** I receive a native notification with the title name and clear text (e.g. "Ya está en Netflix").
4. **Given** I revoke permission in the operating system, **When** I return to PeliGo, **Then** the state is reflected and no failed native notifications are silently attempted.

---

### User Story 3 - View and manage my alerts (Priority: P1)

As a user, I want to see all my active alerts, pause them, or delete them when I am no longer interested.

**Why this priority**: Control and trust; it avoids "junk" alerts and abandonment.

**Independent Test**: Open the "Mis alertas" screen, see the list, delete one, and confirm it disappears and stops generating notices.

**Acceptance Scenarios**:

1. **Given** I have active alerts, **When** I open "Mis alertas", **Then** I see each title, creation date, and status (active / triggered / paused).
2. **Given** an active alert, **When** I delete it, **Then** it stops being monitored and disappears from the list.
3. **Given** an already-triggered alert, **When** I open it from the list, **Then** I can go to the title detail page to see where to watch it.
4. **Given** I reach the free limit of active alerts, **When** I try to create another, **Then** I receive a clear message with the limit and what I can do (delete an existing one).

---

### User Story 4 - Fire an alert when availability changes (Priority: P2)

As a user, I want PeliGo to detect when a title starts being on one of my platforms in Argentina and notify me without me having to search for it again.

**Why this priority**: It is the moment of value ("it's here!"); it depends on having alerts created and a periodic check mechanism on the device.

**Independent Test**: Create an alert for a title not available on my platforms; simulate or wait for an availability change in Argentina data; on check, the alert moves to "triggered" and an in-app notice and/or native notification appears if permission exists.

**Acceptance Scenarios**:

1. **Given** an active alert and the title was not on my platforms, **When** the availability in Argentina includes at least one of my platforms, **Then** the alert is marked as triggered and which platform(s) it was detected on is recorded.
2. **Given** a triggered alert, **When** I tap the notification or the item in the list, **Then** I land on the title detail page with the "En tus plataformas" section visible.
3. **Given** notification permission granted, **When** the alert fires, **Then** I receive at most one notification per alert per availability event (no repeated spam on the same day for the same title).
4. **Given** the availability data did not change, **When** the check runs, **Then** the alert stays active with no new notification.

---

### Edge Cases

- What happens if the user changes "Mis plataformas" after creating the alert? → The alert keeps being evaluated against the **current** platform selection.
- What happens if TMDB has no AR data for the title? → It does not fire; an honest message if the user checks the status.
- What happens offline? → The check is postponed; on reconnect it is retried without losing the alert.
- What happens if the app is closed for days? → In the backend-less MVP, detection happens when the PWA is reopened or in background check windows allowed by the device; real-time latency is not promised.
- What happens on iOS/Safari with push limits? → Degrade to in-app notices and explain limitations if the browser does not support web push.
- Alert for rental vs subscription? → Any kind of availability on my platforms counts as a trigger; the type detail is shown on the detail page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow creating an alert from a title detail page linked to that title and to Argentina.
- **FR-002**: An alert MUST be evaluated only against the platforms defined in the user's "Mis plataformas".
- **FR-003**: The system MUST persist alerts on the user's device without requiring an account or sign-in in the MVP.
- **FR-004**: The system MUST provide a "Mis alertas" screen or section to list, delete, and open the associated title.
- **FR-005**: The system MUST request browser notification permission contextually and respectfully, with copy in voseo.
- **FR-006**: If permission is granted, the system MUST be able to show a native notification when an alert fires.
- **FR-007**: If permission is not granted, the system MUST keep working with a notices center inside the app.
- **FR-008**: The system MUST periodically check active alerts by comparing current availability in Argentina with the previously known state.
- **FR-009**: The system MUST fire an alert only when the title transitions from "not on my platforms" to "yes on at least one of my platforms".
- **FR-010**: The system MUST NOT invent availability; if the data is uncertain, do not fire and keep the state transparent.
- **FR-011**: The system MUST apply a limit on simultaneous active alerts in the free plan (default: 3), with a clear message when exceeded.
- **FR-012**: The system MUST avoid duplicate alerts for the same title and the same user on the same device.
- **FR-013**: On firing, the system MUST record which platform(s) triggered the alert in order to show them in the notice.
- **FR-014**: The system MUST NOT require its own backend in the MVP; any push capability depends on browser APIs and local or background processing of the PWA.

### Key Entities

- **Alert**: User preference for a title in Argentina; statuses: active, triggered, paused (optional), deleted; creation date; last check; target platforms (derived from "Mis plataformas" at check time).
- **Trigger event**: Record that an alert was fulfilled, with title, detected platform, date/time, and whether a native notification or only in-app was sent.
- **Notification preference**: Whether the user granted, denied, or has not yet decided browser permissions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create an alert from a title detail page in less than 20 seconds (including the optional permission).
- **SC-002**: 100% of created alerts appear in "Mis alertas" after reloading the app on the same device.
- **SC-003**: When availability changes according to Argentina data, 90% of the agreed manual tests fire the alert on the next scheduled check (app open or background cycle).
- **SC-004**: With permission granted, on firing, the user receives a native notification in less than 5 seconds from detection during an active session or background check.
- **SC-005**: No alert generates more than one native notification for the same availability event.
- **SC-006**: On tapping a notification or a triggered item, the user reaches the correct detail page in a single step.

## Assumptions

- The "Mis plataformas" feature (001) exists: alerts use that selection; without configured platforms, alerts are not created.
- Backend-less MVP: detection happens on the client (on app open and, where the browser allows it, background checks of the PWA). Instant push with the app closed for days is not promised as a server-backed service.
- Availability comes from the same trusted product source for Argentina; the alert does not add new catalogs.
- Default free limit: 3 active alerts (aligned with the pitch); premium is out of scope.
- The existing button on the detail page ("Avisame…") is aligned to "Avisame cuando esté en mis plataformas".
- An installable PWA improves the background check experience but is not required to create alerts.
- Email and full-catalog premiere alerts are left for a future spec.

## Out of Scope

- User accounts, multi-device sync, and an own push server.
- Alerts by genre, by global premiere, or by price drop.
- Email as a notification channel.
- NestJS backend, queues, and server jobs (unless an explicit future spec).
- Alerts when the title arrives on a platform the user does **not** have subscribed (only "mis plataformas").
