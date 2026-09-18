# Design Brief

## Direction

Terminal Blue — a typography-led, aviation-ops-inspired visual system for an independent U.S. travel agency, built for trust and fast phone conversion.

## Tone

Editorial-operational: calm, precise, and credible like a departure board — confident structure and generous whitespace instead of stock-photo gloss.

## Differentiation

The departure-board signature: monospace uppercase micro-labels with wide tracking, paired with outlined step numerals and a navy/burnt-orange split that reads as operations, not marketing.

## Color Palette

| Token      | OKLCH         | Role                                    |
| ---------- | ------------- | --------------------------------------- |
| background | 0.975 0.004 95  | Warm paper white page base            |
| foreground | 0.255 0.045 250 | Deep ink navy text, 12:1 on background |
| card       | 1 0 0           | Pure white elevated surfaces           |
| primary    | 0.33 0.06 249   | Ink-navy CTAs, header, footer          |
| accent     | 0.56 0.155 45   | Burnt signal orange, micro-labels only |
| muted      | 0.945 0.008 250 | Cool grey section bands, secondary text |

## Typography

- Display: Space Grotesk — H1/H2/H3, wordmark, step numerals; tight tracking, bold weights
- Body: DM Sans — paragraphs, nav, forms, buttons; 16–18px base
- Mono: JetBrains Mono — `.label-board` micro-labels, phone numbers, departure-board rows
- Scale: hero `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight`, h2 `text-3xl md:text-4xl font-bold tracking-tight`, label `label-board text-accent`, body `text-base md:text-lg text-muted-foreground`

## Elevation & Depth

Flat paper base with white cards lifted by 1px hairline borders and one soft `shadow-elevated` tier; depth comes from layered surfaces and section banding, never glow or heavy drop shadows.

## Structural Zones

| Zone    | Background        | Border        | Notes                                                          |
| ------- | ----------------- | ------------- | -------------------------------------------------------------- |
| Header  | `bg-background/95` + backdrop blur | `border-b` | Sticky; wordmark left, nav center, navy call pill right |
| Content | `bg-background` alternating `bg-muted/40` | — | Hero on paper, services on white cards, How-it-works on muted band, FAQ on white |
| Footer  | `bg-primary` (ink navy) | `border-t` | Light text, 4 columns, independent-agency disclosure, mono contact rows |

## Spacing & Rhythm

Sections use `py-16 md:py-24` with `max-w-6xl` containers; 8px micro-spacing inside cards, 24–32px card padding, 12px radius on cards and pills for CTAs.

## Component Patterns

- Buttons: pill (`rounded-full`), navy fill with white text; secondary is ghost with `border-border`; hover darkens fill and lifts `shadow-subtle`, 200ms
- Cards: `rounded-xl bg-card border border-border shadow-subtle`, hover to `shadow-elevated` with `-translate-y-0.5`
- Badges: `label-board` pill or bare text in accent orange; never filled saturated blocks

## Motion

- Entrance: `animate-fade-up` on hero and section headers, 500ms staggered, respects `prefers-reduced-motion`
- Hover: 200–300ms color/translate transitions via `transition-smooth` on cards, links, buttons
- Decorative: `animate-pulse-soft` on the 24/7 availability dot; no looping motion elsewhere

## Constraints

- Mobile-first: single column, hamburger drawer, thumb-reachable sticky call CTA
- AA+ contrast in both light and dark; body text ≥ 4.5:1, never rely on opacity
- No airline logos, no fake reviews/ratings/urgency/discounts, no outbound airline booking links
- Typography-led: imagery limited to hero plus one or two sections with descriptive alt text
- Tokens only in components — no hex, `rgb()`, or arbitrary color classes

## Signature Detail

The departure-board typographic system — tracked monospace micro-labels, outlined step numerals, and hairline-ruled rows — turns the phone-first conversion flow into something that reads like a flight information board.
