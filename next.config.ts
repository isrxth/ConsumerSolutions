import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Guarantee local markdown files are bundled in the serverless functions trace
  outputFileTracingIncludes: {
    '/api/notes': ['./Notes/**/*'],
  },
};

export default nextConfig;
