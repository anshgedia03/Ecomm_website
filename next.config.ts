import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    domains: ["cdn-icons-png.flaticon.com", "images.unsplash.com"],
  },
};

export default nextConfig;
