import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckoutForm } from "@/components/tickets/CheckoutForm";
import { SuccessTicket } from "@/components/tickets/SuccessTicket";
import type { CampusEvent } from "@/types/event";

interface EventDialogProps {
  event: CampusEvent;
  step: "details" | "checkout" | "success";
  quantity: number;
  bookedTicketCode?: string;
  onQuantity: (quantity: number) => void;
  onContinue: () => void;
  onFinish: (name: string, email: string) => void;
  onClose: () => void;
}

export function EventDialog({
  event,
  step,
  quantity,
  bookedTicketCode,
  onQuantity,
  onContinue,
  onFinish,
  onClose,
}: EventDialogProps) {
  return (
    <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-border bg-background p-0">
      {step === "success" ? (
        <SuccessTicket event={event} ticketCode={bookedTicketCode} onClose={onClose} />
      ) : (
        <>
          <div className={`poster-${event.poster} flex min-h-44 flex-col justify-end p-6`}>
            <span className="mb-auto inline-flex w-fit rounded-md bg-background/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]">
              {event.category}
            </span>
            <h2 className="max-w-sm font-display text-4xl font-black leading-[0.95]">
              {event.title}
            </h2>
          </div>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {step === "checkout" ? "Almost there." : "Make a plan."}
              </DialogTitle>
              <DialogDescription>
                {step === "checkout"
                  ? "Your secure demo checkout is ready. No real payment will be taken."
                  : event.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" /> {event.date}
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" /> {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" /> {event.location} · by {event.organizer}
              </div>
            </div>
            {step === "details" ? (
              <>
                <div className="mt-7 flex items-center justify-between rounded-lg bg-secondary p-4">
                  <div>
                    <div className="font-semibold">General entry</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      QR ticket · instant delivery
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-black">₹{event.price}</div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold">How many tickets?</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease ticket quantity"
                    >
                      <ChevronLeft />
                    </Button>
                    <span className="flex w-8 justify-center font-display text-lg font-bold">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onQuantity(Math.min(6, quantity + 1))}
                      aria-label="Increase ticket quantity"
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </div>
                <Button className="mt-7 w-full" size="lg" onClick={onContinue}>
                  Continue to checkout <ArrowRight />
                </Button>
              </>
            ) : (
              <CheckoutForm event={event} quantity={quantity} onFinish={onFinish} />
            )}
          </div>
        </>
      )}
    </DialogContent>
  );
}
