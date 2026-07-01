# PeliGo — Complete Visual Identity

## 1. Brand Philosophy

PeliGo is **cinematic immediacy**. The brand conveys speed, precision, and modern entertainment. Born in Argentina, thinking about LATAM. It's the instant answer to "¿dónde lo veo?" (where can I watch it?).

**Brand keywords:** Entertainment · Immediacy · Precision · Trust · Modernity

---

## 2. Color Palette

### 2.1 Primary Colors

| Name             | HEX       | RGB              | Primary use                          |
|------------------|-----------|------------------|--------------------------------------|
| **PeliGo Red**   | `#E63946` | rgb(230, 57, 70) | CTAs, accents, interactive elements   |
| **Night Purple** | `#6C2BD9` | rgb(108, 43, 217)| Gradients, highlights, branding      |
| **Cinema Black** | `#0D0D0D` | rgb(13, 13, 13)  | Main dark mode backgrounds           |

### 2.2 Secondary Colors

| Name                | HEX       | RGB                | Primary use                         |
|---------------------|-----------|--------------------|-------------------------------------|
| **Screen Gray**     | `#1A1A2E` | rgb(26, 26, 46)   | Secondary backgrounds, cards        |
| **Mid Gray**        | `#2D2D44` | rgb(45, 45, 68)   | Borders, separators, inputs         |
| **Soft Gray**       | `#8E8EA0` | rgb(142, 142, 160)| Secondary text, placeholders        |
| **Smoke White**     | `#F0F0F5` | rgb(240, 240, 245)| Primary text in light mode          |
| **Pure White**      | `#FAFAFA` | rgb(250, 250, 250)| Light mode backgrounds              |

### 2.3 Functional Colors

| Name             | HEX       | Use                               |
|------------------|-----------|------------------------------------|
| **Success**      | `#10B981` | Confirmations, available           |
| **Warning**      | `#F59E0B` | Alerts, content leaving soon       |
| **Error**        | `#EF4444` | Errors, unavailable                |
| **Info**         | `#3B82F6` | Information, tips                  |

### 2.4 Gradients

```css
/* Primary gradient — used in headers, hero CTAs */
--gradient-primary: linear-gradient(135deg, #E63946 0%, #6C2BD9 100%);

/* Soft gradient — used in decorative backgrounds */
--gradient-soft: linear-gradient(180deg, #1A1A2E 0%, #0D0D0D 100%);

/* Card hover gradient */
--gradient-hover: linear-gradient(135deg, rgba(230,57,70,0.15) 0%, rgba(108,43,217,0.15) 100%);

/* Gradient for premium badges */
--gradient-premium: linear-gradient(135deg, #F59E0B 0%, #E63946 100%);
```

### 2.5 Color Usage Rules

1. **PeliGo Red** only for actionable elements (buttons, links, interactive icons). Never as an extensive background.
2. **Night Purple** as a complement to red, never as the dominant color. Ideal for gradients and details.
3. In dark mode, the main background is `#0D0D0D`, cards are `#1A1A2E`, borders are `#2D2D44`.
4. Primary text in dark mode: `#F0F0F5`. Secondary text: `#8E8EA0`.
5. Minimum contrast ratio: **4.5:1** for normal text, **3:1** for large text (WCAG AA).
6. Do not use red on purple or purple on red directly (low contrast).
7. Gradients are only applied on decorative surfaces, never beneath body text.

---

## 3. Typography

### 3.1 Primary Typeface — **Inter**
- **Font:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- **Use:** Body text, UI, forms, navigation
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Rationale:** Excellent on-screen legibility, full support for Latin characters, designed for UI.

### 3.2 Display Typeface — **Space Grotesk**
- **Font:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Google Fonts)
- **Use:** Titles, headings, logo wordmark, hero sections
- **Weights:** 500 (Medium), 700 (Bold)
- **Rationale:** Modern personality, geometric yet friendly, distinct from Inter for hierarchy.

### 3.3 Type Scale

| Token        | Size   | Weight | Line Height | Use                     |
|-------------|--------|------|-------------|-------------------------|
| `display-xl`| 48px   | 700  | 1.1         | Hero, splash            |
| `display-lg`| 36px   | 700  | 1.15        | Section titles          |
| `heading-lg`| 28px   | 700  | 1.2         | Screen titles           |
| `heading-md`| 22px   | 600  | 1.25        | Subtitles               |
| `heading-sm`| 18px   | 600  | 1.3         | Card titles             |
| `body-lg`   | 16px   | 400  | 1.5         | Primary text            |
| `body-md`   | 14px   | 400  | 1.5         | Secondary text          |
| `body-sm`   | 12px   | 400  | 1.4         | Captions, labels        |
| `caption`   | 11px   | 500  | 1.3         | Metadata, badges        |

