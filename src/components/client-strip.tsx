/* eslint-disable @next/next/no-img-element */
type ClientItem = { id: string; name: string; logoType: string | null };

/** Client names as a slow marquee. Shows the uploaded logo when one exists, otherwise a wordmark. */
export function ClientStrip({ clients }: { clients: ClientItem[] }) {
  if (!clients.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-14 pr-14" aria-hidden={hidden || undefined}>
      {clients.map((c) => (
        <li key={c.id + String(hidden)} className="shrink-0">
          {c.logoType ? (
            <img src={`/media/client/${c.id}`} alt={hidden ? "" : c.name} className="h-9 w-auto max-w-[9rem] object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" loading="lazy" />
          ) : (
            <span className="font-display text-xl font-semibold tracking-tight text-ink/45">{c.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <section className="border-b border-line bg-white py-10" aria-label="Clients">
      <div className="container-x">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate">
          Trusted by teams at
        </p>
      </div>
      <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="marquee flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
