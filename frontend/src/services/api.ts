import type { CampusEvent, Attendee, CreateEventPayload } from "@/types/event";
import { initialEvents, initialAttendees } from "@/data/mockEvents";

const API_BASE_URL =
  (import.meta.env["VITE_API_URL"] as string | undefined) || "http://localhost:8081/api";

export function getCategoryPoster(category: string, index = 0): "coral" | "sun" | "mint" | "blue" {
  switch (category.toLowerCase()) {
    case "music":
      return "coral";
    case "culture":
    case "talks":
      return "sun";
    case "tech":
      return "mint";
    case "sports":
      return "blue";
    default: {
      const posters: Array<"coral" | "sun" | "mint" | "blue"> = ["coral", "sun", "mint", "blue"];
      return posters[index % posters.length] ?? "coral";
    }
  }
}

/**
 * Fetch all events. Attempts to call the Spring Boot API, falling back to mock events.
 */
export async function getEvents(): Promise<CampusEvent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (res.ok) {
      const data = (await res.json()) as Array<Record<string, unknown>>;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item, index) => ({
          id: String(item["id"] ?? index),
          title: String(item["title"] ?? "Untitled Event"),
          organizer: String(item["organizer"] ?? "Campus Organizer"),
          date: String(item["date"] ?? "Soon"),
          dateShort: String(item["dateShort"] ?? "TBA"),
          time: String(item["time"] ?? "7:00 PM"),
          location: String(item["location"] ?? "North Campus"),
          price: Number(item["price"] ?? 0),
          spots: Number(item["spots"] ?? 100),
          category: (item["category"] as CampusEvent["category"]) ?? "Culture",
          description: String(item["description"] ?? ""),
          poster: getCategoryPoster(String(item["category"] ?? ""), index),
        }));
      }
    }
  } catch {
    // Backend offline; fallback to local mock data
  }
  return initialEvents;
}

/**
 * Create a new event via Spring Boot POST /api/events.
 */
export async function createEvent(
  payload: CreateEventPayload,
): Promise<{ event: CampusEvent; isBackendLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      const createdEvent: CampusEvent = {
        id: String(data["id"] ?? Date.now()),
        title: String(data["title"] ?? payload.title),
        organizer: String(data["organizer"] ?? payload.organizer),
        date: String(data["date"] ?? payload.date),
        dateShort: String(data["dateShort"] ?? payload.dateShort),
        time: String(data["time"] ?? payload.time),
        location: String(data["location"] ?? payload.location),
        price: Number(data["price"] ?? payload.price),
        spots: Number(data["spots"] ?? payload.spots),
        category: payload.category,
        description: String(data["description"] ?? payload.description),
        poster: getCategoryPoster(payload.category),
      };
      return { event: createdEvent, isBackendLive: true };
    } else {
      const errData = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      const errMsg =
        (errData && (errData["message"] || errData["error"])) ||
        `Server error (${res.status} ${res.statusText})`;
      throw new Error(String(errMsg));
    }
  } catch (error) {
    if (error instanceof TypeError) {
      console.warn("Backend unavailable, saving event locally:", error);
      const fallbackEvent: CampusEvent = {
        ...payload,
        id: `local-${Date.now()}`,
        poster: getCategoryPoster(payload.category),
      };
      return { event: fallbackEvent, isBackendLive: false };
    }
    throw error;
  }
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
      const data = (await res.json()) as { tickets?: Array<{ ticketCode?: string }> };
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
): Promise<{ valid: boolean; attendeeName?: string | undefined }> {
  try {
    const res = await fetch(`${API_BASE_URL}/tickets/${encodeURIComponent(code)}/verify`, {
      method: "POST",
    });
    if (res.ok) {
      const data = (await res.json()) as { attendeeName?: string };
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
