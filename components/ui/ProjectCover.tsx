import type { Project } from '@/content/projects'

/**
 * A project's cover image — or, for now, the placeholder standing in for it.
 *
 * /public/work does not exist yet: no real exports have landed, and
 * content/projects.ts declares `cover` paths pointing at files that aren't
 * there. Rendering <Image> against them would ship broken images, so this is a
 * designed placeholder instead — and one that reserves the exact box the real
 * cover will fill, so dropping the files in later shifts nothing. The swap is
 * one element: replace the inner block with
 * `<Image src={project.cover} alt="" fill className="object-cover" />`.
 *
 * The treatment is the catalogue's own for a project page: a short yellow rule
 * over the client's name, set large. `glass` rather than a flat fill so it
 * picks up the colour fields behind the section — DESIGN.md §2f rule 5.
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
      className={`glass relative flex aspect-4/3 items-end overflow-hidden p-section-lg ${className}`}
    >
      {/*
        The catalogue bleeds a yellow bar off the outer edge of every project
        spread. Anchored on the logical start edge so it mirrors at /ar, and
        inset vertically so it reads as a deliberate mark rather than a border.
      */}
      <span
        aria-hidden="true"
        className="absolute inset-s-0 top-[22%] h-[34%] w-1.5 rounded-e-full bg-highlight-yellow"
      />

      <div className="relative">
        {/*
          The catalogue sets this rule above every project title and every
          service heading — it is the one graphic element that recurs on
          almost every page of it.
        */}
        <span
          aria-hidden="true"
          className="block h-1.5 w-10 rounded-full bg-highlight-yellow"
        />
        <p className="mt-section-sm text-2xl font-semibold text-balance ltr:tracking-tight">
          {project.client}
        </p>
      </div>
    </div>
  )
}
