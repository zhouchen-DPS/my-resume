# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal website for Zhou Chen. No build step — open `index.html` directly in a browser to preview. Deployed via GitHub Pages.

## Architecture

Single-page application with five anchor-linked sections in one `index.html`:

```
#hero → #strengths → #journey → #projects → #footer
```

**File layout:**
- `index.html` — all markup and section content
- `css/style.css` — all styles (no preprocessor)
- `js/main.js` — all interactivity and animations
- `assets/images/` — `hero-photo.png` (transparent-bg cutout), `wechat-qr.png`

**External dependencies (CDN, no npm):**
- [AOS 2.3.1](https://unpkg.com/aos@2.3.1) — scroll-triggered fade/slide animations
- [GSAP 3.12.2 + ScrollTrigger](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/) — hero parallax, timeline line growth
- [Lucide (latest)](https://unpkg.com/lucide@latest) — icons in the Strengths section; initialized via `lucide.createIcons()` at the bottom of `main.js`
- Google Fonts — Inter, Poppins, Noto Sans SC

## Key Design Tokens (CSS custom properties in `:root`)

| Variable | Value | Usage |
|---|---|---|
| `--primary` | `#4A7C8A` | Main color, dots, tags |
| `--accent` | `#E8913A` | CTA buttons, icons, motto text |
| `--bg-white` | `#FAFBFC` | Hero, Journey section backgrounds |
| `--bg-gray` | `#F0F4F5` | Strengths, Projects section backgrounds |
| `--text-dark` | `#2C3E50` | Footer background, headings |

## Responsive Breakpoints

- `≥ 1024px` — full desktop layout
- `768–1023px` — tablet adjustments (padding reduction)
- `< 768px` — mobile: hamburger menu, stacked columns, hero image centered
- Strengths grid uses `repeat(auto-fit, minmax(320px, 1fr))` for fluid reflow

## Hero Section Layer Structure

Three stacked layers (bottom to top), all children of `<section id="hero">`:

| Layer | Element | z-index | Notes |
|---|---|---|---|
| 1 — Background | `.hero-bg#heroBg` | auto | Dark teal gradient; contains orbs + noise pseudo-element |
| 1.5 — Dot Grid | `.hero-dotgrid` | 0 | Between bg and person; pure CSS dot pattern |
| 2 — Person photo | `.hero-person#heroPerson` | 1 | PNG cutout with bottom fade mask |
| 3 — Text content | `.hero-content` | 2 | Always above person |

### Hero Visual Effects

**Mesh Gradient Orbs** — three `<div class="hero-orb hero-orb--N">` inside `.hero-bg`:
- Orb 1 (light blue, 600px, `blur(90px)`): `orbDrift1` 28s
- Orb 2 (purple, 500px): `orbDrift2` 34s
- Orb 3 (cyan, 400px): `orbDrift3` 22s
- No `mix-blend-mode` — opacity carried by `radial-gradient` color stops (0.35–0.55)

**Noise Texture** — `.hero-bg::after` pseudo-element:
- SVG `feTurbulence` (`fractalNoise`, baseFrequency 0.75, 4 octaves) as `background-image` data URI
- `background-size: 180px`, `opacity: 0.12`; no blend mode (avoids compositing layer issues)

**Dot Grid** — `.hero-dotgrid`:
- `radial-gradient` 1.5px white dots, `background-size: 28px 28px`
- Fades at edges via single `mask-image: radial-gradient(ellipse 80% 80% ...)`

> **Avoid `mix-blend-mode`** on elements inside `.hero-bg`: it has `will-change: transform` which creates an isolated compositing layer, causing blend modes to fail unexpectedly.

## Strengths Section

**Glassmorphism cards** (`.strength-card`):
- `background: rgba(255,255,255,0.55)`, `backdrop-filter: blur(16px)`, `border-radius: 20px`
- Hover: `translateY(-10px)` + deeper `box-shadow`, `transition: 0.35s`

**Slide-in animation** — NOT using AOS; driven by custom IntersectionObserver in `main.js`:
- `#strengthsColLeft` → adds `.animate-left` class (CSS `@keyframes slideFromLeft`, delay 0.05s)
- `#strengthsColRight` → adds `.animate-right` class (CSS `@keyframes slideFromRight`, delay 0.25s)
- Columns start `opacity: 0`; animation sets final state to `opacity: 1`

**Animated background** — `#strengths` itself:
- `background-size: 400% 400%`, animated via `@keyframes bgDrift` (14s ease-in-out infinite)
- Colors cycle between `#edf2f4`, `#f0f4f5`, `#e8eef2`, `#f5f7f8`
- `.container` inside has `position: relative; z-index: 1` to stay above bg

## Journey Section (Timeline)

**Layout** — alternating left/right card layout using CSS flexbox `order`:
- Each `.timeline-item` has three flex children: `.tl-spacer` (date side), `.tl-axis` (center dot), `.tl-card` (content)
- Normal items: card on right. `.timeline-item--alt`: card on left (spacer order:1, card order:3 swapped)
- Center vertical track: `#timelineFill` grows height via GSAP ScrollTrigger `onUpdate`

**Timeline cards** (`.timeline-card`):
- Glassmorphism style: no border, subtle shadow, `border-radius: 16px`
- Entrance animation: start `opacity:0; transform:translateY(32px)`, transition to visible via `.card-visible` class
- IntersectionObserver (threshold 0.12) adds `.card-visible`; stagger via inline `transitionDelay` (`i * 0.08s`)
- Current role uses `.timeline-dot--current` and `.timeline-card--current` (teal left border accent)

**Timeline dot in-view** — dotObserver (rootMargin `-35% 0px -35% 0px`) toggles `.in-view` on `.timeline-dot`

**Date labels** (`.timeline-date`):
- Font: `Inter`, 13px, weight 400, color `var(--primary)`, `opacity: 0.85`
- Displayed in `.tl-spacer` on the opposite side from the card

**Journey Detail Modal** (`#journeyModal`):
- Opens when `.timeline-expand-btn` is clicked; reads company, role, date, and `.timeline-details` innerHTML dynamically
- Button label: "查看详细职责" (no arrow/chevron)
- Modal header structure:
  ```html
  <div class="journey-modal-header">
    <div class="journey-modal-company-row">   <!-- flex row -->
      <div class="journey-modal-company" id="journeyModalCompany"></div>
      <div class="journey-modal-date" id="journeyModalDate"></div>  <!-- right of company -->
    </div>
    <div class="journey-modal-role" id="journeyModalRole"></div>
  </div>
  ```
- `.journey-modal-date`: Inter, 12px, weight 400, `var(--primary)`, `opacity: 0.85`
- `.journey-modal-role`: capsule tag style (`#b8693a` color, low-saturation orange background)
- Close: X button, backdrop click, or ESC key

## Projects Section

**Project cards** (`.project-card`):
- `.card-achievements` is hidden by default (`max-height: 0`, `overflow: hidden`)
- `.card-expand-btn` click toggles `.open` class, uses `max-height` transition for smooth accordion
- Button text toggles between "查看项目达成 ↓" and "收起详情 ↑"
- 8 cards in a 2-column responsive grid

## Contact Floats

- **WeChat button** (`#wechatBtn`) → opens `#wechatModal` with QR code + phone number
- **Email button** (`#emailBtn`) → opens `#emailModal` showing `zhou_chen_@126.com` (no mailto link)
- Both modals: close via X button, backdrop click, or ESC

## JS Interaction Map (`main.js`)

| Feature | Mechanism |
|---|---|
| Hero entrance | GSAP timeline, animates opacity/translateY on `.hero-tag`, `.hero-name`, `.hero-subtitle`, `.hero-motto` |
| Parallax | GSAP ScrollTrigger on `#heroBg` (yPercent 28) and `#heroPerson` (yPercent 16) |
| Sticky nav | `scroll` event adds/removes `.scrolled` class on `#navbar` at `scrollY > 72` |
| Nav active state | IntersectionObserver with `rootMargin: '-40% 0px -58% 0px'` |
| Strengths slide-in | IntersectionObserver (threshold 0.15) on `#strengthsColLeft/Right`; adds `.animate-left/.animate-right` once |
| Timeline fill | ScrollTrigger `onUpdate` sets `height %` on `#timelineFill` |
| Timeline card entrance | IntersectionObserver (threshold 0.12); adds `.card-visible`; stagger via `transitionDelay` |
| Timeline dot in-view | IntersectionObserver (rootMargin `-35% 0px -35% 0px`) toggles `.in-view` on dots |
| Journey modal | `.timeline-expand-btn` click populates and opens `#journeyModal` from card data |
| Project expand | Click `.card-expand-btn` toggles `.open` on sibling `.card-achievements` |
| WeChat modal | `#wechatBtn` → `#wechatModal.open`; close on overlay click or ESC |
| Email modal | `#emailBtn` → `#emailModal.open`; same close behavior (shows email address only, no mailto) |
| Mobile menu | `#hamburger` → `#mobileOverlay.open`; `document.body.style.overflow` toggled |

## Content Update Guide

- **Strengths icons** — use Lucide icon names (`data-lucide="..."`) on `<i class="item-icon">` elements; `lucide.createIcons()` renders them
- **Timeline entries** — add `.timeline-item` / `.timeline-item--alt` blocks alternately inside `.timeline`; current role uses `.timeline-dot--current` and `.timeline-card--current`
- **Project cards** — add `.project-card` inside `.projects-grid`; `.card-achievements` is hidden by default and toggled via JS
- **Hero orb tuning** — adjust opacity in `radial-gradient` color stops and `filter: blur()` value; do NOT use `mix-blend-mode` (see note above)
