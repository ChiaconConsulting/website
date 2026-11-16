import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Briefcase, Building2, ExternalLink, FileText, Inbox, KeyRound, Layers, LayoutDashboard, LogOut, Newspaper, Users } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Chiacon admin" }, robots: { index: false, follow: false } };

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/posts", label: "Insights", icon: Newspaper },
  { href: "/admin/case-studies", label: "Case studies", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/clients", label: "Clients", icon: Building2 },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" aria-label="Admin dashboard">
            <Image src="/brand/chiacon-logo.png" alt="Chiacon" width={1098} height={262} className="h-7 w-auto" />
          </Link>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {links.map(({ href, label, icon: I }) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-body hover:bg-mist hover:text-navy">
              <I className="h-4 w-4 text-slate" aria-hidden="true" /> {label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-line px-3 py-3 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <p className="truncate px-3 pb-2 text-xs text-slate">{session.email}</p>
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-body hover:bg-mist"><ExternalLink className="h-4 w-4 text-slate" aria-hidden="true" />View website</Link>
          <Link href="/admin/account" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-body hover:bg-mist"><KeyRound className="h-4 w-4 text-slate" aria-hidden="true" />Password</Link>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-body hover:bg-mist"><LogOut className="h-4 w-4 text-slate" aria-hidden="true" />Sign out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-end gap-4 border-b border-line bg-white px-5 py-3 text-sm lg:hidden">
          <Link href="/admin/account" className="text-slate">Password</Link>
          <form action={logout}><button type="submit" className="font-medium text-navy">Sign out</button></form>
        </div>
        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
