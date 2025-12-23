import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile @rally/auth package (local file dependency)
  transpilePackages: ["@rally/auth"],
};

export default nextConfig;
