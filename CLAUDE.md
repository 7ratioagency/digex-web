# Digex Agency — Website

Marketing site for Digex Agency, a digital agency in Algeria. Trilingual (Arabic / French / English). **Arabic is the default locale and is RTL.**

## Stack

- Next.js 15+ (App Router) + TypeScript (strict)
- Tailwind CSS v4
- next-intl for i18n (`/ar`, `/fr`, `/en`)
- `motion` (`motion/react`) for animation
- Lenis for smooth scroll
- Deployed on Vercel

## Non-negotiable rules

### 1. RTL — always use logical properties

Arabic is RTL and is the default locale. Physical direction utilities break it.

| Never use | Always use |
|---|---|
| `ml-4` / `mr-4` | `ms-4` / `me-4` |
| `pl-6` / `pr-6` | `ps-6` / `pe-6` |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` |

- Directional icons (arrows, chevrons) must flip: `className="rtl:-scale-x-100"`
- Horizontal scroll / carousel animations must reverse direction when `dir === 'rtl'`
- After building any component, verify it at `/ar` before moving on

### 2. Animation — always respect reduced motion

Every animated component must call `useReducedMotion()` from `motion/react` and render the final state immediately when it returns true. No exceptions.

```tsx
const reduce = useReducedMotion()

<motion.div
  initial={reduce ? false : { opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-10%' }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
/>
```

- Standard easing: `[0.22, 1, 0.36, 1]`
- Standard reveal: `opacity 0→1`, `y 24→0`, `duration 0.6`
- Stagger children by `0.08s`
- Animations play **once** (`viewport={{ once: true }}`) — never replay on scroll back
- Never animate `width` / `height` / `top` / `left`. Only `transform` and `opacity`.

### 3. Content — never invent client data

All copy lives in `messages/{ar,fr,en}.json`. All project data lives in `content/projects.ts`.

- Never write placeholder copy ("Lorem ipsum", "Our innovative solutions", "We deliver excellence")
- Never invent metrics, testimonials, client names, or results
- Every project must have a real client name and a real link (live site, Behance, or YouTube)
- Each language is written natively — never machine-translate one into another
- Arabic register: clear, professional, warm. Not stiff formal MSA, not heavy Darija slang.

### 4. No generic icons

Service icons are hand-written SVG React components in `components/icons/`. Do not install `lucide-react`, `react-icons`, or similar for them.

- 24×24 viewBox, `stroke="currentColor"`, `strokeWidth={1.5}`, no fills
- `strokeLinecap="round"`, `strokeLinejoin="round"`
- Animated variants use `motion.path` with `pathLength` 0→1

## Structure

```
app/[locale]/          one folder per page
components/
  sections/            homepage story sections
  ui/                  buttons, cards, primitives
  icons/               custom SVG icon components
content/
  projects.ts          real portfolio data
  services.ts          service structure
messages/              ar.json, fr.json, en.json
lib/                   utils, i18n config
```

## Conventions

- Components: `PascalCase.tsx`, one component per file, named exports
- Server Components by default. Add `'use client'` only when the file needs hooks, animation, or events.
- Tailwind only — no CSS modules, no styled-components
- Colours and spacing come from tokens in `app/globals.css`. Never hard-code hex values in components.
- Images always via `next/image` with explicit `width`/`height`, or `fill` inside a sized parent

## Commands

```bash
npm run dev      # localhost:3000
npm run build    # must pass before any commit
npm run lint
```

## Definition of done for any component

- [ ] Works at `/ar` (RTL), `/fr`, `/en`
- [ ] Respects `prefers-reduced-motion`
- [ ] No hard-coded strings — all text from `messages/`
- [ ] Keyboard accessible, visible focus state
- [ ] `npm run build` passes
