import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import Script from "next/script";
import "./globals.css";
import { site } from "@/lib/site";

// Content is read from the database on every request, so edits in /admin show immediately
// and the build does not need a database connection.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Chiacon | Auditable AI and Intelligent Automation", template: "%s | Chiacon" },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Chiacon | Auditable AI and Intelligent Automation",
    description: site.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#071a35", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  return (
    <html lang="en">
      <body>
        {children}
        {gtm && /^GTM-[A-Z0-9]+$/.test(gtm) ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
