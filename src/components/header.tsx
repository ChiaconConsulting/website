"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-shadow",
        scrolled ? "border-line shadow-[0_6px_24px_-18px_rgb(7_26_53/0.5)]" : "border-transparent",
      )}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label="Chiacon home" className="shrink-0" onClick={() => setOpen(false)}>
          <Image src="/brand/chiacon-logo.png" alt="Chiacon" width={1098} height={262} priority className="h-8 w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "bg-mist text-navy" : "text-body hover:bg-mist hover:text-navy",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-dark hidden !py-2.5 sm:inline-flex">
            Talk to us <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

    </header>
      {/* Rendered outside the header: its backdrop-filter would otherwise trap a fixed child. */}
      {open ? (
        <div id="mobile-nav" className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-line bg-white lg:hidden">
          <nav aria-label="Mobile" className="container-x flex flex-col py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-display text-xl font-semibold text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-dark mt-6">
              Talk to us <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
