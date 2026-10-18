import { ArrowRight, CalendarDays, Check, MapPin, QrCode, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CampusEvent } from "@/types/event";

interface TicketsViewProps {
  bookedEvent: CampusEvent | null;
  onExplore: () => void;
  onOpen: (event: CampusEvent) => void;
}

export function TicketsView({ bookedEvent, onExplore, onOpen }: TicketsViewProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <Ticket className="size-4" /> Your wallet
        </div>
        <h1 className="font-display text-5xl font-black tracking-tight">My tickets</h1>
        <p className="mt-3 text-muted-foreground">Your next good night out, all in one place.</p>
      </div>

      {bookedEvent ? (
        <div className="max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className={`poster-${bookedEvent.poster} p-7`}>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-mint px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]">
              <Check className="size-3" /> Confirmed
            </span>
            <h2 className="mt-12 max-w-md font-display text-4xl font-black leading-none">
              {bookedEvent.title}
            </h2>
          </div>
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="size-4 text-primary" /> {bookedEvent.date}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {bookedEvent.location}
              </div>
            </div>
            <Button onClick={() => onOpen(bookedEvent)}>
              Show QR ticket <QrCode />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-border px-6 py-24 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary">
            <Ticket className="size-6 text-muted-foreground" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-bold">Your wallet is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">Find something worth showing up for.</p>
          <Button className="mt-6" onClick={onExplore}>
            Explore events <ArrowRight />
          </Button>
        </div>
      )}
    </section>
  );
}
