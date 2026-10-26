import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "molhamteam.com",
      },
      // Files uploaded from the admin panel live in Supabase Storage.
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // The former "About" sub-pages are now sections of the unified /about page.
  async redirects() {
    return [
      { source: "/our-story", destination: "/about#story", permanent: true },
      { source: "/vision-mission", destination: "/about#vision", permanent: true },
      { source: "/goals-values", destination: "/about#goals", permanent: true },
      { source: "/governance", destination: "/about#governance", permanent: true },
      { source: "/partners", destination: "/about#partners", permanent: true },
    ];
  },
};

export default nextConfig;

