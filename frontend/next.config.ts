import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
const nextConfig: NextConfig = {
  /* config options here */
    images:{
      unoptimized: true, 
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
        pathname: "/media/**",
      },
  ],

  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
// export default nextConfig;