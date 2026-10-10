import type { CampusEvent, Attendee } from "@/types/event";
import { initialEvents, initialAttendees } from "@/data/mockEvents";

const API_BASE_URL =
  (import.meta.env["VITE_API_URL"] as string | undefined) || "http://localhost:8081/api";

/**
 * Fetch all events. Attempts to call the Spring Boot API, falling back to mock events.
 */
export async function getEvents(): Promise<CampusEvent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Backend offline; fallback to local mock data
  }
  return initialEvents;
}

/**
 * Create a new booking for an event.
 */
export async function bookTickets(
  eventId: string,
  attendeeName: string,
  email: string,
  quantity: number,
): Promise<{ ticketCode: string; success: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendeeName, email, quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      const ticketCode =
        data.tickets?.[0]?.ticketCode ??
        `VP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      return { ticketCode, success: true };
    }
  } catch {
    // Backend offline; fallback demo code
  }
  return {
    ticketCode: `VP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    success: true,
  };
}

/**
 * Verify a ticket code at the organizer entry desk.
 */
export async function verifyTicket(
  code: string,
): Promise<{ valid: boolean; attendeeName?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/tickets/${encodeURIComponent(code)}/verify`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      return { valid: true, attendeeName: data.attendeeName };
    }
  } catch {
    // Backend offline fallback check
  }
  const match = initialAttendees.find((a) => a.code.toUpperCase() === code.trim().toUpperCase());
  return {
    valid: Boolean(match),
    attendeeName: match?.name ?? "Campus Attendee",
  };
}

/**
 * Download attendee CSV.
 */
export function exportAttendeesCsv(attendees: Attendee[] = initialAttendees): void {
  const csv = [
    "Name,Event,Ticket,Status",
    ...attendees.map((item) => `${item.name},${item.event},${item.code},${item.status}`),
  ].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = "vibepass-attendees.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}
