# Design Directions — Gym Workout Tracker

## Three stylistic approaches

### Approach A — **Training Ledger**
**Very Brief Intro:** A disciplined, editorial training journal inspired by embossed gym logbooks, technical measurement cards, and warm paper stock. It feels trustworthy and calm under the pressure of a live workout.

**Probability:** 0.06

### Approach B — **Signal Room**
**Very Brief Intro:** A dark, data-forward control surface with electric indicators and high-contrast graph lines. It feels like monitoring a performance system rather than filling out a form.

**Probability:** 0.03

### Approach C — **Sunlit Studio**
**Very Brief Intro:** A light, architectural wellness workspace using limestone, ink, and restrained olive accents. It emphasizes sustainable consistency over athletic intensity.

**Probability:** 0.08

## Chosen approach — Training Ledger

### Design Movement
Contemporary **editorial utilitarianism**: the clarity of a printed training log rebuilt as a tactile mobile interface. The visual language draws from field notebooks, equipment labels, and precise mechanical measurement without becoming retro or industrial for its own sake.

### Core Principles
1. **Training is the foreground.** Weight, repetitions, exercise names, and state are always more prominent than decoration.
2. **Evidence earns visual emphasis.** Completed sets, previous performance, and trend changes use strong hierarchy; inactive options recede.
3. **Tactile, not toy-like.** Surfaces use crisp edges, subtle paper-like texture, and purposeful rules rather than uniformly soft cards.
4. **One-hand confidence.** Primary controls sit in reachable zones; numeric inputs are large, direct, and hard to misread.

### Color Philosophy
The base is **warm limestone** rather than sterile white, supporting focused use in changing gym light. Deep ink grounds text and navigation. A single mineral-green signal color represents confirmed action and positive training momentum, while oxblood is reserved for destructive or cautionary actions. Color is functional—never a substitute for labels or state.

### Layout Paradigm
A **stacked training sheet** rather than a centered dashboard. Mobile screens flow like consecutive entries in a logbook: contextual header, a primary workout action, an active record sheet, and a lower status strip. On larger displays, a narrow rail carries navigation while the training sheet stays left-anchored and spacious.

### Signature Elements
1. **Ledger rules:** fine horizontal separators and section index labels organize each screen.
2. **Set stamps:** completed sets receive compact square number marks rather than generic check icons.
3. **Metric strips:** high-value summaries appear as aligned, label-first measurement rows.

### Interaction Philosophy
Interactions should feel like marking a page: an entered set receives an immediate tactile confirmation, and completion states become visibly settled. High-frequency actions stay near-instant. Destructive actions ask for a lightweight, explicit confirmation.

### Animation
Use 120–220 ms transform-and-opacity transitions with a crisp ease-out. Newly saved sets slide upward by a few pixels and settle, while status stamps fade in. Charts may draw on first view only. Respect `prefers-reduced-motion` by removing nonessential transitions. Never animate measurement values in a way that impairs legibility.

### Typography System
**DM Sans** is the functional body face for controls, weights, and content. **Fraunces** provides a sharply distinctive editorial display voice for major headings and the wordmark. Use uppercase tracked micro-labels for metadata, robust tabular numerals where available for logged sets, and avoid generic all-purpose UI typography.

### Brand Essence
**A personal training record for lifters who value accurate history over fitness noise.**

Personality: **disciplined, grounded, precise.**

### Brand Voice
Headlines are short, factual, and encouraging without hype. CTAs use direct verbs and microcopy explains states plainly.

> “Train what you planned. Record what you did.”

> “Your last Bench Press: 60 kg × 10.”

### Wordmark & Logo
The mark is a compact **offset plate-and-rule glyph**: a square training card intersected by a single heavy horizontal bar, creating a recognizable abstract “L” for Ledger. The wordmark combines a high-contrast Fraunces “L” with firm DM Sans capitals; it is not a default-font treatment.

### Signature Brand Color
**Ledger Green — `#3E6D57`**. This mineral, understated green is reserved for completed work, primary actions, and progress signals.

## Style Decisions

- Primary UI text never sits directly on imagery.
- Workout logging favors explicit labels and values over icon-only controls.
- Cards are used sparingly; structural rules and paper-like surfaces carry hierarchy.
- The dashboard remains responsive, but the active workout flow is designed mobile-first as the main product experience.
- Every route carries the offset plate-and-rule glyph with the Fraunces/DM Sans Training Ledger wordmark as a persistent product anchor.
- Logged work uses label-first metric rows, tabular numerals, and square Ledger stamps; generic decorative icons remain secondary.
- Ledger Green remains reserved for primary actions, completed work, and progress signals, while planned and empty states rely on ink, limestone, rules, and labels.
