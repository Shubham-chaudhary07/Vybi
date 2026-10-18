import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CampusEvent } from "@/types/event";

interface CheckoutFormProps {
  event: CampusEvent;
  quantity: number;
  onFinish: (name: string, email: string) => void;
}

export function CheckoutForm({ event, quantity, onFinish }: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(eventSubmit) => {
        eventSubmit.preventDefault();
        onFinish(name, email);
      }}
    >
      <label className="block text-sm font-semibold">
        Your name
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2"
          placeholder="e.g. Ananya Sharma"
        />
      </label>
      <label className="block text-sm font-semibold">
        College email
        <Input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2"
          placeholder="you@northcampus.edu"
        />
      </label>
      <div className="flex items-center justify-between border-y border-border py-4">
        <span className="text-sm text-muted-foreground">{quantity} × General entry</span>
        <span className="font-display text-xl font-black">₹{event.price * quantity}</span>
      </div>
      <Button className="w-full" size="lg" type="submit">
        Pay ₹{event.price * quantity} <ShieldCheck />
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-mint" /> Demo checkout · no real payment taken
      </p>
    </form>
  );
}
