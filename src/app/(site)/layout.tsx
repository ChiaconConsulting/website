import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getServices } from "@/lib/data";
import { site } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const services = await getServices();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}/brand/chiacon-logo.png`,
    image: `${site.url}/brand/chiacon-logo.png`,
    slogan: site.tagline,
    description: site.description,
    email: site.email,
    telephone: site.phoneHref,
    foundingDate: String(site.founded),
    sameAs: [site.linkedin],
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 50 },
    areaServed: ["India", "United Arab Emirates", "United Kingdom", "United States", "Europe", "GCC"],
    knowsAbout: [
      "Robotic Process Automation (RPA)",
      "Intelligent Process Automation",
      "UiPath",
      "Microsoft Power Platform",
      "Power Apps",
      "Power Automate",
      "Power Pages",
      "Microsoft Power BI",
      "Microsoft Fabric",
      "Data Analytics",
      "Data engineering",
      "Auditable AI",
      "Retrieval-Augmented Generation",
      "AI assistants over enterprise data",
      "Quality Assurance automation",
      "Playwright test automation",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phoneHref,
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Chiacon services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, url: `${site.url}/services/${s.slug}` },
      })),
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "10th Floor, Imperia Mindspace, Sector 62",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122098",
      addressCountry: "IN",
    },
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en",
  };
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer services={services.map(({ slug, title }) => ({ slug, title }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, websiteJsonLd]).replace(/</g, "\\u003c") }} />
    </>
  );
}
