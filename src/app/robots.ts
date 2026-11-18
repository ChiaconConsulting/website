import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Search and AI crawlers are welcome on the public site. Admin and raw media are kept out.
// The named AI agents are listed explicitly so our intent to allow them is unambiguous,
// even though the wildcard rule already permits them.
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/media"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: AI_AGENTS, allow: "/", disallow },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
