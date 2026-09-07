'use client'

import { useId, useMemo, useState } from 'react'
import {
  websiteTypes,
  hostingOptions,
  pagePrice,
  pageDefault,
  pageMin,
  pageMax,
  estimateTotal,
  type EstimatorSelection,
} from '@/content/estimator'

type Labels = {
  title: string
  lead: string
  websiteType: string
  customDesign: string
  customDesignHint: string
  pages: string
  pagesHint: string
  hosting: string
  hostingHint: string
  proEmail: string
  proEmailHint: string
  included: string
  total: string
  currency: string
  disclaimer: string
  choices: Record<string, string>
}

/**
 * The old site's website calculator, rebuilt.
 *
 * Client Component, because a live total is the whole point — but the only
 * thing that crosses the boundary is numbers and finished strings: every label
 * is resolved on the server and handed down, so the message catalogue and the
 * locale lookup stay out of the bundle.
 *
 * The arithmetic is the old plugin's formula unchanged (see content/estimator.ts).
 * The presentation is not: it ran as five stacked widgets with a total pinned
 * underneath, which is fine on a desktop and unusable on a phone. Here the
 * controls are one column and the total is `sticky` beside them from `lg` up,
 * so the number stays in view while the choices are being made.
 *
 * Native inputs throughout — radios, a checkbox, a range, a select. They are
 * keyboard-operable, screen-reader-labelled and form-associated for free,
 * which no amount of styled `div`s would have been.
 */
export function WebsiteEstimator({ labels }: { labels: Labels }) {
  const baseId = useId()
  const [selection, setSelection] = useState<EstimatorSelection>({
    websiteType: websiteTypes[1].key, // the professional site, the middle option
    customDesign: false,
    pages: pageDefault,
    hosting: hostingOptions[0].key,
    proEmail: false,
  })

  const total = useMemo(() => estimateTotal(selection), [selection])

  /*
   * Grouping locale, chosen the same way <Pricing> chooses it and for the same
   * reasons: `fr-DZ` gives Latin digits and a space separator, which is how
   * prices are printed in Algeria, and makes /ar and /fr render identically.
   * Memoised because this recomputes on every keystroke of the range slider.
   */
  const format = useMemo(() => {
    const formatter = new Intl.NumberFormat('fr-DZ')
    return (n: number) => formatter.format(n)
  }, [])

  const set = <K extends keyof EstimatorSelection>(
    key: K,
    value: EstimatorSelection[K],
  ) => setSelection((current) => ({ ...current, [key]: value }))

  return (
    <div className="mt-section-xl grid grid-cols-1 gap-section-lg lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-section-2xl">
      {/* ── The choices ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-section-lg">
        {/* Website type */}
        <fieldset>
          <legend className="text-sm font-semibold">{labels.websiteType}</legend>
          <div className="mt-section-sm flex flex-col gap-section-xs">
            {websiteTypes.map((type) => (
              <label
                key={type.key}
                className="glass flex min-h-11 cursor-pointer items-center gap-section-sm p-section-sm transition-colors duration-200 hover:border-accent-blue motion-reduce:transition-none has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-blue"
              >
                <input
                  type="radio"
                  name={`${baseId}-type`}
                  value={type.key}
                  checked={selection.websiteType === type.key}
                  onChange={() => set('websiteType', type.key)}
                  className="size-4 shrink-0 accent-accent-blue"
                />
                <span className="text-sm font-medium">
                  {labels.choices[type.key]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Pages */}
        <div>
          <label
            htmlFor={`${baseId}-pages`}
            className="text-sm font-semibold"
          >
            {labels.pages}
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            {labels.pagesHint}
          </p>
          <div className="mt-section-sm flex items-center gap-section-md">
            <input
              id={`${baseId}-pages`}
              type="range"
              min={pageMin}
              max={pageMax}
              step={1}
              value={selection.pages}
              onChange={(event) => set('pages', Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-accent-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
            />
            {/*
              `dir="ltr"` and `tabular-nums`: the count must not reorder against
              the Arabic around it, and must not jog the slider sideways as it
              changes width from 1 to 2 digits.
            */}
            <output
              dir="ltr"
              htmlFor={`${baseId}-pages`}
              className="w-10 shrink-0 text-end text-sm font-semibold tabular-nums"
            >
              {selection.pages}
            </output>
          </div>
        </div>

        {/* Hosting */}
        <div>
          <label
            htmlFor={`${baseId}-hosting`}
            className="text-sm font-semibold"
          >
            {labels.hosting}
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            {labels.hostingHint}
          </p>
          <select
            id={`${baseId}-hosting`}
            value={selection.hosting}
            onChange={(event) => set('hosting', event.target.value)}
            className="glass mt-section-sm min-h-11 w-full px-section-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
          >
            {hostingOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {labels.choices[option.key]}
              </option>
            ))}
          </select>
        </div>

        {/* Two toggles */}
        <div className="flex flex-col gap-section-xs">
          <label className="glass flex min-h-11 cursor-pointer items-start gap-section-sm p-section-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-blue">
            <input
              type="checkbox"
              checked={selection.customDesign}
              onChange={(event) => set('customDesign', event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-accent-blue"
            />
            <span>
              <span className="block text-sm font-medium">
                {labels.customDesign}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {labels.customDesignHint}
              </span>
            </span>
          </label>

          <label className="glass flex min-h-11 cursor-pointer items-start gap-section-sm p-section-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent-blue">
            <input
              type="checkbox"
              checked={selection.proEmail}
              onChange={(event) => set('proEmail', event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-accent-blue"
            />
            <span>
              <span className="block text-sm font-medium">
                {labels.proEmail}
                {/* It costs nothing; the estimate should say so. */}
                <span className="ms-section-xs rounded-full bg-highlight-yellow px-2 py-0.5 text-[0.6875rem] font-semibold text-ink">
                  {labels.included}
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {labels.proEmailHint}
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* ── The total ────────────────────────────────────────────────────── */}
      <div className="glass p-section-lg lg:sticky lg:top-28">
        <span
          aria-hidden="true"
          className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
        />
        <p className="mt-section-md text-sm font-semibold">{labels.total}</p>
        {/*
          `aria-live="polite"` so the running total is announced as the choices
          change, rather than silently updating for a screen reader user.
          `dir="ltr"` keeps the figure and its currency in order at /ar.
        */}
        <p
          dir="ltr"
          aria-live="polite"
          className="mt-section-xs text-4xl font-semibold tabular-nums text-start ltr:tracking-tight"
        >
          {format(total)}
          <span className="ms-2 text-base font-medium text-muted-foreground">
            {labels.currency}
          </span>
        </p>
        <p className="mt-section-md text-xs leading-relaxed text-pretty text-muted-foreground">
          {labels.disclaimer}
        </p>
        <p className="mt-section-sm text-xs text-muted-foreground">
          {/*
            Spelled out rather than implied: the page count is the one input
            whose contribution is not a flat add-on.
          */}
          {selection.pages} × {format(pagePrice)} {labels.currency}
        </p>
      </div>
    </div>
  )
}
