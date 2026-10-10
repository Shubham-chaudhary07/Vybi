import { useState } from "react";
import { Menu, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Mode } from "@/types/event";

interface NavbarProps {
  mode: Mode;
  hasBookedTicket: boolean;
  onSelectMode: (mode: Mode) => void;
  onHostEvent?: () => void;
}

export function Navbar({ mode, hasBookedTicket, onSelectMode, onHostEvent }: NavbarProps) {
  const [mobileNav, setMobileNav] = useState(false);

  const handleSelect = (newMode: Mode) => {
    onSelectMode(newMode);
    setMobileNav(false);
  };

  return (
    <header className="border-b border-border/70 bg-background">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Button
          type="button"
          variant="ghost"
          className="h-auto gap-3 p-0 hover:bg-transparent"
          onClick={() => handleSelect("explore")}
          aria-label="Go to VibePass events"
        >
          <span className="depth-mark flex size-10 items-center justify-center rounded-xl bg-primary font-display text-sm font-black tracking-tight text-primary-foreground">
            VP
          </span>
          <span className="font-display text-[1.4rem] font-black tracking-tight">
            Vibe<span className="text-accent">Pass</span>
          </span>
        </Button>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Button
            variant={mode === "explore" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleSelect("explore")}
          >
            Explore events
          </Button>
          <Button
            variant={mode === "tickets" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleSelect("tickets")}
          >
            My tickets{" "}
            {hasBookedTicket ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                1
              </span>
            ) : null}
          </Button>
          <Button
            variant={mode === "organizer" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleSelect("organizer")}
          >
            For organizers
          </Button>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <span className="size-2 rounded-full bg-mint" /> North Campus
          </span>
          {onHostEvent ? (
            <Button size="sm" onClick={onHostEvent}>
              <Plus className="mr-1 size-3.5" /> Host event
            </Button>
          ) : null}
          <Button variant="outline" size="sm" onClick={() => handleSelect("organizer")}>
            Organizer login
          </Button>
        </div>

        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          onClick={() => setMobileNav((open) => !open)}
          aria-label="Open navigation"
        >
          {mobileNav ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileNav ? (
        <nav
          className="flex flex-col gap-1 border-t border-border/60 px-5 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <Button variant="ghost" className="justify-start" onClick={() => handleSelect("explore")}>
            Explore events
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => handleSelect("tickets")}>
            My tickets
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => handleSelect("organizer")}
          >
            For organizers
          </Button>
          {onHostEvent ? (
            <Button
              size="sm"
              className="mt-2 justify-center"
              onClick={() => {
                onHostEvent();
                setMobileNav(false);
              }}
            >
              <Plus className="mr-1.5 size-4" /> Host an event
            </Button>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
