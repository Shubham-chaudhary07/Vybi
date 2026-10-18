import type {
  CampusEvent,
  Attendee,
  CreateEventPayload,
  BookingResponse,
  TicketResponse,
  OrganizerSummary,
} from "@/types/event";
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
 * 1. Health check: GET /api/health
 */
export async function checkHealth(): Promise<{ status: string; service: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (res.ok) {
      return (await res.json()) as { status: string; service: string };
    }
  } catch (error) {
    console.warn("Backend health check failed:", error);
  }
  return { status: "offline", service: "mock" };
}

/**
 * 2. Get all events: GET /api/events
 */
export async function getEvents(): Promise<CampusEvent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (res.ok) {
      const data = (await res.json()) as Array<Record<string, unknown>>;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item, index) => ({
          id: String(item["id"] ?? index + 1),
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
  } catch (error) {
    console.warn("Backend unavailable, using initial mock events:", error);
  }
  return initialEvents;
}

/**
 * 3. Get single event: GET /api/events/{id}
 */
export async function getEvent(id: string): Promise<CampusEvent | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${id}`);
    if (res.ok) {
      const item = (await res.json()) as Record<string, unknown>;
      return {
        id: String(item["id"] ?? id),
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
        poster: getCategoryPoster(String(item["category"] ?? "")),
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch event ${id} from backend:`, error);
  }
  return initialEvents.find((e) => e.id === id) ?? null;
}

/**
 * 4. Create a new event: POST /api/events
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
 * 5. Book tickets for an event: POST /api/events/{id}/bookings
 */
export async function bookTickets(
  eventId: string,
  attendeeName: string,
  email: string,
  quantity: number,
): Promise<{
  ticketCode: string;
  booking?: BookingResponse;
  tickets?: TicketResponse[];
  success: boolean;
  isBackendLive: boolean;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/events/${eventId}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendeeName, email, quantity }),
    });

    if (res.ok) {
      const bookingData = (await res.json()) as BookingResponse;
      const primaryTicketCode =
        bookingData.tickets?.[0]?.code ??
        `VP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      return {
        ticketCode: primaryTicketCode,
        booking: bookingData,
        tickets: bookingData.tickets,
        success: true,
        isBackendLive: true,
      };
    } else {
      const errData = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      const errMsg =
        (errData && (errData["message"] || errData["error"])) ||
        `Booking failed with status ${res.status}`;
      console.warn("Booking API error:", errMsg);
    }
  } catch (error) {
    console.warn("Backend offline during booking, generating local confirmation:", error);
  }

  // Graceful offline fallback
  const mockCode = `VP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  return {
    ticketCode: mockCode,
    tickets: [
      {
        code: mockCode,
        event: "Campus Event",
        attendeeName,
        status: "READY",
      },
    ],
    success: true,
    isBackendLive: false,
  };
}

/**
 * 6. Verify ticket at entry desk: POST /api/tickets/{code}/verify
 */
export async function verifyTicket(
  code: string,
): Promise<{
  valid: boolean;
  attendeeName?: string;
  eventName?: string;
  status?: string;
  message?: string;
}> {
  const cleanCode = code.trim().toUpperCase();
  try {
    const res = await fetch(`${API_BASE_URL}/tickets/${encodeURIComponent(cleanCode)}/verify`, {
      method: "POST",
    });

    if (res.ok) {
      const data = (await res.json()) as TicketResponse;
      return {
        valid: true,
        attendeeName: data.attendeeName,
        eventName: data.event,
        status: data.status,
      };
    } else if (res.status === 404) {
      return {
        valid: false,
        message: "Ticket not found in live database.",
      };
    }
  } catch (error) {
    console.warn("Backend offline during ticket verification, checking local records:", error);
  }

  // Fallback to local attendees if backend is unreachable
  const match = initialAttendees.find((a) => a.code.toUpperCase() === cleanCode);
  if (match) {
    return {
      valid: true,
      attendeeName: match.name,
      eventName: match.event,
      status: match.status,
    };
  }

  return {
    valid: false,
    message: "Invalid ticket code.",
  };
}

/**
 * 7. Get organizer summary: GET /api/organizer/summary
 */
export async function getOrganizerSummary(): Promise<OrganizerSummary> {
  try {
    const res = await fetch(`${API_BASE_URL}/organizer/summary`);
    if (res.ok) {
      return (await res.json()) as OrganizerSummary;
    }
  } catch (error) {
    console.warn("Failed to fetch organizer summary from backend:", error);
  }

  // Offline mock fallback
  return {
    liveEvents: 4,
    ticketsSold: 428,
    checkedIn: 176,
  };
}

/**
 * 8. Export attendees CSV: GET /api/organizer/attendees
 */
export async function exportAttendeesCsv(fallbackList: Attendee[] = initialAttendees): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/organizer/attendees`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "vibepass-attendees.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }
  } catch (error) {
    console.warn("Backend CSV export failed, generating local CSV fallback:", error);
  }

  // Offline fallback CSV generator
  const csv = [
    "Name,Event,Ticket,Status",
    ...fallbackList.map((item) => `${item.name},${item.event},${item.code},${item.status}`),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vibepass-attendees.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
