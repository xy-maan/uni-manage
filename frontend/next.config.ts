import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images:{
    remotePatterns:[
  {
    protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
    },
      {
      protocol: "http",
      hostname: "localhost",
      port: "8000",
      pathname: "/community/attachments/**",
      },
  ],

  },
};
export default nextConfig;