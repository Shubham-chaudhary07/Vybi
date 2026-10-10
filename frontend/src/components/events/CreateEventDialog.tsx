import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { CampusEvent } from "@/types/event";

interface CreateEventDialogProps {
  onCreate: (event: CampusEvent) => void;
}

export function CreateEventDialog({ onCreate }: CreateEventDialogProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  return (
    <DialogContent className="max-w-md border-border bg-background">
      <DialogHeader>
        <DialogTitle className="font-display text-3xl">Create an event</DialogTitle>
        <DialogDescription>
          Put the essentials in first. You can add the details later.
        </DialogDescription>
      </DialogHeader>
      <form
        className="mt-5 space-y-4"
        onSubmit={(formEvent) => {
          formEvent.preventDefault();
          onCreate({
            id: `new-${Date.now()}`,
            title,
            organizer: "Your organizer account",
            date: date || "Saturday, 2 November",
            dateShort: "02 NOV",
            time: "7:00 PM – 10:00 PM",
            location: "Main Quadrangle",
            price: 199,
            spots: 100,
            category: "Culture",
            description: "A new event on North Campus.",
            poster: "sun",
          });
        }}
      >
        <label className="block text-sm font-semibold">
          Event name
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-2"
            placeholder="e.g. Open Mic Night"
          />
        </label>
        <label className="block text-sm font-semibold">
          Date
          <Input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2"
            placeholder="e.g. Saturday, 2 November"
          />
        </label>
        <Button className="mt-3 w-full" size="lg" type="submit">
          Publish event <ArrowRight />
        </Button>
      </form>
    </DialogContent>
  );
}
