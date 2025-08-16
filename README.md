# URL Shortener Web App- ShortAF

A modern, interactive, and fully client-side URL Shortener built with React, TypeScript, and Material UI v7.

## Features

- **Unlimited URL Shortening:** Add, remove, and shorten as many URLs as you want in one go.
- **Custom Shortcodes:** Optionally specify your own shortcode for each URL.
- **Validity Period:** Set a custom validity (in minutes) for each short URL (defaults to 30 minutes).
- **Unique Short Links:** All shortcodes are unique and validated.
- **Redirection:** Visiting a short URL redirects to the original long URL (if not expired).
- **Statistics Page:** View all created short URLs, their expiry, total clicks, and detailed click analytics (timestamp, source, location).
- **Premium UI:** Beautiful, responsive design with gradients, custom colors, and Material UI icons.
- **Robust Error Handling:** Friendly messages for invalid input, collisions, and expired links.
- **Logging Middleware:** All actions and errors are logged to the evaluation server (no console.log used).
- **No Backend Required:** All logic and storage are handled in the browser (localStorage).

## Tech Stack

- **React** (with TypeScript)
- **Material UI v7** (custom theme: purple & orange)
- **LocalStorage** for persistence
- **Custom Logging Middleware** (see `src/logging.ts`)

## Setup & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm start
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/pages/UrlShortenerPage.tsx` — Main URL shortener form (unlimited rows, premium UI)
- `src/pages/StatisticsPage.tsx` — Analytics and click stats
- `src/pages/RedirectHandler.tsx` — Handles short URL redirection and click logging
- `src/logging.ts` — Logging middleware (required by assignment)
- `src/App.tsx` — Routing and theme

## Screenshots

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/2b69f454-75f4-41d8-9493-b52e00c48511" />

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/2fff9b67-4a48-4048-9017-926d79dfde62" />

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/006b2a26-33d1-4dfa-8880-1eb0ec12a415" />

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/3e2538fc-159f-4454-a3f7-a990e1d75a89" />







## Assignment Compliance

- Uses **Material UI** for all styling
- No backend or registration required
- All logging via custom middleware (no console.log)
- Fully client-side, runs on `http://localhost:3000`

---

