import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: false },

  async headers() {
    return [
      {
        // Next serves everything in public/ as `max-age=0`, so toggling the
        // hero video back on costs a revalidation round trip before a single
        // frame can paint. These three files only change when someone re-runs
        // ffmpeg by hand, so cache them hard and rename on the rare edit.
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
