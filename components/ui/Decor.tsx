'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'

/**
 * The two signature poster objects from DESIGN.md §2, as web decor.
 *
 * ─── Why these are CSS today and take a `src` tomorrow ──────────────────────
 * DESIGN.md §2a and §4 are explicit that the real thing is a rendered PNG —
 * "a CSS circle with a blur will not reproduce this". That's correct, and the
 * exports below are not pretending otherwise: they are a stand-in good enough
 * to build layout and motion against while the poster source files don't
 * exist yet (§4 lists them as an open item). Both components take `src`, so
 * the day those exports land the swap is a prop on the call site, not a
 * rewrite — nothing downstream knows or cares which branch rendered.
 *
 * ─── Why drift is seeded, not `Math.random()` ───────────────────────────────
 * These render on the server first. A random amplitude picked during render
 * differs between the server pass and hydration, which is a mismatch — the
 * exact trap FloatingLogos.tsx sidesteps by deferring its whole scatter into
 * `useEffect`. That works there because those marks are a mass texture nobody
 * misses for a frame; a hero bubble popping in after hydration would be very
 * visible. So instead each instance derives its own drift from a hash of its
 * own props: stable across server and client, still different for every
 * instance on the page, and no post-mount flash.
 */

type DecorProps = {
  /** Rendered box, in px. The object is square; the shadow extends below it. */
  size?: number
  /**
   * Placement utilities, e.g. `top-[12%] start-[6%]`. Logical `start`/`end`
   * rather than `left`/`right` so a composition mirrors correctly at /ar.
   */
  position?: string
  opacity?: number
  /**
   * A real render (DESIGN.md §2a). When set, the CSS stand-in is skipped
   * entirely and this image is drawn instead — same box, same drift, same
   * reduced-motion behaviour.
   */
  src?: string
  /** Overrides the auto-derived drift seed when two instances would collide. */
  seed?: string
  className?: string
}

