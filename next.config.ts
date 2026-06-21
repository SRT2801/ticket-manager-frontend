import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    let apiUrl = process.env.API_URL || "http://localhost:3000";

    apiUrl = apiUrl.trim();

    if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
      if (apiUrl !== "localhost:3000") {
        apiUrl = `https://${apiUrl}`;
      }
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