---

## 4. Spacing & Grid System

### 4.1 Base Unit
**Base:** 4px. All spacing is a multiple of 4.

### 4.2 Spacing Scale

| Token   | Value | Typical use                          |
|---------|-------|--------------------------------------|
| `xs`    | 4px   | Minimal internal spacing             |
| `sm`    | 8px   | Internal padding of badges/chips     |
| `md`    | 12px  | Gap between related elements         |
| `lg`    | 16px  | Padding of cards, inputs             |
| `xl`    | 24px  | Spacing between sections             |
| `2xl`   | 32px  | Margin between blocks                |
| `3xl`   | 48px  | Spacing between large sections       |
| `4xl`   | 64px  | Hero spacing, page padding           |

### 4.3 Grid System

**Mobile (< 768px):**
- Columns: 4
- Gutter: 16px
- Side margin: 16px
- Max width: 100%

**Tablet (768px – 1024px):**
- Columns: 8
- Gutter: 24px
- Side margin: 32px

**Desktop (> 1024px):**
- Columns: 12
- Gutter: 24px
- Side margin: auto
- Max width: 1200px

### 4.4 Border Radius

| Token       | Value | Use                          |
|-------------|-------|-------------------------------|
| `radius-sm` | 6px   | Chips, badges, tags           |
| `radius-md` | 10px  | Inputs, buttons, selects      |
| `radius-lg` | 16px  | Cards, modals                 |
| `radius-xl` | 24px  | Large cards, containers       |
| `radius-full`| 9999px| Avatars, circular icons      |

---

## 5. Shadows

```css
/* Subtle — cards at rest */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);

/* Medium — card hover, dropdowns */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);

/* Strong — modals, overlays */
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);

/* Red glow — primary buttons hover */
--shadow-glow-red: 0 4px 20px rgba(230, 57, 70, 0.35);

/* Purple glow — premium elements */
--shadow-glow-purple: 0 4px 20px rgba(108, 43, 217, 0.3);
```

---

## 6. Base Components

### 6.1 Buttons

**Primary Button**
- Background: `#E63946`
- Text: `#FAFAFA`, Inter 600, 14px
- Padding: 12px 24px
- Border radius: 10px
- Hover: red glow shadow, background `#D32F3F`
- Active: scale(0.98)
- Disabled: opacity 0.4, cursor not-allowed

**Secondary Button**
- Background: transparent
- Border: 1.5px solid `#E63946`
- Text: `#E63946`, Inter 600, 14px
- Hover: background `rgba(230,57,70,0.1)`

**Ghost Button**
- Background: transparent
- Text: `#8E8EA0`, Inter 500, 14px
- Hover: text `#F0F0F5`

**Icon Button**
- Size: 40x40px
- Border radius: radius-full
- Background: `#1A1A2E`
- Icon: 20px, `#F0F0F5`

### 6.2 Cards

**Movie/Series Card**
- Background: `#1A1A2E`
- Border radius: 16px
- Overflow: hidden
- Image: aspect-ratio 2:3 (poster)
- Content padding: 12px
- Shadow: shadow-sm
- Hover: shadow-md + gradient-hover border
- Transition: 200ms ease

**Platform Availability Card**
- Background: `#1A1A2E`
- Border: 1px solid `#2D2D44`
- Border radius: 12px
- Layout: platform logo + type (stream/rent/buy) + price
- Quality badge: chip with radius-sm

### 6.3 Modals

- Overlay: rgba(0, 0, 0, 0.7), backdrop-filter: blur(8px)
- Modal: background `#1A1A2E`, border-radius 24px
- Padding: 24px
- Max width: 480px (mobile: 100% - 32px)
- Entrance animation: fadeIn + slideUp 300ms ease
- Close button: top-right corner, icon button

### 6.4 Tabs

- Style: underline tabs
- Inactive: text `#8E8EA0`, no underline
- Active: text `#E63946`, underline 2px `#E63946`
- Hover: text `#F0F0F5`
- Underline transition: 200ms ease with motion

### 6.5 Inputs

- Background: `#2D2D44`
- Border: 1.5px solid transparent
- Focus: border `#6C2BD9`, subtle purple glow shadow
- Text: `#F0F0F5`, Inter 400, 16px
- Placeholder: `#8E8EA0`
- Padding: 12px 16px
- Border radius: 10px
- Search icon: 20px, `#8E8EA0`

### 6.6 Chips / Tags

- Background: `rgba(230,57,70,0.15)`
- Text: `#E63946`, Inter 500, 12px
- Padding: 4px 10px
- Border radius: 6px
- Genre variants: functional colors

---

## 7. Dark Mode & Light Mode

### 7.1 Dark Mode (Preferred)

