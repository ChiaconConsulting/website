import { BadgeCheck, CircleCheck, Database, UserCheck } from "lucide-react";

/** Illustrative product mock used in the hero: an AI answer with its evidence trail. */
export function EvidenceCard() {
  return (
    <figure className="relative mx-auto w-full max-w-[30rem]" aria-label="Illustration of an AI answer with sources, confidence and approval">
      <div className="absolute -inset-6 rounded-[2rem] bg-brand/20 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white text-body shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
        <div className="flex items-center justify-between border-b border-line bg-mist px-5 py-3">
          <span className="flex items-center gap-2 text-xs font-semibold text-ink">
            <span className="pulse-dot h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
            Answer trace
          </span>
          <span className="text-[0.68rem] font-medium uppercase tracking-wider text-slate">Illustrative</span>
        </div>

        <div className="space-y-4 p-5">
          <p className="rounded-xl bg-mist px-4 py-3 text-sm font-medium text-ink">
            Why did trade spend in the Gulf region rise last quarter?
          </p>

          <p className="text-sm leading-relaxed">
            Trade spend rose <strong className="font-semibold text-ink">12.4%</strong> quarter on quarter
            <Cite n={1} />, driven mainly by two modern-trade promotions in the UAE
            <Cite n={2} />. Volume grew 9.1% over the same period
            <Cite n={3} />.
          </p>

          <ul className="space-y-2 text-xs">
            <Source n={1} system="SAP · FI ledger" detail="GL 610200 · as of 31 Oct" />
            <Source n={2} system="Promotions tracker" detail="2 records · as of 30 Oct" />
            <Source n={3} system="Sales warehouse" detail="Net volume · as of 31 Oct" />
          </ul>

          <div className="grid grid-cols-3 gap-2 border-t border-line pt-4 text-[0.7rem]">
            <Stat icon={<CircleCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />} label="Figures reconciled" value="3 of 3" />
            <Stat icon={<BadgeCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />} label="Confidence" value="High" />
            <Stat icon={<UserCheck className="h-4 w-4 text-navy" aria-hidden="true" />} label="Approved by" value="Finance" />
          </div>
        </div>
      </div>
    </figure>
  );
}

function Cite({ n }: { n: number }) {
  return (
    <sup className="ml-0.5 rounded bg-navy/10 px-1 py-0.5 text-[0.62rem] font-semibold text-navy">{n}</sup>
  );
}

function Source({ n, system, detail }: { n: number; system: string; detail: string }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-line px-3 py-2">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-navy text-[0.62rem] font-bold text-white">{n}</span>
      <Database className="h-3.5 w-3.5 shrink-0 text-slate" aria-hidden="true" />
      <span className="font-semibold text-ink">{system}</span>
      <span className="ml-auto truncate text-slate">{detail}</span>
    </li>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 font-semibold text-ink">{icon}{value}</div>
      <p className="mt-0.5 text-slate">{label}</p>
    </div>
  );
}
