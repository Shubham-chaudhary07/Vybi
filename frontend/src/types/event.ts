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

export type Attendee = {
  name: string;
  event: string;
  code: string;
  status: "Checked in" | "Ready";
};

export type BookingRequest = {
  attendeeName: string;
  email: string;
  quantity: number;
};

export type BookingResponse = {
  bookingId: number;
  attendeeName: string;
  email: string;
  eventTitle: string;
  tickets: Array<{
    ticketCode: string;
    status: string;
  }>;
};

export type OrganizerSummary = {
  liveEvents: number;
  ticketsSold: number;
  checkedIn: number;
  grossSales: string;
};
