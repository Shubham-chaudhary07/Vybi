export type Mode = "explore" | "tickets" | "organizer";

export type EventCategory = "All events" | "Music" | "Culture" | "Tech" | "Sports";

export type CampusEvent = {
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

export type CreateEventPayload = {
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
};

export type Attendee = {
  name: string;
  event: string;
  code: string;
  status: "Checked in" | "Ready" | "Confirmed" | string;
};

export type BookingRequest = {
  attendeeName: string;
  email: string;
  quantity: number;
};

export type TicketResponse = {
  code: string;
  event: string;
  attendeeName: string;
  status: "READY" | "CHECKED_IN" | "CANCELLED" | string;
  checkedInAt?: string | null;
};

export type BookingResponse = {
  id: number;
  event: string;
  attendeeName: string;
  email: string;
  quantity: number;
  totalAmount: number;
  tickets: TicketResponse[];
};

export type OrganizerSummary = {
  liveEvents: number;
  ticketsSold: number;
  checkedIn: number;
};
