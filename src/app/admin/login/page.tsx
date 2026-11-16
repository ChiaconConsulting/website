import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <main className="bg-grid-light grid min-h-screen place-items-center bg-mist px-5">
      <div className="card w-full max-w-sm p-8">
        <Image src="/brand/chiacon-logo.png" alt="Chiacon" width={1098} height={262} className="h-8 w-auto" priority />
        <h1 className="mt-8 text-2xl font-semibold text-ink">Website admin</h1>
        <p className="mt-1 text-sm text-slate">Sign in to manage content, leads and applications.</p>
        <LoginForm />
      </div>
    </main>
  );
}
