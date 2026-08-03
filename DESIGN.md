# Digex — Design Language (Round 0)

This is the single source of visual truth. Every UI prompt after this one references this file instead of re-deciding style. Save as `DESIGN.md` in the repo root, next to `CLAUDE.md`.

**Direction:** clean, premium, glassy. Signature electric-blue gradient derived from the Digex logo. Not playful, not corporate-boring — confident and a little cinematic.

---

## 1. Colour system

Derived from the logo gradient (adjust hex values with an eyedropper on the real logo file for exact match — these are close approximations):

```css
:root {
  /* Brand blue ramp */
  --brand-100: #E8EDFF;
  --brand-300: #A8B9FF;
  --brand-400: #6E8CFF;
  --brand-500: #3B63FF;   /* primary */
  --brand-600: #2645E0;
  --brand-700: #1B3AD6;
  --brand-900: #14259C;

  /* Signature gradient — use for hero bg, key accents, CTA glow */
  --gradient-signature: linear-gradient(135deg, var(--brand-400) 0%, var(--brand-500) 45%, var(--brand-900) 100%);

  /* Neutrals — never pure black/white, always slightly tinted toward brand */
  --ink-950: #05060D;   /* dark bg */
  --ink-900: #0B0E1A;
  --ink-100: #F5F7FF;   /* light bg, faint blue tint, NOT pure white */
  --ink-0:   #FFFFFF;

  /* Glass surface tokens */
  --glass-bg-dark: rgba(255,255,255,0.05);
  --glass-bg-light: rgba(255,255,255,0.55);
  --glass-border: rgba(255,255,255,0.14);
  --glass-blur: 20px;
}
```

Rule: text on the hero must always resolve to a contrast ratio of at least 7:1 against whatever sits behind it at that scroll position. This is the exact bug spotted in the current build — fix it as part of this pass, not as an afterthought.

## 2. Glass panel spec (the signature texture)

Every card, nav bar, and floating element uses this recipe — this consistency is what reads as "designed" rather than "assembled":

```css
.glass {
  background: var(--glass-bg-dark);
  backdrop-filter: blur(var(--glass-blur)) saturate(140%);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.08) inset,
    0 20px 40px -20px rgba(20,37,156,0.35);
}
```

On light mode, swap `--glass-bg-dark` for `--glass-bg-light` and soften the shadow.

## 3. Background treatment

No flat solid backgrounds anywhere. The hero and section transitions use one of:

- A slow-moving animated gradient mesh (2-3 soft blurred blobs in `--brand-400`/`--brand-700`, drifting, on a `--ink-950` or `--ink-100` base)
- A subtle grain/noise overlay at ~4% opacity over everything (single repeating SVG/PNG texture, mix-blend-mode: overlay) — this alone is what makes flat digital gradients look premium instead of cheap
- Optional: a faint version of the logo's fold-geometry as an oversized, low-opacity watermark shape in a back layer

## 4. Typography

- Display/headlines: a font with real character — **Clash Display**, **General Sans**, or **Satoshi** for Latin; **IBM Plex Sans Arabic** (bold/black weight) for Arabic headlines — avoid default Inter/system-ui for anything above body text
- Body: Inter (Latin) / IBM Plex Sans Arabic (Arabic) at regular weight
- Headline sizing: dramatic scale jump from body — hero headline should be huge (clamp(2.5rem, 6vw, 6rem)), not a modest bump
- Tight letter-spacing on large headlines (-0.02em), never default tracking at display size

## 5. Motion signature

- Buttons: magnetic hover (slight pull toward cursor) + glow that follows cursor on the primary CTA
- Custom cursor on desktop only: small dot + trailing ring, snaps to a larger circle on interactive elements
- Section reveals: content rises 24px + fades in, once, on scroll — already defined in CLAUDE.md, keep it
- Hero background: continuous slow ambient motion (the gradient blobs), independent of scroll — this is what makes a hero feel "alive" instead of a static image

## 6. What "premium" means here, concretely

If a reviewer can't articulate why it looks premium, it isn't specific enough. The concrete, buildable answers are: depth (glass layering + soft coloured shadows, not flat cards), texture (grain overlay, never perfectly flat colour), restraint (one signature gradient reused everywhere, not five different colours), and motion quality (slow, physical easing — not linear, not bouncy).

## 7. Non-goals

- No confetti/bouncy animations
- No more than one accent gradient in the whole palette
- No stock-photo-style illustrations
- Never sacrifice text contrast for aesthetic — fix the current hero contrast bug as part of Round 0