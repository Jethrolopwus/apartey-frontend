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
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
    domains: ["maps.googleapis.com"],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self' https://apartey-server.onrender.com https://api.stripe.com https://r.stripe.com https://*.stripe.com https://maps.googleapis.com https://*.googleapis.com https://api.ipify.org https://ipapi.co https://ipinfo.io https://ip-api.com;"
          }
        ]
      }
    ]
  }
};

export default nextConfig;
