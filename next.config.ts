import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // If hosting at username.github.io/repo-name (not a custom domain), uncomment:
  // basePath: "/upstage-website",
};

export default nextConfig;
