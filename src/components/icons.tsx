import {
  BarChart3, CheckCircle2, Database, Gauge, Quote, Rocket, ShieldCheck, Sparkles, Workflow, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  workflow: Workflow,
  chart: BarChart3,
  check: CheckCircle2,
  rocket: Rocket,
  database: Database,
  quote: Quote,
  gauge: Gauge,
  sparkles: Sparkles,
};

export const iconNames = Object.keys(map);

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = map[name] ?? Sparkles;
  return <Cmp className={className} aria-hidden="true" strokeWidth={1.75} />;
}