| Element            | Color       |
|--------------------|-------------|
| Background page    | `#0D0D0D`  |
| Background card    | `#1A1A2E`  |
| Background input   | `#2D2D44`  |
| Primary text       | `#F0F0F5`  |
| Secondary text     | `#8E8EA0`  |
| Borders            | `#2D2D44`  |
| Accents            | `#E63946`  |

### 7.2 Light Mode

| Element            | Color       |
|--------------------|-------------|
| Background page    | `#FAFAFA`  |
| Background card    | `#FFFFFF`  |
| Background input   | `#F0F0F5`  |
| Primary text       | `#0D0D0D`  |
| Secondary text     | `#6B6B80`  |
| Borders            | `#E0E0E8`  |
| Accents            | `#D32F3F`  |

### 7.3 Transition Rules
- Transition between modes: 200ms on background-color and color.
- Images and posters are not altered.
- Shadows in light mode: softer (opacity 0.1 instead of 0.3).
- Gradients keep the same colors in both modes.

---

## 8. Iconography

### 8.1 Icon System
- **Base library:** [Lucide Icons](https://lucide.dev/) (open source, consistent, lightweight)
- **Style:** Outline, stroke 1.5px
- **Sizes:** 16px (inline), 20px (UI), 24px (navigation), 32px (features)
- **Color:** inherits from text or accent depending on context

### 8.2 Main App Icons

| Concept         | Suggested icon        |
|----------------|-----------------------|
| Search         | `Search`              |
| Home           | `Home`                |
| Trends         | `TrendingUp`          |
| Favorites      | `Heart`               |
| Profile        | `User`                |
| Alerts         | `Bell`                |
| Platform       | `Tv`                  |
| Play           | `Play`                |
| Filter         | `SlidersHorizontal`   |
| Share          | `Share2`              |
| Settings       | `Settings`            |

### 8.3 Platform Logos
- Always display the official logos of the streaming platforms.
- Standardized size: 32x32px in lists, 48x48px in detail views.
- Neutral circular background (`#2D2D44`) with 6px padding if the logo requires it.

### 8.4 Illustrations
- Style: flat, monochromatic with a red/purple accent.
- Use: empty states, onboarding, 404 error.
- Clean lines, no excessive detail.
- Maximum 2-3 colors per illustration.

---

## 9. Animations & Micro-interactions

| Interaction              | Animation                                    | Duration  |
|--------------------------|----------------------------------------------|-----------|
| Page transition          | Fade + horizontal slide                      | 300ms     |
| Card hover               | Scale(1.02) + shadow elevation               | 200ms     |
| Button click             | Scale(0.97) → Scale(1)                       | 150ms     |
| Tab switch               | Underline slide                              | 200ms     |
| Modal open               | Fade overlay + slide up modal                | 300ms     |
| Modal close              | Fade out + slide down                        | 200ms     |
| Skeleton loading         | Shimmer gradient pulse                       | 1.5s loop |
| Toast notification       | Slide in from top + auto dismiss             | 300ms in, 5s stay |
| Heart favorite           | Scale bounce + color fill                    | 300ms     |
| Search results           | Stagger fade-in children                     | 50ms each |
| Pull to refresh          | Rotate spinner + elastic bounce              | --        |

**Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` for most. Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`.

---

## 10. Accessibility (WCAG AA)

1. **Contrast:** All text meets a minimum ratio of 4.5:1 (normal) and 3:1 (large/bold).
2. **Visible focus:** 2px offset ring in `#6C2BD9` for all interactive elements.
3. **Minimum touch size:** 44x44px for tap targets.
4. **ARIA roles:** All custom components carry semantic roles.
5. **Keyboard navigation:** Logical tab order, skip links.
6. **Reduced motion:** Respect `prefers-reduced-motion` by disabling animations.
7. **Alt text:** All poster images include the title + year.
8. **Labels:** Inputs always have an associated label (visible or sr-only).
9. **Color is not the only indicator:** Always pair color with an icon or text.

---

## 11. Design Tokens (CSS Custom Properties)

```css
:root {
  /* Colors */
  --color-primary: #E63946;
  --color-primary-hover: #D32F3F;
  --color-secondary: #6C2BD9;
  --color-bg-primary: #0D0D0D;
  --color-bg-secondary: #1A1A2E;
  --color-bg-tertiary: #2D2D44;
  --color-text-primary: #F0F0F5;
  --color-text-secondary: #8E8EA0;
  --color-border: #2D2D44;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Typography */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;
  --space-4xl: 64px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="light"] {
  --color-bg-primary: #FAFAFA;
  --color-bg-secondary: #FFFFFF;
  --color-bg-tertiary: #F0F0F5;
  --color-text-primary: #0D0D0D;
  --color-text-secondary: #6B6B80;
  --color-border: #E0E0E8;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
}
```
