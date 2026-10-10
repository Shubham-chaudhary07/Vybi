# Vybe (VibePass) 🎟️

A campus event ticketing and discovery platform built for North Campus. Includes event discovery, booking checkout, scannable QR ticket wallet, and an organizer desk with live check-in verification and attendee export.

---

## 📁 Project Architecture

This repository is structured as a clean full-stack project:

```text
Vybe/
├── frontend/                     # TanStack Start / React 19 / Vite / Tailwind CSS
│   ├── src/
│   │   ├── assets/               # Campus imagery & media
│   │   ├── components/
│   │   │   ├── ui/               # shadcn / Radix UI design primitives
│   │   │   ├── layout/           # Navbar, Footer
│   │   │   ├── events/           # EventCard, EventDialog, CreateModal, HeroSection, TrustStats
│   │   │   ├── tickets/          # TicketsView, CheckoutForm, SuccessTicket, QrPattern
│   │   │   └── organizer/        # OrganizerDesk, DashStat
│   │   ├── types/                # Centralized TypeScript models (events, bookings, attendees)
│   │   ├── data/                 # Seed campus events & mock fallback data
│   │   ├── services/             # API client (connects to Spring Boot backend)
│   │   └── routes/               # Modular file-based TanStack Router pages
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                      # Spring Boot 3.5 companion API (Java 21)
│   ├── pom.xml
│   ├── src/main/java/com/vibepass/api/
│   │   ├── config/               # CORS & demo data seeder
│   │   ├── controller/           # REST endpoints (events, bookings, tickets, organizer)
│   │   ├── dto/                  # Request / Response records
│   │   ├── model/                # JPA entities (Event, Booking, Ticket, Attendee)
│   │   ├── repository/           # Spring Data repositories
│   │   └── service/              # Core booking, verification & event logic
│   └── src/main/resources/application.properties
│
├── package.json                  # Root workspace orchestration scripts
└── README.md
```

---

## 🚀 Quick Start

### 1. Frontend Development

```bash
# From the root workspace:
npm install --prefix frontend
npm run dev

# Or directly inside the frontend directory:
cd frontend
npm install
npm run dev
```

The frontend will run at **http://localhost:3000** (or port specified by Vite/TanStack Start).

### 2. Backend Development (Optional companion)

The backend provides a REST API with an in-memory H2 database.

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8081**.
- H2 Console: `http://localhost:8081/h2-console` (`jdbc:h2:mem:vibepass`, user `sa`, no password)
- Health check: `GET http://localhost:8081/api/health`
- Events endpoint: `GET http://localhost:8081/api/events`

*Note: If the backend is not running, the frontend gracefully uses demo data so you can test all features offline.*

---

## 🛠️ Root Convenience Scripts

You can run commands directly from the root folder:

- `npm run dev`: Start frontend dev server
- `npm run build`: Build frontend for production
- `npm run lint`: Run ESLint on frontend
- `npm run backend:run`: Start Spring Boot backend (requires Maven)
- `npm run backend:test`: Run Java backend test suite
