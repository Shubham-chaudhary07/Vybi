import { useState } from "react";
import { ArrowRight, CalendarDays, Loader2, MapPin, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CampusEvent, CreateEventPayload, EventCategory } from "@/types/event";

interface CreateEventDialogProps {
  onCreate: (payload: CreateEventPayload) => Promise<void>;
  onClose?: () => void;
}

const CATEGORIES: Array<Exclude<EventCategory, "All events">> = [
  "Music",
  "Culture",
  "Tech",
  "Sports",
];

export function CreateEventDialog({ onCreate, onClose }: CreateEventDialogProps) {
  const [title, setTitle] = useState("");
  const [organizer, setOrganizer] = useState("North Campus Society");
  const [category, setCategory] = useState<Exclude<EventCategory, "All events">>("Music");
  const [date, setDate] = useState("Saturday, 14 November 2026");
  const [dateShort, setDateShort] = useState("14 NOV");
  const [time, setTime] = useState("7:00 PM – 10:30 PM");
  const [location, setLocation] = useState("Main Quadrangle");
  const [price, setPrice] = useState("199");
  const [spots, setSpots] = useState("120");
  const [description, setDescription] = useState(
    "A vibrant campus gathering featuring live music, food stalls, and great vibes.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    // Auto-derive a 2-word short date if possible
    const parts = newDate.replace(/,/g, "").split(" ").filter(Boolean);
    if (parts.length >= 2) {
      const day = parts.find((p) => /^\d+$/.test(p)) ?? parts[1];
      const month =
        parts.find((p) => /^[A-Za-z]{3,}$/.test(p) && !p.toLowerCase().includes("day")) ?? parts[0];
      if (day && month) {
        setDateShort(`${day} ${month.slice(0, 3).toUpperCase()}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Event title is required");
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await onCreate({
        title: title.trim(),
        organizer: organizer.trim() || "Campus Organizer",
        category,
        date: date.trim(),
        dateShort: dateShort.trim() || "TBA",
        time: time.trim() || "7:00 PM",
        location: location.trim() || "North Campus",
        price: Math.max(0, Number(price) || 0),
        spots: Math.max(1, Number(spots) || 100),
        description: description.trim() || "A campus event worth showing up for.",
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-border bg-background p-6">
      <DialogHeader>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
          <Sparkles className="size-4" /> Live on North Campus
        </div>
        <DialogTitle className="font-display text-3xl font-black">Publish an Event</DialogTitle>
        <DialogDescription>
          Fill in the details below. This will register the event on the Spring Boot backend and
          make it immediately bookable by students.
        </DialogDescription>
      </DialogHeader>

      {errorMessage ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Event Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1.5 h-10 font-semibold"
            placeholder="e.g. Pulse: Neon DJ Night"
          />
        </div>

        {/* Category & Organizer */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Category *
            </label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs font-semibold"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Club / Organizer *
            </label>
            <Input
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              required
              className="mt-1.5 h-10"
              placeholder="e.g. Cultural Committee"
            />
          </div>
        </div>

        {/* Date & Date Short */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <CalendarDays className="size-3.5" /> Full Date *
            </label>
            <Input
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              required
              className="mt-1.5 h-10"
              placeholder="e.g. Saturday, 14 November 2026"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Badge Date *
            </label>
            <Input
              value={dateShort}
              onChange={(e) => setDateShort(e.target.value)}
              required
              className="mt-1.5 h-10 font-mono text-xs uppercase"
              placeholder="14 NOV"
            />
          </div>
        </div>

        {/* Time & Location */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Time *
            </label>
            <Input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="mt-1.5 h-10"
              placeholder="e.g. 7:00 PM – 10:30 PM"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <MapPin className="size-3.5" /> Venue / Location *
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1.5 h-10"
              placeholder="e.g. Main Amphitheatre"
            />
          </div>
        </div>

        {/* Price & Capacity Spots */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Ticket className="size-3.5" /> Price (₹ per ticket) *
            </label>
            <Input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1.5 h-10"
              placeholder="0 (Free) or 199"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Max Spots / Capacity *
            </label>
            <Input
              type="number"
              min="1"
              value={spots}
              onChange={(e) => setSpots(e.target.value)}
              required
              className="mt-1.5 h-10"
              placeholder="100"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Description *
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="mt-1.5 resize-none text-sm leading-relaxed"
            placeholder="Tell students why they should show up..."
          />
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-3 pt-2">
          {onClose ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          ) : null}
          <Button className="flex-1 sm:flex-initial sm:min-w-[180px]" size="lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Publishing...
              </>
            ) : (
              <>
                Publish event <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
