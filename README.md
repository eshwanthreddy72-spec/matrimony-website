# Matrimony Management Platform

A modern, full-stack web application designed for verified matrimonial matchmaking, secure communication, and administrative governance.

## Key Features

- **Guest Discovery**: Browse verified matrimonial profiles with instant filters (age, religion, caste, occupation, location).
- **User Dashboard**: Profile completion meter, personalized match recommendations, and quick interaction metrics.
- **Express Interest**: Cultural proposal templates (Traditional, Casual, Family-Oriented, Custom) with real-time status updates (Pending, Accepted, Rejected).
- **Shortlist & Favorites**: Save promising candidates for later review.
- **Photo Gallery & Moderation**: Upload photos with human-in-the-loop review status tracking (`Pending`, `Approved`, `Rejected`).
- **Admin Control Panel**: Real-time platform analytics, user account suspension/reactivation, manual identity verification, and photo queue approval.
- **Persistent Demo Switcher**: Instant one-click switching between Priya (User), Rohit (User), Administrator, and Guest.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, JSON Web Tokens (JWT), Bcrypt password hashing
- **Data Layer**: File-persisted typed database layer (`.data/db.json`) with atomic write guarantees

## Quickstart

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type check and linting
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

## Documentation

For full architectural diagrams, entity relationships, security threat models, and API specifications, see **[DOCUMENTATION.md](./DOCUMENTATION.md)**.
