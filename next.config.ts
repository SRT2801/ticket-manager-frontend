import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:3000";

    if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
      throw new Error(
        `Invalid API_URL: "${apiUrl}". Must start with http:// or https://`,
      );
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
