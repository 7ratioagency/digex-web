// Destination in repo: content/videos.ts
//
// Video work, hosted on the agency's own YouTube channel
// (youtube.com/@digex_agency).
//
// These twelve IDs were already sitting in content/projects.ts as a bare
// `videos` array that nothing imported — twelve real, published films with no
// route to them from anywhere on the site. Every one was checked against
// YouTube's oEmbed endpoint before this file was written: all twelve resolve,
// all twelve are on the Digex channel, and the titles below are the ones
// YouTube returns, not descriptions written here.
//
// `client` is read off the title, not inferred: "Lova Video 01" is Lova,
// "Kafil Travel | رحلة العمر إلى كينيا" is Kafil Travel. Nothing else about
// these clients is claimed, because nothing else is known — no sector, no
// brief, no result. That is exactly why they are a video showcase and not
// entries in content/projects.ts, which requires all three.
//
// Kafil Travel also appears on the catalogue's own client wall (p26, "EL KAFIL
// Travel"), so the two sources agree on at least that one.

export interface VideoItem {
  /** YouTube video ID. */
  id: string
  /** The title YouTube returns for it. */
  title: string
  /** The client, as named in that title. */
  client: string
}

export const videos: VideoItem[] = [
  { id: 'WHVWLsHj0QI', title: 'Kafil Travel | رحلة العمر إلى كينيا', client: 'Kafil Travel' },
  { id: 'PS1JReoKygE', title: 'Parfio Video Publicitaire', client: 'Parfio' },
  { id: 'YWwl8FQcMjg', title: 'Ziver Video 01', client: 'Ziver' },
  { id: 'Cxt4N1TeXQ0', title: 'Video Mo3atir elmassajed', client: 'Mo3atir Elmassajed' },
  { id: '-nN3BEaTEvI', title: 'Lova Costume', client: 'Lova' },
  { id: 'DGAA5zX4v6k', title: 'Lova Video 01', client: 'Lova' },
  { id: 'Vr8i_fDBBsk', title: 'Lova Video 02', client: 'Lova' },
  { id: 'IIeTersdVUo', title: 'Lova Video 03', client: 'Lova' },
  { id: 'a9uUFCcDZHM', title: 'Lova Video 04', client: 'Lova' },
  { id: 'gP1-YXGgNSs', title: 'Lova Video 05', client: 'Lova' },
  { id: 'Rr6xvKzkLx4', title: 'Lova Video 07', client: 'Lova' },
  { id: 'oeL7ejQkSYI', title: 'Lova Video 08', client: 'Lova' },
]

/**
 * YouTube's own thumbnail for a video.
 *
 * `hqdefault` rather than `maxresdefault`: the max-res file is only generated
 * for some uploads and 404s for the rest, whereas hqdefault always exists. It
 * comes back 480×360 with letterbox bars, which the grid crops away by fitting
 * it to a 16:9 box with `object-cover`.
 */
export const videoThumbnail = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

/** Privacy-preserving embed host — no cookie until the visitor hits play. */
export const videoEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`

export const videoWatchUrl = (id: string) =>
  `https://www.youtube.com/watch?v=${id}`
