import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getServices } from "@/lib/data";
import { site } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const services = await getServices();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}/brand/chiacon-logo.png`,
    email: site.email,
    telephone: site.phoneHref,
    foundingDate: String(site.founded),
    sameAs: [site.linkedin],
    address: {
      "@type": "PostalAddress",
      streetAddress: "10th Floor, Imperia Mindspace, Sector 62",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122098",
      addressCountry: "IN",
    },
  };
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer services={services.map(({ slug, title }) => ({ slug, title }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