/* FNV-1a — small, fast, and stable across server and client. */
function hash(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** xorshift32, seeded from the hash. Deterministic per instance. */
function seededRandom(seed: string) {
  let state = hash(seed) || 1
  return () => {
    state ^= state << 13
    state >>>= 0
    state ^= state >> 17
    state ^= state << 5
    state >>>= 0
    return state / 4294967296
  }
}

/**
 * Slow, continuous, and deliberately not in phase with anything else on the
 * page — DESIGN.md §5 asks for "slow, physical easing", and two objects
 * drifting in lockstep instantly reads as a loop rather than as ambience.
 * Only `x`/`y`/`scale` move: all three are compositor-only, so this never
 * triggers layout (CLAUDE.md's animation rule).
 */
function useDrift(seed: string) {
  return useMemo(() => {
    const rand = seededRandom(seed)
    const ax = 12 + rand() * 20
    const ay = 10 + rand() * 16
    const dirX = rand() > 0.5 ? 1 : -1
    const dirY = rand() > 0.5 ? 1 : -1
    const peak = 1.02 + rand() * 0.04
    const dip = 0.96 + rand() * 0.03
    return {
      x: [0, ax * dirX, -ax * 0.6 * dirX, 0],
      y: [0, ay * dirY, -ay * 0.7 * dirY, 0],
      scale: [1, peak, dip, 1],
      duration: 26 + rand() * 24,
      spin: 48 + rand() * 34,
    }
  }, [seed])
}

/**
 * A transparent glass sphere — DESIGN.md §2a.
 *
 * The 3D read comes from four stacked cues, not from any one of them:
 *   1. an off-centre body gradient, so the sphere is lit from the top-left
 *      rather than evenly — an even fill is what makes CSS circles look flat;
 *   2. a small, tight specular highlight where that light source would hit;
 *   3. a broad rim light on the opposite (bottom-right) edge, which is what
 *      sells *transparency* — it's light bending through the far wall of the
 *      sphere, and glass without it reads as a plastic disc;
 *   4. a separate elliptical contact shadow *below* the box, which is what
 *      sells that it's an object resting in space rather than a decal.
 *      DESIGN.md §3 rule 3 calls this out specifically.
 *
 * `backdrop-filter` is what makes it glass rather than a painted circle: the
 * content behind genuinely blurs and desaturates through it. Every dimension
 * below is a fraction of `size`, so the illusion holds at any scale instead
 * of only at the size it was tuned at.
 */
export function GlassBubble({
  size = 180,
  position = '',
  opacity = 1,
  src,
  seed,
  className = '',
}: DecorProps) {
  const reduce = useReducedMotion()
  const drift = useDrift(seed ?? `bubble:${size}:${position}`)

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute ${position} ${className}`}
      style={{ width: size, height: size, opacity }}
      animate={
        reduce ? undefined : { x: drift.x, y: drift.y, scale: drift.scale }
      }
      transition={
        reduce
          ? undefined
          : {
              duration: drift.duration,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }
      }
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-contain"
        />
      ) : (
        <>
          {/* Contact shadow — sits below the sphere's own box, so it reads as
              cast onto whatever is behind rather than as part of the object. */}
          <div
            className="absolute inset-s-1/2 rounded-[50%]"
            style={{
              bottom: -size * 0.05,
              width: size * 0.78,
              height: size * 0.14,
              marginInlineStart: -size * 0.39,
              background:
                'radial-gradient(ellipse at center, rgba(6,20,54,0.30) 0%, rgba(6,20,54,0.14) 45%, transparent 72%)',
              filter: `blur(${size * 0.035}px)`,
            }}
          />

          {/* The glass body. */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backdropFilter: `blur(${size * 0.035}px) saturate(130%)`,
              background: [
                // lit side, top-left
                'radial-gradient(115% 115% at 30% 24%, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.14) 24%, rgba(255,255,255,0.03) 46%, transparent 62%)',
                // brand refraction pooling in the lower half
                'radial-gradient(95% 95% at 68% 76%, rgba(43,75,255,0.30) 0%, rgba(43,75,255,0.10) 40%, transparent 68%)',
                // faint overall body so it still reads on a busy backdrop
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 70%, rgba(255,255,255,0.05) 100%)',
              ].join(','),
              boxShadow: [
                // crisp outer edge
                'inset 0 0 0 1px rgba(255,255,255,0.30)',
                // rim light, bottom-right — the transparency cue
                `inset ${-size * 0.05}px ${-size * 0.07}px ${size * 0.13}px rgba(255,255,255,0.48)`,
                // soft inner bounce, top-left
                `inset ${size * 0.07}px ${size * 0.09}px ${size * 0.17}px rgba(255,255,255,0.16)`,
                // brand tint deep in the bottom of the sphere
                `inset ${-size * 0.02}px ${-size * 0.1}px ${size * 0.2}px rgba(43,75,255,0.22)`,
                // ambient occlusion against the page
                `0 ${size * 0.05}px ${size * 0.11}px rgba(6,20,54,0.16)`,
              ].join(','),
            }}
          />

          {/* Specular highlight — small, tight and offset, where cue 1's light
              source would actually strike. Rotated so it reads as a curved
              surface catching light, not as a pasted-on dot. */}
          <div
            className="absolute rounded-[50%]"
            style={{
              top: size * 0.13,
              insetInlineStart: size * 0.19,
              width: size * 0.3,
              height: size * 0.19,
              rotate: '-24deg',
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.45) 40%, transparent 72%)',
              filter: `blur(${size * 0.012}px)`,
            }}
          />

          {/* Second, much smaller sparkle — real glass has more than one. */}
          <div
            className="absolute rounded-[50%]"
            style={{
              bottom: size * 0.18,
              insetInlineEnd: size * 0.2,
              width: size * 0.1,
              height: size * 0.07,
              rotate: '18deg',
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.65) 0%, transparent 70%)',
              filter: `blur(${size * 0.01}px)`,
            }}
          />
        </>
      )}
    </motion.div>
  )
}

/**
 * The blue spiral vortex — DESIGN.md §2b.
 *
 * Concentric `--blue-500` rings, each one progressively blurrier, thinner and
 * rotated a little further than the one inside it. That progression is what
 * produces the swirl: perfectly concentric rings read as a target, whereas
 * rings whose ellipses are each turned a few more degrees read as one
 * continuous spiral caught mid-motion — which is the motion-blurred vortex
 * the posters use. The whole orb then rotates slowly and continuously, so the
 * blur has a direction.
 */
export function SpiralOrb({
  size = 220,
  position = '',
  opacity = 0.9,
  src,
  seed,
  className = '',
}: DecorProps) {
  const reduce = useReducedMotion()
  const drift = useDrift(seed ?? `orb:${size}:${position}`)

  const rings = useMemo(() => {
    const COUNT = 7
    return Array.from({ length: COUNT }, (_, i) => {
      const t = i / (COUNT - 1)
      return {
        inset: t * 26, // %
        width: 1.2 + (1 - t) * 2.4, // inner rings carry the definition
        alpha: 0.62 - t * 0.4,
        blur: t * t * 9, // quadratic, so only the outermost really smear
        /*
         * These two are what make it a vortex instead of a target, and they
         * only work together. A first pass used a 14% squash with a 34°
         * spread and rendered as plain concentric ripples: rings that are
         * nearly circular look identical however far you turn them, so the
         * rotation had nothing to bite on. Squashing them hard enough to be
         * visibly elliptical is what lets each ring's extra rotation show as
         * a swirl.
         */
        rotate: t * 76,
        squash: 1 - t * 0.45,
      }
    })
  }, [])

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute ${position} ${className}`}
      style={{ width: size, height: size, opacity }}
      animate={
        reduce ? undefined : { x: drift.x, y: drift.y, scale: drift.scale }
      }
      transition={
        reduce
          ? undefined
          : {
              duration: drift.duration,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }
      }
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-contain"
        />
      ) : (
        /*
         * The spin lives on its own element, inside the drifting one: drift is
         * a mirrored ease and the spin is a linear full turn, and Motion can't
         * run two different eases and durations on one transform. Nesting them
         * lets each own its axis and compose for free.
         *
         * `ease: 'linear'` on purpose, against DESIGN.md §6's general "not
         * linear" note — that rule is about UI transitions starting and
         * stopping. A continuous rotation has no start or stop to ease, and
         * any non-linear curve makes it visibly pulse once per revolution.
         */
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={
            reduce
              ? undefined
              : { duration: drift.spin, repeat: Infinity, ease: 'linear' }
          }
        >
          {rings.map((ring, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                inset: `${ring.inset}%`,
                border: `${ring.width}px solid rgba(43,75,255,${ring.alpha})`,
                filter: ring.blur ? `blur(${ring.blur}px)` : undefined,
                rotate: `${ring.rotate}deg`,
                scale: `1 ${ring.squash}`,
              }}
            />
          ))}

          {/* Hot core, so the vortex has somewhere to lead the eye. */}
          <div
            className="absolute rounded-full"
            style={{
              inset: '38%',
              background:
                'radial-gradient(circle at center, rgba(43,75,255,0.55) 0%, rgba(43,75,255,0.16) 55%, transparent 75%)',
              filter: `blur(${size * 0.02}px)`,
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
