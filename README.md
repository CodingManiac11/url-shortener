# URL Shortener Web App

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

> ![image](https://github.com/user-attachments/assets/37ab4fd6-6e42-4760-aaa3-e917121daee6)
> ![image](https://github.com/user-attachments/assets/97457cea-8413-479a-a9ce-5eec4b660aa1)
> ![image](https://github.com/user-attachments/assets/a9aa3207-d418-4264-a9b9-07c6cb1c1172)
> ![image](https://github.com/user-attachments/assets/b726bdb2-206f-411a-99cf-c7e13591643c)






## Assignment Compliance

- Uses **Material UI** for all styling
- No backend or registration required
- All logging via custom middleware (no console.log)
- Fully client-side, runs on `http://localhost:3000`

---

