import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "*.supabase.co" },
    ],
  },
  // Optimize for Vercel
  poweredByHeader: false,
};

export default nextConfig;
