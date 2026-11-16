import type { NextConfig } from "next";

// Old Wix URLs -> new URLs, so existing links and search rankings carry over.
const legacyRedirects = [
  ["/aboutus", "/about"],
  ["/rpa", "/services/intelligent-process-automation"],
  ["/data-and-analytics", "/services/data-analytics"],
  ["/quality-assurance", "/services/quality-assurance"],
  ["/project-catalysts", "/services/project-catalysts"],
  ["/power-platform-ai", "/solutions"],
  ["/rpa-qdbs", "/solutions"],
  ["/career", "/careers"],
  ["/blogs", "/insights"],
  ["/post/:slug", "/insights/:slug"],
  ["/faqs", "/contact#faqs"],
  ["/contact-us", "/contact"],
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // CV uploads go through a server action.
    serverActions: { bodySizeLimit: "6mb" },
  },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
