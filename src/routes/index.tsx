import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  LocateFixed,
  MapPin,
  Menu,
  Plus,
  QrCode,
  ScanLine,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import campusNight from "@/assets/campus-night.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VibePass — Campus events, without the chaos" },
      {
        name: "description",
        content: "Discover verified events at North Campus, book tickets safely, and walk in with confidence.",
      },
      { property: "og:title", content: "VibePass — Campus events, without the chaos" },
      {
        property: "og:description",
        content: "The trusted ticketing desk for every event at North Campus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Mode = "explore" | "tickets" | "organizer";
type EventCategory = "All events" | "Music" | "Culture" | "Tech" | "Sports";

type CampusEvent = {
  id: string;
  title: string;
  organizer: string;
  date: string;
  dateShort: string;
  time: string;
  location: string;
  price: number;
  spots: number;
  category: Exclude<EventCategory, "All events">;
  description: string;
  poster: "coral" | "sun" | "mint" | "blue";
  featured?: boolean;
};

const initialEvents: CampusEvent[] = [
  {
    id: "pulse",
    title: "Pulse: The Annual DJ Night",
    organizer: "Cultural Committee",
    date: "Friday, 18 October",
    dateShort: "18 OCT",
    time: "7:00 PM – 11:30 PM",
    location: "Amphitheatre",
    price: 299,
    spots: 118,
    category: "Music",
    description: "A night of live sets, campus food stalls, and the kind of energy you talk about all semester.",
    poster: "coral",
    featured: true,
  },
  {
    id: "tedx",
    title: "TEDx North Campus",
    organizer: "Enactus North",
    date: "Sunday, 20 October",
    dateShort: "20 OCT",
    time: "10:00 AM – 4:00 PM",
    location: "Main Auditorium",
    price: 499,
    spots: 64,
    category: "Culture",
    description: "Ideas, people, and stories that move the campus forward.",
    poster: "sun",
  },
  {
    id: "hacknight",
    title: "Hacknight 2026",
    organizer: "Coding Club",
    date: "Saturday, 26 October",
    dateShort: "26 OCT",
    time: "6:00 PM – 8:00 AM",
    location: "Innovation Lab",
    price: 149,
    spots: 32,
    category: "Tech",
    description: "Ship something weird, useful, or both. Teams, mentors, and midnight chai included.",
    poster: "mint",
  },
  {
    id: "run",
    title: "Run For The Lake",
    organizer: "Sports Board",
    date: "Sunday, 27 October",
    dateShort: "27 OCT",
    time: "6:30 AM – 9:00 AM",
    location: "East Gate",
    price: 99,
    spots: 207,
    category: "Sports",
    description: "A 5K campus run for clean water, fresh air, and a good cause.",
    poster: "blue",
  },
];

const attendees = [
  { name: "Aarav Mehta", event: "Pulse: The Annual DJ Night", code: "VP-84K2", status: "Checked in" },
  { name: "Ishita Rao", event: "Pulse: The Annual DJ Night", code: "VP-91M7", status: "Ready" },
  { name: "Kabir Shah", event: "TEDx North Campus", code: "VP-20P4", status: "Ready" },
  { name: "Meera Nair", event: "Pulse: The Annual DJ Night", code: "VP-62A9", status: "Checked in" },
];

function Index() {
  const [mode, setMode] = useState<Mode>("explore");
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<EventCategory>("All events");
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"details" | "checkout" | "success">("details");
  const [quantity, setQuantity] = useState(1);
  const [bookedEvent, setBookedEvent] = useState<CampusEvent | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
const [authMode, setAuthMode] = useState<"signin" | "signup" | "forgot">("signin");

const openLogin = (mode: "signin" | "signup" | "forgot" = "signin") => {
  setAuthMode(mode);
  setShowLogin(true);
};

  const visibleEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesCategory = category === "All events" || event.category === category;
      const matchesQuery = !normalizedQuery || `${event.title} ${event.organizer} ${event.location}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, events, query]);

  const openEvent = (event: CampusEvent) => {
    setSelectedEvent(event);
    setCheckoutStep("details");
    setQuantity(1);
  };

  const finishBooking = () => {
    if (!selectedEvent) return;
    setBookedEvent(selectedEvent);
    setCheckoutStep("success");
  };

  const downloadAttendees = () => {
    const csv = ["Name,Event,Ticket,Status", ...attendees.map((item) => `${item.name},${item.event},${item.code},${item.status}`)].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "vibepass-attendees.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const addEvent = (event: CampusEvent) => {
    setEvents((current) => [event, ...current]);
    setShowCreate(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="absolute left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
           <Button type="button" variant="ghost" className="h-auto gap-3 p-0 hover:bg-transparent" onClick={() => { setMode("explore"); setMobileNav(false); }} aria-label="Go to VibePass events">
            <span className="depth-mark flex size-10 items-center justify-center rounded-xl bg-primary font-display text-sm font-black tracking-tight text-primary-foreground">
  V<span className="text-white">P</span>
</span>

            <span className="font-display text-[1.4rem] font-black tracking-tight text-white">
  Vibe<span className="text-white">Pass</span>
</span>
          </Button>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <Button variant={mode === "explore" ? "secondary" : "ghost"} size="sm" onClick={() => setMode("explore")}>Explore events</Button>
            <Button
  variant="secondary"
  size="sm"
  onClick={() => setMode("tickets")}
>
  My tickets
  {bookedEvent ? (
    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
      1
    </span>
  ) : null}
</Button>
            <Button
  variant="secondary"
  size="sm"
  onClick={() => setMode("organizer")}
>
  For organizers
</Button>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white"><span className="size-2 rounded-full bg-mint" /> North Campus</span>
            <Button
  variant="outline"
  size="sm"
  onClick={() => openLogin("signin")}
  className="border-primary bg-primary text-white hover:bg-primary/90 hover:text-white"
>
  Sign in
</Button>
          </div>
          <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setMobileNav((open) => !open)} aria-label="Open navigation">
            {mobileNav ? <X /> : <Menu />}
          </Button>
        </div>
        {mobileNav ? (
          <nav className="flex flex-col gap-1 border-t border-border/60 px-5 py-3 md:hidden" aria-label="Mobile navigation">
            <Button variant="ghost" className="justify-start" onClick={() => { setMode("explore"); setMobileNav(false); }}>Explore events</Button>
            <Button variant="ghost" className="justify-start" onClick={() => { setMode("tickets"); setMobileNav(false); }}>My tickets</Button>
            <Button variant="ghost" className="justify-start" onClick={() => { setMode("organizer"); setMobileNav(false); }}>For organizers</Button>
          </nav>
        ) : null}
      </header>

      {mode === "organizer" ? (
        <OrganizerDesk onCreate={() => setShowCreate(true)} onDownload={downloadAttendees} />
      ) : mode === "tickets" ? (
        <TicketsView bookedEvent={bookedEvent} onExplore={() => setMode("explore")} onOpen={openEvent} />
      ) : (
        <>
           <section className="perspective-stage relative isolate min-h-[650px] overflow-hidden border-b border-foreground/10">
             <img className="absolute inset-0 -z-20 size-full object-cover object-center" src={campusNight} alt="Students enjoying a live campus event" width={1440} height={1080} />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
            <div className="mx-auto flex min-h-[650px]  max-w-7xl items-end px-5 py-12 lg:px-10 lg:py-16">
              <div className="max-w-3xl text-night-foreground">
                <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white"><Sparkles className="size-4" /> North Campus · October 2026</div>
  <h1 className="max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl">
  Your campus.<br />
  Your plans. Your vibe.
</h1>
                <p className="mt-6 max-w-lg text-base leading-7 text-night-foreground/75 sm:text-lg">Every event worth showing up for, in one trusted place. Find your people, book in seconds, and walk in with confidence.</p>
                 <div className="depth-panel mt-8 flex max-w-xl items-center gap-3 rounded-xl border border-border bg-card p-2">
                  <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, clubs, or venues" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0" />
                  <Button className="hidden shrink-0 sm:inline-flex" onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}>Find events <ArrowRight /></Button>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-x divide-border px-5 py-5 sm:grid-cols-3 lg:px-10">
              <TrustStat value="18" label="events this month" />
              <TrustStat value="2.4k" label="tickets booked" />
              <TrustStat value="100%" label="verified organizers" />
              <TrustStat value="0" label="fake tickets" />
            </div>
          </section>

          <section id="events" className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><span className="size-2 rounded-full bg-primary" /> Curated for North Campus</div>
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">Happening on campus</h2>
                <p className="mt-3 max-w-xl text-muted-foreground">No DMs. No screenshots. Just real events and tickets that work at the gate.</p>
              </div>
              <Button variant="outline" size="sm" className="self-start sm:self-auto"><LocateFixed /> Near me <ChevronDown /></Button>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-2 border-b border-border pb-4">
              <Filter className="mr-2 size-4 text-muted-foreground" />
              {(["All events", "Music", "Culture", "Tech", "Sports"] as EventCategory[]).map((item) => (
                <Button key={item} variant={category === item ? "default" : "ghost"} size="sm" onClick={() => setCategory(item)}>{item}</Button>
              ))}
              <span className="ml-auto hidden text-xs font-semibold text-muted-foreground sm:block">{visibleEvents.length} events found</span>
            </div>

            {visibleEvents.length ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {visibleEvents.map((event) => <EventCard key={event.id} event={event} onOpen={openEvent} />)}
              </div>
            ) : (
              <div className="mt-8 border border-dashed border-border px-6 py-20 text-center"><Search className="mx-auto size-8 text-muted-foreground" /><h3 className="mt-4 font-display text-2xl font-bold">No events found</h3><p className="mt-2 text-sm text-muted-foreground">Try another search or browse all events.</p><Button variant="outline" className="mt-5" onClick={() => { setQuery(""); setCategory("All events"); }}>Clear filters</Button></div>
            )}
          </section>

          <section className="border-y border-border bg-secondary/50">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
              <div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mint text-foreground"><ShieldCheck className="size-5" /></span><div><h3 className="font-display text-xl font-bold">Tickets you can trust</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Every VibePass ticket is tied to one person, one order, and one scannable QR code. No duplicates. No awkward gate calls.</p></div></div>
              <Button variant="outline" onClick={() => setMode("tickets")}>View my tickets <ArrowRight /></Button>
            </div>
          </section>
        </>
      )}

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10"><span className="font-display text-base font-black text-foreground">VibePass<span className="text-primary">.</span></span><span>Built for North Campus, by North Campus.</span><span>© 2026 VibePass</span></footer>

      <Dialog open={Boolean(selectedEvent)} onOpenChange={(open) => { if (!open) setSelectedEvent(null); }}>
        {selectedEvent ? <EventDialog event={selectedEvent} step={checkoutStep} quantity={quantity} onQuantity={setQuantity} onContinue={() => setCheckoutStep("checkout")} onFinish={finishBooking} onClose={() => setSelectedEvent(null)} /> : null}
      </Dialog>
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <CreateEventDialog onCreate={addEvent} />
      </Dialog>
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
  <LoginDialog
    mode={authMode}
    onModeChange={setAuthMode}
    onClose={() => setShowLogin(false)}
  />
</Dialog>
    </main>
  );
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return <div className="px-4 first:pl-0 last:pr-0 sm:px-7"><div className="font-display text-2xl font-black sm:text-3xl">{value}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">{label}</div></div>;
}

function EventCard({ event, onOpen }: { event: CampusEvent; onOpen: (event: CampusEvent) => void }) {
  return (
    <article className="depth-card group overflow-hidden rounded-xl border border-border bg-card shadow-sm">
     <div className="relative flex aspect-[1.18] flex-col justify-between overflow-hidden bg-black p-5">
        <div className="flex items-start justify-between"><span className="inline-flex items-center rounded-md bg-black text-white/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-foreground">{event.category}</span><span className="font-display text-right text-xs font-bold uppercase leading-4 opacity-70">{event.dateShort.split(" ")[0]}<br />{event.dateShort.split(" ")[1]}</span></div>
        <div><div className="mb-2 h-px w-10 bg-current opacity-60" /><h3 className="max-w-[13rem] font-display text-3xl font-black uppercase tracking-[-0.12em] text-white">{event.title}</h3></div>
        <div className="pointer-events-none absolute -bottom-8 -right-3 font-display text-[7rem] font-black leading-none opacity-10">{event.category[0]}</div>
      </div>
      <div className="p-5"><div className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-3.5" /> {event.date}</div><h3 className="mt-2 line-clamp-2 min-h-12 font-display text-lg font-bold leading-6">{event.title}</h3><div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="size-3.5" /> {event.location}</div><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><div><span className="text-xs text-muted-foreground">from</span> <span className="font-display text-lg font-black">₹{event.price}</span></div><Button size="sm" onClick={() => onOpen(event)}>Get tickets <ArrowRight className="transition-transform group-hover:translate-x-0.5" /></Button></div></div>
    </article>
  );
}

function EventDialog({ event, step, quantity, onQuantity, onContinue, onFinish, onClose }: { event: CampusEvent; step: "details" | "checkout" | "success"; quantity: number; onQuantity: (quantity: number) => void; onContinue: () => void; onFinish: () => void; onClose: () => void }) {
  return (
    <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-border bg-background p-0">
      {step === "success" ? <SuccessTicket event={event} onClose={onClose} /> : <>
        <div className={`poster-${event.poster} flex min-h-44 flex-col justify-end p-6`}><span className="mb-auto inline-flex w-fit rounded-md bg-background/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]">{event.category}</span><h2 className="max-w-sm font-display text-4xl font-black leading-[0.95]">{event.title}</h2></div>
        <div className="p-6"><DialogHeader><DialogTitle className="font-display text-2xl">{step === "checkout" ? "Almost there." : "Make a plan."}</DialogTitle><DialogDescription>{step === "checkout" ? "Your secure demo checkout is ready. No real payment will be taken." : event.description}</DialogDescription></DialogHeader>
          <div className="mt-6 space-y-4 text-sm"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="size-4" /> {event.date}</span><span className="flex items-center gap-2 text-muted-foreground"><Clock3 className="size-4" /> {event.time}</span></div><div className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" /> {event.location} · by {event.organizer}</div></div>
          {step === "details" ? <><div className="mt-7 flex items-center justify-between rounded-lg bg-secondary p-4"><div><div className="font-semibold">General entry</div><div className="mt-1 text-xs text-muted-foreground">QR ticket · instant delivery</div></div><div className="text-right"><div className="font-display text-2xl font-black">₹{event.price}</div><div className="text-xs text-muted-foreground">per person</div></div></div><div className="mt-4 flex items-center justify-between"><span className="text-sm font-semibold">How many tickets?</span><div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => onQuantity(Math.max(1, quantity - 1))} aria-label="Decrease ticket quantity"><ChevronLeft /></Button><span className="flex w-8 justify-center font-display text-lg font-bold">{quantity}</span><Button variant="outline" size="icon" onClick={() => onQuantity(Math.min(6, quantity + 1))} aria-label="Increase ticket quantity"><ChevronRight /></Button></div></div><Button className="mt-7 w-full" size="lg" onClick={onContinue}>Continue to checkout <ArrowRight /></Button></> : <CheckoutForm event={event} quantity={quantity} onFinish={onFinish} />}
         </div>
      </>}
    </DialogContent>
  );
}

function CheckoutForm({ event, quantity, onFinish }: { event: CampusEvent; quantity: number; onFinish: () => void }) {
  return <form className="mt-6 space-y-4" onSubmit={(eventSubmit) => { eventSubmit.preventDefault(); onFinish(); }}><label className="block text-sm font-semibold">Your name<Input required className="mt-2" placeholder="e.g. Ananya Sharma" /></label><label className="block text-sm font-semibold">College email<Input required type="email" className="mt-2" placeholder="you@northcampus.edu" /></label><div className="flex items-center justify-between border-y border-border py-4"><span className="text-sm text-muted-foreground">{quantity} × General entry</span><span className="font-display text-xl font-black">₹{event.price * quantity}</span></div><Button className="w-full" size="lg" type="submit">Pay ₹{event.price * quantity} <ShieldCheck /></Button><p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground"><ShieldCheck className="size-3.5 text-mint" /> Demo checkout · no real payment taken</p></form>;
}

function SuccessTicket({ event, onClose }: { event: CampusEvent; onClose: () => void }) {
  return <div className="depth-panel m-2 p-7"><div className="flex items-center gap-2 text-sm font-bold text-muted-foreground"><span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" /></span> Booking confirmed</div><h2 className="mt-5 font-display text-4xl font-black leading-none">You’re on the list.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Your ticket for {event.title} is ready. Show this code at the gate.</p><div className="mt-7 flex flex-col items-center rounded-xl border border-border bg-secondary p-6"><QrPattern /><div className="mt-4 font-mono text-sm font-bold tracking-[0.25em]">VP-7N4Q</div><span className="mt-2 text-xs text-muted-foreground">Valid for {event.dateShort}</span></div><div className="mt-5 flex items-center justify-between text-sm"><span className="text-muted-foreground">{event.time}</span><span className="flex items-center gap-1.5 font-semibold"><BadgeCheck className="size-4" /> Verified</span></div><Button className="mt-7 w-full" size="lg" onClick={onClose}>Done <Check /></Button></div>;
}

function QrPattern() {
  const cells = Array.from({ length: 81 }, (_, index) => { const x = index % 9; const y = Math.floor(index / 9); const finder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5); return finder ? (x === 1 && y === 1) || (x === 7 && y === 1) || (x === 1 && y === 7) || x === 0 || y === 0 || x === 2 || y === 2 || x === 6 || y === 6 || x === 8 || y === 8 : (index * 7 + x * 3 + y) % 5 < 2; });
  return <div aria-label="Ticket QR code" className="grid size-36 grid-cols-9 gap-1 bg-background p-2">{cells.map((filled, index) => <span key={index} className={filled ? "bg-foreground" : "bg-background"} />)}</div>;
}

function TicketsView({ bookedEvent, onExplore, onOpen }: { bookedEvent: CampusEvent | null; onExplore: () => void; onOpen: (event: CampusEvent) => void }) {
  return <section className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20"><div className="mb-10"><div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Ticket className="size-4" /> Your wallet</div><h1 className="font-display text-5xl font-black tracking-tight">My tickets</h1><p className="mt-3 text-muted-foreground">Your next good night out, all in one place.</p></div>{bookedEvent ? <div className="max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className={`poster-${bookedEvent.poster} p-7`}><span className="inline-flex items-center gap-1.5 rounded-md bg-mint px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"><Check className="size-3" /> Confirmed</span><h2 className="mt-12 max-w-md font-display text-4xl font-black leading-none">{bookedEvent.title}</h2></div><div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-semibold"><CalendarDays className="size-4 text-primary" /> {bookedEvent.date}</div><div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" /> {bookedEvent.location}</div></div><Button onClick={() => onOpen(bookedEvent)}>Show QR ticket <QrCode /></Button></div></div> : <div className="border border-dashed border-border px-6 py-24 text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary"><Ticket className="size-6 text-muted-foreground" /></span><h2 className="mt-5 font-display text-2xl font-bold">Your wallet is empty</h2><p className="mt-2 text-sm text-muted-foreground">Find something worth showing up for.</p><Button className="mt-6" onClick={onExplore}>Explore events <ArrowRight /></Button></div>}</section>;
}

function OrganizerDesk({ onCreate, onDownload }: { onCreate: () => void; onDownload: () => void }) {
  const [verifyCode, setVerifyCode] = useState("");
  const [verified, setVerified] = useState(false);
  return <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-16"><div className="flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Sparkles className="size-4" /> Organizer desk</div><h1 className="font-display text-5xl font-black tracking-tight">Make it official.</h1><p className="mt-3 max-w-xl text-muted-foreground">Manage your events, see the room fill up, and keep the gate moving.</p></div><Button size="lg" onClick={onCreate}><Plus /> Create event</Button></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><DashStat icon={<Ticket />} value="428" label="tickets sold" trend="+18% this week" /><DashStat icon={<Users />} value="₹1,24,860" label="gross sales" trend="Across 4 events" /><DashStat icon={<QrCode />} value="176" label="checked in" trend="Tonight · Pulse" /><DashStat icon={<CalendarDays />} value="4" label="live events" trend="2 this week" /></div><div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]"><div className="rounded-xl border border-border bg-card"><div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-2xl font-bold">Your events</h2><p className="mt-1 text-sm text-muted-foreground">Keep an eye on the numbers that matter.</p></div><Button variant="outline" size="sm" onClick={onDownload}><Download /> Export attendees</Button></div><div className="divide-y divide-border">{initialEvents.slice(0, 3).map((event, index) => <div key={event.id} className="flex items-center gap-4 p-5"><div className={`poster-${event.poster} flex size-14 shrink-0 items-center justify-center rounded-lg font-display text-xl font-black`}>{event.category[0]}</div><div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{event.title}</h3><p className="mt-1 text-xs text-muted-foreground">{event.date} · {event.location}</p></div><div className="hidden text-right sm:block"><div className="font-display text-lg font-black">{[176, 84, 168][index]}</div><div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">sold</div></div><div className="w-20"><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full ${index === 1 ? "w-[46%]" : index === 2 ? "w-[78%]" : "w-[88%]"} bg-primary`} /></div><div className="mt-1 text-right text-[10px] text-muted-foreground">{[88, 46, 78][index]}% full</div></div></div>)}</div></div><div className="rounded-xl border border-foreground bg-foreground p-6 text-background"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent"><ScanLine className="size-4" /> Entry desk</div><h2 className="mt-4 font-display text-3xl font-black leading-none">Scan a ticket.</h2><p className="mt-3 text-sm leading-6 text-background/70">Verify a code manually while the camera scanner is being set up.</p><div className="mt-7 flex gap-2"><Input value={verifyCode} onChange={(event) => { setVerifyCode(event.target.value); setVerified(false); }} placeholder="VP-84K2" className="border-background/20 bg-background/10 text-background placeholder:text-background/40" /><Button variant="secondary" className="shrink-0" onClick={() => setVerified(Boolean(verifyCode.trim()))}>Verify</Button></div>{verified ? <div className="mt-5 flex items-center gap-3 rounded-lg bg-mint p-3 text-sm font-semibold text-foreground"><span className="flex size-7 items-center justify-center rounded-full bg-background"><Check className="size-4" /></span> Ticket valid · Aarav Mehta</div> : <div className="mt-7 flex items-center gap-3 text-xs text-background/60"><QrCode className="size-8" /> Ready for the next guest</div>}</div></div><div className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-xs text-muted-foreground"><BadgeCheck className="size-4 text-mint" /> Your organizer account is verified for North Campus <ArrowRight className="ml-auto size-4" /></div></section>;
}

