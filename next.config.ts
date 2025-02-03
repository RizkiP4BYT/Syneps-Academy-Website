import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "*.gravatar.com"
      }
    ] 
  }
};

export default nextConfig;
