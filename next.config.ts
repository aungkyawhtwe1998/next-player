import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_PLAYER_API_URL: process.env.NEXT_PUBLIC_PLAYER_API_URL,
    NEXT_PUBLIC_PLAYER_API_KEY: process.env.NEXT_PUBLIC_PLAYER_API_KEY,
  },
  images: {
    domains: ['via.placeholder.com'], // Add this line
  },
  
};

export default nextConfig;
