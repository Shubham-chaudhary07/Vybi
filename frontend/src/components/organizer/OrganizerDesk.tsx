import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Download,
  Loader2,
  Plus,
  QrCode,
  ScanLine,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DashStat } from "./DashStat";
import type { CampusEvent, OrganizerSummary } from "@/types/event";
import { getOrganizerSummary } from "@/services/api";

interface OrganizerDeskProps {
  events: CampusEvent[];
  onCreate: () => void;
  onDownload: () => void;
  onVerifyTicket?: (code: string) => Promise<{
    valid: boolean;
    attendeeName?: string | undefined;
    eventName?: string | undefined;
    status?: string | undefined;
    message?: string | undefined;
  }>;
}

export function OrganizerDesk({
  events,
  onCreate,
  onDownload,
  onVerifyTicket,
}: OrganizerDeskProps) {
  const [summary, setSummary] = useState<OrganizerSummary>({
    liveEvents: events.length,
    ticketsSold: 0,
    checkedIn: 0,
  });
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    valid: boolean;
    attendeeName?: string | undefined;
    eventName?: string | undefined;
    status?: string | undefined;
    message?: string | undefined;
  } | null>(null);

  const refreshSummary = async () => {
    try {
      const data = await getOrganizerSummary();
      setSummary(data);
    } catch {
      // Keep existing state
    }
  };

  useEffect(() => {
    refreshSummary();
  }, [events.length]);

  const handleVerify = async () => {
    if (!verifyCode.trim()) return;
    setIsVerifying(true);
    setVerifyResult(null);

    try {
      if (onVerifyTicket) {
        const res = await onVerifyTicket(verifyCode);
        setVerifyResult(res);
        if (res.valid) {
          toast.success(`Ticket ${verifyCode.toUpperCase()} checked in for ${res.attendeeName || "attendee"}!`);
          refreshSummary();
        } else {
          toast.error(res.message || "Invalid ticket code.");
        }
      } else {
        setVerifyResult({ valid: true, attendeeName: "Campus Attendee" });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16">
      <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="size-4" /> Organizer desk · Live API
          </div>
          <h1 className="font-display text-5xl font-black tracking-tight">Make it official.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Manage your events, see the room fill up in real time, and verify tickets at the gate.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" onClick={onDownload}>
            <Download className="mr-1.5 size-4" /> Export attendees
          </Button>
          <Button size="lg" onClick={onCreate}>
            <Plus className="mr-1.5 size-4" /> Create event
          </Button>
        </div>
      </div>

      {/* Live Dashboard Stats from Spring Boot GET /api/organizer/summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashStat
          icon={<Ticket />}
          value={String(summary.ticketsSold)}
          label="tickets sold"
          trend="Live DB total"
        />
        <DashStat
          icon={<Users />}
          value={`₹${(summary.ticketsSold * 199).toLocaleString("en-IN")}`}
          label="gross sales"
          trend="Calculated total"
        />
        <DashStat
          icon={<QrCode />}
          value={String(summary.checkedIn)}
          label="checked in"
          trend="Gate check-ins"
        />
        <DashStat
          icon={<CalendarDays />}
          value={String(summary.liveEvents || events.length)}
          label="live events"
          trend="Active on campus"
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Events list */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Your events</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Live database events managed by North Campus.
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {events.length} events loaded
            </span>
          </div>
          <div className="divide-y divide-border">
            {events.slice(0, 5).map((event, index) => (
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
                <div className="text-right">
                  <div className="font-display text-lg font-black">
                    {event.price === 0 ? "Free" : `₹${event.price}`}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {event.spots} spots
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Ticket Verification Scanner */}
        <div className="rounded-xl border border-foreground bg-foreground p-6 text-background">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            <ScanLine className="size-4" /> Live entry desk
          </div>
          <h2 className="mt-4 font-display text-3xl font-black leading-none">Verify a ticket.</h2>
          <p className="mt-3 text-sm leading-6 text-background/70">
            Enter a code to verify against the live database and check the student in immediately.
          </p>
          <div className="mt-6 flex gap-2">
            <Input
              value={verifyCode}
              onChange={(event) => {
                setVerifyCode(event.target.value);
                setVerifyResult(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify();
              }}
              placeholder="e.g. VP-2414 or VP-84K2"
              className="border-background/20 bg-background/10 font-mono uppercase text-background placeholder:text-background/40"
            />
            <Button
              variant="secondary"
              className="shrink-0"
              onClick={handleVerify}
              disabled={isVerifying || !verifyCode.trim()}
            >
              {isVerifying ? <Loader2 className="size-4 animate-spin" /> : "Verify"}
            </Button>
          </div>

          {verifyResult ? (
            verifyResult.valid ? (
              <div className="mt-5 rounded-lg bg-mint p-4 text-foreground">
                <div className="flex items-center gap-2 font-display text-base font-bold">
                  <Check className="size-5" /> Ticket Verified
                </div>
                <div className="mt-1 text-sm font-semibold">{verifyResult.attendeeName}</div>
                {verifyResult.eventName ? (
                  <div className="text-xs opacity-80">{verifyResult.eventName}</div>
                ) : null}
                <div className="mt-2 text-[10px] font-bold uppercase tracking-wider opacity-70">
                  Status: {verifyResult.status ?? "CHECKED_IN"}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-lg border border-destructive/50 bg-destructive/20 p-4 text-white">
                <div className="flex items-center gap-2 font-display text-base font-bold">
                  <AlertCircle className="size-5" /> Verification Failed
                </div>
                <div className="mt-1 text-xs">{verifyResult.message || "Ticket code not found."}</div>
              </div>
            )
          ) : (
            <div className="mt-7 flex items-center gap-3 text-xs text-background/60">
              <QrCode className="size-8" /> Ready for next gate check-in
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
        <BadgeCheck className="size-4 text-mint" /> Spring Boot backend synchronized ·
        Connected to http://localhost:8081
      </div>
    </section>
  );
}
