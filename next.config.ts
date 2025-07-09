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
  keyframes: {
    "caret-blink": {
      "0%,70%,100%": { opacity: "1" },
      "20%,50%": { opacity: "0" },
    },
  },
  animation: {
    "caret-blink": "caret-blink 1.25s ease-out infinite",
  },
};

export default nextConfig;
