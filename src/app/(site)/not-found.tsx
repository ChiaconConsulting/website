import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-mist py-32">
      <div className="container-x text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">This page has moved or does not exist.</h1>
        <p className="lead mx-auto mt-4 max-w-md">Try the homepage, or tell us what you were looking for.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-dark">Go to homepage</Link>
          <Link href="/contact" className="btn-outline">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
