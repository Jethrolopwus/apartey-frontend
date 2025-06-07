import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://apartey-media-storage.s3.eu-north-1.amazonaws.com/public/properties/images/1748812200484-e13ef158-b415-4244-afc8-c8b45a86969f-cover-1748812200484-cover.jpg"                                                                    )],
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
  
}


export default nextConfig;
