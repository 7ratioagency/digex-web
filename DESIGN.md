# Digex — Visual Language V2 (matched to Instagram brand)

Derived from the agency's actual Instagram posters. **This supersedes the dark-canvas direction in DESIGN.md** — that was chasing other agencies' aesthetics. This one matches the brand that already exists.

---

## The core realisation

The posters are **light-based, not dark**. Off-white / light grey backgrounds with electric blue and deep navy as the accent colours — the opposite of the near-black canvas we'd been building. That mismatch is why the dark experiments never felt "right" for Digex specifically.

**Light is the default and the brand's true face. Dark mode is the ERP poster, applied to the whole site.**

The split is by *mode*, never by section. An earlier version made navy a per-section accent *inside* light mode, which had a fatal flaw: the navy sections were already navy, so toggling the theme changed only the sections between them and the toggle read as broken. Navy is now the entire dark mode — deep navy base, white type, electric blue accents — and light mode contains no navy section backgrounds at all.

Section rhythm survives in both modes as a *tone*, not a colour block. `.section-alt` is `--paper-warm` on paper and `--navy-900` on navy: a soft warm/cool shift within the current mode, never a jump out of it. Services, Work and Contact carry it.

**The test for any theme change:** toggle on the homepage and confirm no section looks identical in both modes.

---

## 1. Palette (read from the posters)

```css
--paper:        #F2F2F0;  /* off-white poster base — NOT pure white */
--paper-warm:   #EDEDEB;
--blue-500:     #2B4BFF;  /* electric brand blue — the hero accent */
--blue-600:     #1E3AE0;  /* accent *text* — blue-500 is only 5.27:1 on paper */
--navy-900:     #0A1E5C;  /* deep navy — device screens, navy sections */
--navy-950:     #061436;
--ink:          #0B0B0D;  /* near-black display type */
--highlight-yellow: #FFE81A; /* marker highlight behind key words */
--violet-500:   #6A3CF0;  /* NOT a palette colour — see §2a */
```

Ratio in practice: ~70% light paper, ~20% navy/dark elements, ~10% electric blue accent. Blue is used as a *punch*, not as a wash.

`--violet-500` is not part of the poster palette and must never be used for type, fills or UI. It exists only to give the colour fields behind glass (§2a) a second hue to bend toward, so a card picks up a gradient rather than one flat blue. It leans off `--blue-500` deliberately, to stay inside the brand's own hue neighbourhood rather than introduce a second accent.

### Section rhythm

Sections alternate paper and navy so scrolling has contrast — roughly one navy per two or three paper:

| Hero | Problem | Services | Process | Work | Proof | Contact |
|---|---|---|---|---|---|---|
| paper | paper | **navy** | paper | **navy** | paper | **navy** |

Proof is paper deliberately: it is the client logo wall, and client logos are almost always supplied for light backgrounds — on navy, dark logos disappear.

A section becomes navy by gaining the `.on-navy` class, which re-points the semantic tokens (`--foreground`, `--muted-foreground`, `--border`, `--accent-blue`, and the glass group) rather than just painting a background. Descendants keep using the same classes they already had and resolve correctly on either surface, so moving a section between paper and navy never touches its markup.

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

### f. Glass cards (UI surfaces) ⭐
Distinct from the glass *bubbles* in (a): those are decorative objects, these are the panels real content sits in — service cards, problem cards, process panels, the nav pill.

**Glass only works when there is colour behind it to blur.** This is the whole rule. `backdrop-filter` can only blur and saturate what is actually behind the pane, so a near-white card on near-white paper with nothing behind it renders as an invisible white rectangle. The first light-mode pass shipped exactly that. The three parts below are one recipe — (a) is not optional decoration, it is what makes (b) visible at all.

**(a) Colour fields — required.** Behind every card group, place large, very soft blurred shapes in `--blue-500` and `--violet-500`, low opacity (15–25% on paper, lifted to ~26–32% on navy), positioned so they sit *partly* behind the cards. Blur them to an extreme (~90px) so they stop reading as shapes and become a colour gradient in the air. Sharper or stronger and they become stray blobs competing with the content, which §3 rule 2 forbids.

Implemented as `.colour-field` + `.colour-field-blue` / `.colour-field-violet`. It deliberately sets no `z-index` — behind a plain section it wants `-z-10` (with `isolate` on the section); nested inside an existing backdrop layer like `.panel-grow` it must **not** go negative or it falls behind that layer's own background and disappears.

**(b) The card, on paper:**

```css
background: rgba(255, 255, 255, 0.55);
backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.9);
box-shadow: 0 8px 32px -8px rgba(43, 75, 255, 0.18),
            0 2px 8px -2px rgba(10, 30, 92, 0.08);
border-radius: 20px;
```

The shadow is **blue-tinted, never grey** — this is a large part of what reads as premium. A neutral drop shadow under a near-white card on near-white paper just looks like a printing error; a soft blue one reads as an object lit by the same scene as the rest of the page. `saturate(180%)` is doing real work too: it is what pulls the colour out of the fields in (a).

**(c) The card, on navy —** invert the wash, keep the blur:

```css
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.16);
```

**Acceptance test:** every card must be clearly distinguishable from the surface behind it. If a card is invisible against paper, the fix failed — and the cause is almost always a missing or mispositioned colour field, not the card recipe.

---

## 3. Rules

1. **Light is the default; dark is a whole mode, not a section.** Light mode is `--paper` end to end, with `.section-alt` (`--paper-warm`) for rhythm — no navy anywhere. Dark mode is navy end to end, with `.section-alt` (`--navy-900`) for the same rhythm. Navy is never a section accent *inside* light mode: that is what made the toggle read as broken.
2. **Blue is a punch, not a background.** No full-page blue gradients — electric blue appears in highlight blocks, CTAs, icons, spiral orbs, and type accents. The soft colour fields behind glass (§2f a) are the one deliberate exception, and only because they are blurred past recognition and capped at low opacity.
3. **Every floating object must have a real shadow.** The posters' depth comes from contact shadows under bubbles and devices — flat elements will immediately look off-brand. Card shadows are blue-tinted, never grey (§2f b).
4. **Use the real renders.** Glass bubbles and spiral orbs must be exported PNGs from the poster source files, not CSS approximations.
5. **Never ship glass with nothing behind it.** Glass is a *material*, not a colour — it has no appearance of its own. Any new `.glass` surface needs colour behind it (§2f a) or it will be invisible on paper.

---

## 4. Open items (need input / assets)

- Source files or high-res exports of: glass bubbles, blue spiral orbs, device mockups
- Real service pricing (must not be invented)
- Which service pages get which existing project work