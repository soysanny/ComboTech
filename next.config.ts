import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: ["127.0.0.1", "192.168.56.1"],
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
