import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    /*
     * YouTube thumbnails for the video showcase (content/videos.ts). The films
     * live on the agency's own channel, so the still comes from YouTube's CDN
     * rather than being copied into /public — one less asset to keep in sync
     * with a video that could be re-uploaded at any time.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

export default withNextIntl(nextConfig);
