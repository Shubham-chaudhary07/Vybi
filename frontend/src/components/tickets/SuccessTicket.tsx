import { BadgeCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrPattern } from "./QrPattern";
import type { CampusEvent } from "@/types/event";

interface SuccessTicketProps {
  event: CampusEvent;
  ticketCode?: string | undefined;
  onClose: () => void;
}

export function SuccessTicket({ event, ticketCode = "VP-7N4Q", onClose }: SuccessTicketProps) {
  return (
    <div className="depth-panel m-2 p-7">
      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-4" />
        </span>{" "}
        Booking confirmed
      </div>
      <h2 className="mt-5 font-display text-4xl font-black leading-none">You’re on the list.</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Your ticket for {event.title} is ready. Show this code at the gate.
      </p>
      <div className="mt-7 flex flex-col items-center rounded-xl border border-border bg-secondary p-6">
        <QrPattern />
        <div className="mt-4 font-mono text-sm font-bold tracking-[0.25em]">{ticketCode}</div>
        <span className="mt-2 text-xs text-muted-foreground">Valid for {event.dateShort}</span>
      </div>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{event.time}</span>
        <span className="flex items-center gap-1.5 font-semibold">
          <BadgeCheck className="size-4" /> Verified
        </span>
      </div>
      <Button className="mt-7 w-full" size="lg" onClick={onClose}>
        Done <Check />
      </Button>
    </div>
  );
}
