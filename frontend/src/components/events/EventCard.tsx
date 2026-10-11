import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CampusEvent } from "@/types/event";

interface EventCardProps {
  event: CampusEvent;
  onOpen: (event: CampusEvent) => void;
}

export function EventCard({ event, onOpen }: EventCardProps) {
  return (
    <article className="depth-card group overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative flex aspect-[1.18] flex-col justify-between overflow-hidden bg-black p-5">
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center rounded-md bg-black text-white/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-foreground">
            {event.category}
          </span>
          <span className="font-display text-right text-xs font-bold uppercase leading-4 opacity-70 text-white/70">
            {event.dateShort.split(" ")[0]}
            <br />
            {event.dateShort.split(" ")[1]}
          </span>
        </div>
        <div>
          <div className="mb-2 h-px w-10 bg-current opacity-60 text-white" />
          <h3 className="max-w-[13rem] font-display text-3xl font-black uppercase tracking-[-0.12em] text-white">
            {event.title}
          </h3>
        </div>
        <div className="pointer-events-none absolute -bottom-8 -right-3 font-display text-[7rem] font-black leading-none opacity-10 text-white">
          {event.category[0]}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" /> {event.date}
        </div>
        <h3 className="mt-2 line-clamp-2 min-h-12 font-display text-lg font-bold leading-6">
          {event.title}
        </h3>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {event.location}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="text-xs text-muted-foreground">from</span>{" "}
            <span className="font-display text-lg font-black">₹{event.price}</span>
          </div>
          <Button size="sm" onClick={() => onOpen(event)}>
            Get tickets <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
