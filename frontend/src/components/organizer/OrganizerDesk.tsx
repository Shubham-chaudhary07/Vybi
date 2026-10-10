import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Download,
  Plus,
  QrCode,
  ScanLine,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashStat } from "./DashStat";
import type { CampusEvent } from "@/types/event";

interface OrganizerDeskProps {
  events: CampusEvent[];
  onCreate: () => void;
  onDownload: () => void;
  onVerifyTicket?: (code: string) => Promise<{ valid: boolean; attendeeName?: string }>;
}

export function OrganizerDesk({
  events,
  onCreate,
  onDownload,
  onVerifyTicket,
}: OrganizerDeskProps) {
  const [verifyCode, setVerifyCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifiedName, setVerifiedName] = useState("Aarav Mehta");

  const handleVerify = async () => {
    if (!verifyCode.trim()) return;
    if (onVerifyTicket) {
      const res = await onVerifyTicket(verifyCode);
      setVerified(res.valid);
      if (res.attendeeName) setVerifiedName(res.attendeeName);
    } else {
      setVerified(true);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
      <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="size-4" /> Organizer desk
          </div>
          <h1 className="font-display text-5xl font-black tracking-tight">Make it official.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Manage your events, see the room fill up, and keep the gate moving.
          </p>
        </div>
        <Button size="lg" onClick={onCreate}>
          <Plus /> Create event
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashStat icon={<Ticket />} value="428" label="tickets sold" trend="+18% this week" />
        <DashStat icon={<Users />} value="₹1,24,860" label="gross sales" trend="Across 4 events" />
        <DashStat icon={<QrCode />} value="176" label="checked in" trend="Tonight · Pulse" />
        <DashStat
          icon={<CalendarDays />}
          value={String(events.length)}
          label="live events"
          trend="2 this week"
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Your events</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep an eye on the numbers that matter.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download /> Export attendees
            </Button>
          </div>
          <div className="divide-y divide-border">
            {events.slice(0, 3).map((event, index) => (
              <div key={event.id} className="flex items-center gap-4 p-5">
                <div
                  className={`poster-${event.poster} flex size-14 shrink-0 items-center justify-center rounded-lg font-display text-xl font-black`}
                >
                  {event.category[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{event.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {event.date} · {event.location}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="font-display text-lg font-black">
                    {[176, 84, 168][index] ?? 100}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    sold
                  </div>
                </div>
                <div className="w-20">
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${
                        index === 1 ? "w-[46%]" : index === 2 ? "w-[78%]" : "w-[88%]"
                      } bg-primary`}
                    />
                  </div>
                  <div className="mt-1 text-right text-[10px] text-muted-foreground">
                    {[88, 46, 78][index] ?? 75}% full
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-foreground bg-foreground p-6 text-background">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            <ScanLine className="size-4" /> Entry desk
          </div>
          <h2 className="mt-4 font-display text-3xl font-black leading-none">Scan a ticket.</h2>
          <p className="mt-3 text-sm leading-6 text-background/70">
            Verify a code manually while the camera scanner is being set up.
          </p>
          <div className="mt-7 flex gap-2">
            <Input
              value={verifyCode}
              onChange={(event) => {
                setVerifyCode(event.target.value);
                setVerified(false);
              }}
              placeholder="VP-84K2"
              className="border-background/20 bg-background/10 text-background placeholder:text-background/40"
            />
            <Button variant="secondary" className="shrink-0" onClick={handleVerify}>
              Verify
            </Button>
          </div>
          {verified ? (
            <div className="mt-5 flex items-center gap-3 rounded-lg bg-mint p-3 text-sm font-semibold text-foreground">
              <span className="flex size-7 items-center justify-center rounded-full bg-background">
                <Check className="size-4" />
              </span>{" "}
              Ticket valid · {verifiedName}
            </div>
          ) : (
            <div className="mt-7 flex items-center gap-3 text-xs text-background/60">
              <QrCode className="size-8" /> Ready for the next guest
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
        <BadgeCheck className="size-4 text-mint" /> Your organizer account is verified for North
        Campus <ArrowRight className="ml-auto size-4" />
      </div>
    </section>
  );
}
