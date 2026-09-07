'use client'

import { useState } from 'react'
import Image from 'next/image'
import { StaggerGroup, StaggerItem } from '@/components/ui/Stagger'
import {
  videos,
  videoThumbnail,
  videoEmbedUrl,
  type VideoItem,
} from '@/content/videos'

type Labels = {
  /** Accessible name for a card, e.g. "Play: Lova Video 01". */
  play: string
  watchOn: string
}

/**
 * The agency's video work, played in place.
 *
 * Nothing loads from YouTube until a card is clicked. Twelve embedded iframes
 * would pull in twelve copies of the YouTube player — megabytes of third-party
 * script, and twelve more origins to connect to, on a page nobody has asked to
 * watch anything on yet. So each card is a thumbnail and a button until it is
 * pressed, and only then does an iframe replace it, already playing.
 *
 * One at a time: opening a second video closes the first. Twelve soundtracks
 * competing is not a feature, and it also keeps at most one player in memory.
 *
 * `youtube-nocookie.com` is the embed host — YouTube sets no cookie until the
 * visitor actually presses play, which they now have to do deliberately.
 */
export function VideoGrid({ labels }: { labels: Labels }) {
  const [playing, setPlaying] = useState<string | null>(null)

  return (
    /*
      <StaggerGroup>/<StaggerItem> rather than hand-rolled motion. The first
      draft branched `initial` on `useReducedMotion()`, which is exactly the
      trap Reveal.tsx documents: that value is written into the server markup,
      the server cannot know the preference, and React reported the mismatch on
      every load of this page. These two primitives already solve it — only
      `transition` varies, and `data-reduce-safe` paints the finished state.
    */
    <StaggerGroup
      as="ul"
      className="mt-section-xl grid grid-cols-1 gap-section-md sm:grid-cols-2 lg:grid-cols-3"
    >
      {videos.map((video: VideoItem) => {
        const isPlaying = playing === video.id

        return (
          <StaggerItem as="li" key={video.id} className="flex flex-col">
            <div className="glass relative aspect-video overflow-hidden">
              {isPlaying ? (
                <iframe
                  src={videoEmbedUrl(video.id)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(video.id)}
                  aria-label={`${labels.play}: ${video.title}`}
                  className="group absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
                >
                  {/*
                    `object-cover` on a 16:9 box crops the letterbox bars
                    YouTube bakes into hqdefault. `sizes` tracks the grid:
                    three columns large, two small, one on a phone.
                  */}
                  <Image
                    src={videoThumbnail(video.id)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />

                  {/*
                    A scrim under the play mark. Thumbnails are arbitrary
                    frames — some are bright, some are white — and a mark that
                    only reads on half of them is not a control.
                  */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-navy-950/25 transition-colors duration-300 group-hover:bg-navy-950/10 motion-reduce:transition-none"
                  />

                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="flex size-14 items-center justify-center rounded-full bg-highlight-yellow shadow-lg transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                      {/*
                        A triangle, drawn rather than typed. It must NOT flip
                        at /ar: a play glyph points at the timeline, which runs
                        left-to-right in every player on earth, so this is one
                        of the few marks in the codebase that stays put under
                        RTL.
                      */}
                      <svg
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ms-1 text-ink"
                      >
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    </span>
                  </span>
                </button>
              )}
            </div>

            <div className="mt-section-sm">
              <p className="text-sm font-semibold">{video.client}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {video.title}
              </p>
            </div>
          </StaggerItem>
        )
      })}
    </StaggerGroup>
  )
}
