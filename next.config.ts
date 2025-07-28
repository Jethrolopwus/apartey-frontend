import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apartey-media-storage.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    domains: ["maps.googleapis.com"],
  },
};

export default nextConfig;
