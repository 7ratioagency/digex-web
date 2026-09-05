import Image from 'next/image'
import type { Project } from '@/content/projects'

/**
 * A project's cover, on the service pages.
 *
 * Two states, because the portfolio is only part-photographed. Where the file
 * exists it is rendered at the source's own aspect ratio rather than cropped
 * into a fixed box: these are storefronts, signage and a brand board, and they
 * arrive portrait, landscape and square. The catalogue does the same — every
 * project spread frames its photograph differently — and a feature row is one
 * project wide, so nothing has to line up with a neighbour.
 *
 * Where there is no file yet, the placeholder keeps a 4:3 box and the same
 * frame, so the row still reads as designed rather than as a gap.
 *
 * The treatment around both is the catalogue's: a yellow bar bleeding off the
 * outer edge, and the whole thing on `glass` so it picks up the colour fields
 * behind the section — DESIGN.md §2f rule 5.
 */
export function ProjectCover({
  project,
  className = '',
}: {
  project: Project
  className?: string
}) {
  return (
    <div
      className={`glass relative overflow-hidden ${project.cover ? '' : 'flex aspect-4/3 items-end p-section-lg'} ${className}`}
    >
      {/*
        The catalogue bleeds a yellow bar off the outer edge of every project
        spread. Anchored on the logical start edge so it mirrors at /ar, and
        inset vertically so it reads as a deliberate mark rather than a border.
        `z-10` keeps it over the photograph.
      */}
      <span
        aria-hidden="true"
        className="absolute inset-s-0 top-[22%] z-10 h-[34%] w-1.5 rounded-e-full bg-highlight-yellow"
      />

      {project.cover ? (
        /*
          `width`/`height` rather than `fill`, so the intrinsic ratio drives the
          box — CLAUDE.md allows either, and here the source shape is the point.
          The numbers are the largest any of these render at; Next scales down
          from the same file. `sizes` stops it shipping the full-width candidate
          into what is a half-width column from `lg` up.
        */
        <Image
          src={project.cover}
          alt=""
          width={1600}
          height={1600}
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="h-auto w-full"
        />
      ) : (
        <div className="relative">
          <span
            aria-hidden="true"
            className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
          />
          <p className="mt-section-sm text-2xl font-semibold text-balance ltr:tracking-tight">
            {project.client}
          </p>
        </div>
      )}
    </div>
  )
}
