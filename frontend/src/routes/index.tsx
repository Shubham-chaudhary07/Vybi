import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Filter,
  LocateFixed,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/events/HeroSection";
import { TrustStatsBar } from "@/components/events/TrustStats";
import { EventCard } from "@/components/events/EventCard";
import { EventDialog } from "@/components/events/EventDialog";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { TicketsView } from "@/components/tickets/TicketsView";
import { OrganizerDesk } from "@/components/organizer/OrganizerDesk";

import type { CampusEvent, CreateEventPayload, EventCategory, Mode } from "@/types/event";
import { initialEvents } from "@/data/mockEvents";
import {
  bookTickets,
  createEvent,
  exportAttendeesCsv,
  getEvents,
  verifyTicket,
} from "@/services/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VibePass — Campus events, without the chaos" },
      {
        name: "description",
        content:
          "Discover verified events at North Campus, book tickets safely, and walk in with confidence.",
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

function Index() {
  const [mode, setMode] = useState<Mode>("explore");
  const [events, setEvents] = useState<CampusEvent[]>(initialEvents);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<EventCategory>("All events");
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"details" | "checkout" | "success">("details");
  const [quantity, setQuantity] = useState(1);
  const [bookedEvent, setBookedEvent] = useState<CampusEvent | null>(null);
  const [bookedTicketCode, setBookedTicketCode] = useState<string>("VP-7N4Q");
  const [showCreate, setShowCreate] = useState(false);

  // Sync with backend API if running
  useEffect(() => {
    getEvents().then((data) => {
      if (data && data.length) setEvents(data);
    });
  }, []);

  const visibleEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesCategory = category === "All events" || event.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${event.title} ${event.organizer} ${event.location}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, events, query]);

  const openEvent = (event: CampusEvent) => {
    setSelectedEvent(event);
    setCheckoutStep("details");
    setQuantity(1);
  };

  const handleFinishBooking = async (name: string, email: string) => {
    if (!selectedEvent) return;
    const res = await bookTickets(selectedEvent.id, name, email, quantity);
    setBookedTicketCode(res.ticketCode);
    setBookedEvent(selectedEvent);
    setCheckoutStep("success");
    toast.success("Booking confirmed! Ticket added to your wallet.");
  };

  const handleAddEvent = async (payload: CreateEventPayload) => {
    const { event, isBackendLive } = await createEvent(payload);
    setEvents((current) => [event, ...current]);
    setShowCreate(false);
    setMode("explore");

    if (isBackendLive) {
      toast.success(`"${event.title}" published to live database!`);
    } else {
      toast.info(`"${event.title}" saved locally (backend offline).`);
    }

    // Smooth scroll down to the events feed to showcase the newly created event
    setTimeout(() => {
      document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar
        mode={mode}
        hasBookedTicket={Boolean(bookedEvent)}
        onSelectMode={(newMode) => setMode(newMode)}
        onHostEvent={() => setShowCreate(true)}
      />

      {mode === "organizer" ? (
        <OrganizerDesk
          events={events}
          onCreate={() => setShowCreate(true)}
          onDownload={() => exportAttendeesCsv()}
          onVerifyTicket={verifyTicket}
        />
      ) : mode === "tickets" ? (
        <TicketsView
          bookedEvent={bookedEvent}
          onExplore={() => setMode("explore")}
          onOpen={openEvent}
        />
      ) : (
        <>
          <HeroSection
            query={query}
            onQueryChange={setQuery}
            onFindEvents={() =>
              document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })
            }
          />

          <TrustStatsBar />

          <section id="events" className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  <span className="size-2 rounded-full bg-primary" /> Curated for North Campus
                </div>
                <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
                  Happening on campus
                </h2>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  No DMs. No screenshots. Just real events and tickets that work at the gate.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <Button variant="outline" size="sm">
                  <LocateFixed /> Near me <ChevronDown />
                </Button>
                <Button size="sm" onClick={() => setShowCreate(true)}>
                  <Plus className="mr-1.5 size-4" /> Host an event
                </Button>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-2 border-b border-border pb-4">
              <Filter className="mr-2 size-4 text-muted-foreground" />
              {(["All events", "Music", "Culture", "Tech", "Sports"] as EventCategory[]).map(
                (item) => (
                  <Button
                    key={item}
                    variant={category === item ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </Button>
                ),
              )}
              <span className="ml-auto hidden text-xs font-semibold text-muted-foreground sm:block">
                {visibleEvents.length} events found
              </span>
            </div>

            {visibleEvents.length ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {visibleEvents.map((event) => (
                  <EventCard key={event.id} event={event} onOpen={openEvent} />
                ))}
              </div>
            ) : (
              <div className="mt-8 border border-dashed border-border px-6 py-20 text-center">
                <Search className="mx-auto size-8 text-muted-foreground" />
                <h3 className="mt-4 font-display text-2xl font-bold">No events found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another search or browse all events.
                </p>
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => {
                    setQuery("");
                    setCategory("All events");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </section>

          <section className="border-y border-border bg-secondary/50">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mint text-foreground">
                  <ShieldCheck className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold">Tickets you can trust</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Every VibePass ticket is tied to one person, one order, and one scannable QR
                    code. No duplicates. No awkward gate calls.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setMode("tickets")}>
                View my tickets <ArrowRight />
              </Button>
            </div>
          </section>
        </>
      )}

      <Footer />

      <Dialog
        open={Boolean(selectedEvent)}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      >
        {selectedEvent ? (
          <EventDialog
            event={selectedEvent}
            step={checkoutStep}
            quantity={quantity}
            bookedTicketCode={bookedTicketCode}
            onQuantity={setQuantity}
            onContinue={() => setCheckoutStep("checkout")}
            onFinish={handleFinishBooking}
            onClose={() => setSelectedEvent(null)}
          />
        ) : null}
      </Dialog>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        {showCreate ? (
          <CreateEventDialog
            onCreate={handleAddEvent}
            onClose={() => setShowCreate(false)}
          />
        ) : null}
      </Dialog>

      <Toaster position="bottom-right" />
    </main>
  );
}
