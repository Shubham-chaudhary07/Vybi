interface TrustStatProps {
  value: string;
  label: string;
}

export function TrustStat({ value, label }: TrustStatProps) {
  return (
    <div className="px-4 first:pl-0 last:pr-0 sm:px-7">
      <div className="font-display text-2xl font-black sm:text-3xl">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
        {label}
      </div>
    </div>
  );
}

export function TrustStatsBar() {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-x divide-border px-5 py-5 sm:grid-cols-3 lg:px-10">
        <TrustStat value="18" label="events this month" />
        <TrustStat value="2.4k" label="tickets booked" />
        <TrustStat value="100%" label="verified organizers" />
      </div>
    </section>
  );
}
