import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import campusNight from "@/assets/campus-night.jpg";

interface HeroSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
  onFindEvents: () => void;
}

export function HeroSection({ query, onQueryChange, onFindEvents }: HeroSectionProps) {
  return (
    <section className="perspective-stage relative isolate min-h-[650px] overflow-hidden border-b border-foreground/10">
      <img
        className="absolute inset-0 -z-20 size-full object-cover object-center"
        src={campusNight}
        alt="Students enjoying a live campus event"
        width={1440}
        height={1080}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
      <div className="mx-auto flex min-h-[650px] max-w-7xl items-end px-5 py-12 lg:px-10 lg:py-16">
        <div className="max-w-3xl text-night-foreground">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
            <Sparkles className="size-4" /> North Campus · October 2026
          </div>
          <h1 className="max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl">
            Your campus.
            <br />
            Your plans. Your vibe.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-night-foreground/75 sm:text-lg">
            Every event worth showing up for, in one trusted place. Find your people, book in
            seconds, and walk in with confidence.
          </p>
          <div className="depth-panel mt-8 flex max-w-xl items-center gap-3 rounded-xl border border-border bg-card p-2">
            <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search events, clubs, or venues"
              className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button className="hidden shrink-0 sm:inline-flex" onClick={onFindEvents}>
              Find events <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
