import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { nav, offices, site } from "@/lib/site";
import type { Service } from "@/db/schema";

export function Footer({ services }: { services: Pick<Service, "slug" | "title">[] }) {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/brand/chiacon-logo-white.png" alt="Chiacon" width={1098} height={262} className="h-8 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Auditable AI and intelligent automation for process-heavy enterprises.
          </p>
          <p className="mt-4 font-display text-sm font-semibold text-white">{site.tagline}</p>
          <div className="mt-6 flex gap-2">
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Chiacon on LinkedIn" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-brand hover:text-brand">
              <span aria-hidden="true" className="text-[0.95rem] font-bold leading-none">in</span>
            </a>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-brand hover:text-brand">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={`mailto:${site.email}`} aria-label="Email Chiacon" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-brand hover:text-brand">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-white">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.filter((n) => n.href !== "/services").map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">{n.label}</Link>
              </li>
            ))}
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white">Offices</h2>
          <div className="mt-4 space-y-5 text-sm">
            {offices.map((o) => (
              <address key={o.city} className="not-italic leading-relaxed">
                <span className="font-medium text-white">{o.city}, {o.country}</span>
                <br />
                {o.lines.length > 1 ? o.lines.slice(0, 2).join(", ") : o.entity}
              </address>
            ))}
            <p className="flex flex-col gap-1.5">
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-white"><Mail className="h-3.5 w-3.5" aria-hidden="true" />{site.email}</a>
              <a href={`tel:${site.phoneHref}`} className="inline-flex items-center gap-2 hover:text-white"><Phone className="h-3.5 w-3.5" aria-hidden="true" />{site.phone}</a>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p className="flex gap-5">
            <span>ISO/IEC 27001 · ISO 9001</span>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
