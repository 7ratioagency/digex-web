# Digex — Visual Language V2 (matched to Instagram brand)

Derived from the agency's actual Instagram posters. **This supersedes the dark-canvas direction in DESIGN.md** — that was chasing other agencies' aesthetics. This one matches the brand that already exists.

---

## The core realisation

The posters are **light-based, not dark**. Off-white / light grey backgrounds with electric blue and deep navy as the accent colours — the opposite of the near-black canvas we'd been building. That mismatch is why the dark experiments never felt "right" for Digex specifically.

There is a dark variant in the system (the ERP poster: deep navy gradient, white type), but it's the *exception*, used for specific heavier topics — not the default.

---

## 1. Palette (read from the posters)

```css
--paper:        #F2F2F0;  /* off-white poster base — NOT pure white */
--paper-warm:   #EDEDEB;
--blue-500:     #2B4BFF;  /* electric brand blue — the hero accent */
--blue-600:     #1E3AE0;
--navy-900:     #0A1E5C;  /* deep navy — device screens, dark sections */
--navy-950:     #061436;
--ink:          #0B0B0D;  /* near-black display type */
--highlight-yellow: #FFE81A; /* marker highlight behind key words */
```

Ratio in practice: ~70% light paper, ~20% navy/dark elements, ~10% electric blue accent. Blue is used as a *punch*, not as a wash.

---

## 2. Signature elements (the "vibe")

These are what make a poster instantly recognisable as Digex. Each needs a web equivalent.

### a. Glass bubbles ⭐ (the one the client specifically loved)
Photoreal transparent glass spheres with real refraction, caustics and soft contact shadows — floating at varying scales, some large and cropped by the frame, some small. They read as premium because they're *rendered*, not CSS circles.

Web translation: use actual PNG/WebP renders with transparency, floating and drifting slowly with parallax on scroll. A CSS circle with a blur will not reproduce this — it needs the real asset.

### b. Blue spiral vortex orbs
Swirling concentric blue spiral shapes, motion-blurred, like a vortex or ripple. Usually paired opposite a glass bubble for balance.

Web translation: PNG render, slow continuous rotation, low-opacity, behind content.

### c. Marker highlights on key words
Three variants seen across posters:
- Yellow marker swipe behind an Arabic word (`براند`)
- Solid electric-blue block behind a word, white text knocked out (`بيع`)
- Heavy underline beneath a word (`?Online`)

Web translation: animate the highlight *drawing in* on scroll — the swipe wipes across, the block scales in. This is a cheap, very high-impact signature.

### d. 3D device mockups
Floating laptops/monitors/phones showing real Digex work, with soft realistic shadows, often at a slight angle or in a fanned multi-screen arrangement.

Web translation: these become the portfolio/service page hero imagery. Reuse actual poster renders where they exist.

### e. Bold bilingual display type
Heavy black Arabic set against Latin, mixed within a single headline. High weight, tight spacing, strong size contrast between the two scripts.

---

## 3. Rules

1. **Light is the default.** Sections default to `--paper`, not white and not black. Dark navy sections are an accent used sparingly for contrast/rhythm — roughly one dark section per two or three light ones.
2. **Blue is a punch, not a background.** No full-page blue gradients — electric blue appears in highlight blocks, CTAs, icons, spiral orbs, and type accents.
3. **Every floating object must have a real shadow.** The posters' depth comes from contact shadows under bubbles and devices — flat elements will immediately look off-brand.
4. **Use the real renders.** Glass bubbles and spiral orbs must be exported PNGs from the poster source files, not CSS approximations.

---

## 4. Open items (need input / assets)

- Source files or high-res exports of: glass bubbles, blue spiral orbs, device mockups
- Real service pricing (must not be invented)
- Which service pages get which existing project work