function DashStat({ icon, value, label, trend }: { icon: React.ReactNode; value: string; label: string; trend: string }) {
  return <div className="rounded-xl border border-border bg-card p-5"><div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">{icon}</div><div className="mt-5 font-display text-3xl font-black">{value}</div><div className="mt-1 text-sm font-semibold">{label}</div><div className="mt-2 text-xs text-muted-foreground">{trend}</div></div>;
}

function CreateEventDialog({ onCreate }: { onCreate: (event: CampusEvent) => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  return <DialogContent className="max-w-md border-border bg-background"><DialogHeader><DialogTitle className="font-display text-3xl">Create an event</DialogTitle><DialogDescription>Put the essentials in first. You can add the details later.</DialogDescription></DialogHeader><form className="mt-5 space-y-4" onSubmit={(formEvent) => { formEvent.preventDefault(); onCreate({ id: `new-${Date.now()}`, title, organizer: "Your organizer account", date: date || "Saturday, 2 November", dateShort: "02 NOV", time: "7:00 PM – 10:00 PM", location: "Main Quadrangle", price: 199, spots: 100, category: "Culture", description: "A new event on North Campus.", poster: "sun" }); }}><label className="block text-sm font-semibold">Event name<Input value={title} onChange={(event) => setTitle(event.target.value)} required className="mt-2" placeholder="e.g. Open Mic Night" /></label><label className="block text-sm font-semibold">Date<Input value={date} onChange={(event) => setDate(event.target.value)} className="mt-2" placeholder="e.g. Saturday, 2 November" /></label><Button className="mt-3 w-full" size="lg" type="submit">Publish event <ArrowRight /></Button></form></DialogContent>;
}
function LoginDialog({
  mode,
  onModeChange,
  onClose,
}: {
  mode: "signin" | "signup" | "forgot";
  onModeChange: (mode: "signin" | "signup" | "forgot") => void;
  onClose: () => void;
}) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "signin") {
      alert("Sign in successful! (Demo)");
      onClose();
    }

    if (mode === "signup") {
      alert("Account created successfully! (Demo)");
      onClose();
    }

    if (mode === "forgot") {
      alert("Password reset link sent! (Demo)");
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login will be connected later.");
  };

  return (
    <DialogContent className="max-w-md border-border bg-background">
      <DialogHeader>
        <DialogTitle className="font-display text-3xl font-black">
          {mode === "signin"
            ? "Welcome back."
            : mode === "signup"
              ? "Create your account."
              : "Forgot password?"}
        </DialogTitle>

        <DialogDescription>
          {mode === "signin"
            ? "Sign in to manage your tickets and events."
            : mode === "signup"
              ? "Create your VibePass account in a few seconds."
              : "Enter your email and we'll send you a reset link."}
        </DialogDescription>
      </DialogHeader>

      {mode === "forgot" ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Email address
            <Input
              required
              type="email"
              className="mt-2"
              placeholder="you@example.com"
            />
          </label>

          <Button className="w-full" size="lg" type="submit">
            Send reset link
          </Button>

          <button
            type="button"
            onClick={() => onModeChange("signin")}
            className="w-full text-sm font-semibold text-primary hover:underline"
          >
            ← Back to Sign in
          </button>
        </form>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <label className="block text-sm font-semibold">
                Full name
                <Input
                  required
                  className="mt-2"
                  placeholder="Your name"
                />
              </label>
            )}

            <label className="block text-sm font-semibold">
              Email address
              <Input
                required
                type="email"
                className="mt-2"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-sm font-semibold">
              Password
              <Input
                required
                type="password"
                className="mt-2"
                placeholder="••••••••"
              />
            </label>

            {mode === "signup" && (
              <label className="block text-sm font-semibold">
                Confirm password
                <Input
                  required
                  type="password"
                  className="mt-2"
                  placeholder="••••••••"
                />
              </label>
            )}

            {mode === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onModeChange("forgot")}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button className="w-full" size="lg" type="submit">
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground">
              OR
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGoogleLogin}
          >
            <span className="font-bold text-lg">G</span>
            Continue with Google
          </Button>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange("signup")}
                  className="font-bold text-primary hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange("signin")}
                  className="font-bold text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </>
      )}
    </DialogContent>
  );
}