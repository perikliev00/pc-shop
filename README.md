# My E-Shop (PC Components Store)

A Node.js + Express + MongoDB web app for a simple e-commerce experience focused on PC components.
The UI is served as static HTML pages (`public/views/*.html`) and the pages fetch data from JSON endpoints under `/api/*`.

## What’s inside

- **Product browsing by category** (CPU, Cooling, RAM, Cores, Storage, Graphics Card, Power Supply, PC Cases, Other Parts)
- **Product details** page (fetches product details by `:id` + `:category`)
- **Cart**
  - Guest cart stored in the **session** (`req.session.cart`)
  - Logged-in cart persisted in **MongoDB** (`User.cart.items`) and mirrored into the session
- **Auth** (register / login) using sessions and password hashing
- **Orders**
  - Creates an `Order` document from cart items + checkout form data
  - Sends an order confirmation email (SendGrid)
- **Admin**
  - Simple admin panel page + JSON endpoints to list/delete orders

## Tech stack

- Node.js / Express
- MongoDB / Mongoose
- `express-session` + `connect-mongodb-session` (sessions stored in MongoDB)
- SendGrid (`@sendgrid/mail`)
- Security & ops: `helmet`, `compression`, `morgan`, `cors`

## Project structure (important folders)

- `app.js` – Express app bootstrap (middleware, routes, DB connect)
- `routes/`
  - `routes/user/*` – routes that serve HTML pages (via `res.sendFile`)
  - `routes/data/*` – JSON endpoints under `/api/*`
- `controllers/`
  - `controllers/user/*` – page controllers (send HTML files)
  - `controllers/data/*` – API controllers (JSON + some redirects)
- `models/` – Mongoose schemas (User, Order, category content collections, etc.)
- `public/`
  - `public/views/` – HTML pages
  - `public/js/` – front-end JS (fetches `/api/*`, handles cart/auth UI)
  - `public/styles/` – CSS
  - `public/images/` – assets (also see the dynamic placeholder image route)
- `scripts/` – helper scripts (e.g. DB seeding for home sections)

## Local setup

### 1) Requirements

- Node.js 18+ (or newer)
- A MongoDB instance (Atlas or local)

### 2) Install

```bash
npm install
```

### 3) Environment variables

This project loads env vars from **`config/.env`** (see `app.js`).
Create `config/.env` (or copy from an example) with at least:

```env
NODE_ENV=development
PORT=8000

# MongoDB Atlas credentials used to build the connection string in app.js
MONGO_USER=...
MONGO_PASSWORD=...

SESSION_SECRET=change-me
JWT_SECRET=change-me

SENDGRID_API_KEY=...
FROM_EMAIL=you@example.com
ADMIN_EMAIL=admin@example.com
```

**Security note:** your ZIP currently includes a real `config/.env` with a SendGrid API key. Rotate that key and remove the file from Git history before pushing to GitHub.

### 4) Run

Development (with nodemon):
```bash
npm run start:dev
```

Production:
```bash
npm start
```

Open:
- http://localhost:8000/

## Seeding (optional)

To seed the “home sections” document in MongoDB:

```bash
node scripts/populate-sections.js
```

This script currently uses a hard-coded local Mongo URI (`mongodb://localhost:27017/pc-shop`). Adjust it if you use Atlas.

## Deployment notes

- `Procfile` exists (Heroku-style). The app listens on `process.env.PORT || 8000`.
- Sessions require MongoDB access in production.
- There are **debug “agent log” fetch calls** in `app.js` posting to `http://127.0.0.1:7243/ingest/...`. Remove them for production (they will fail and add noise).

## Known issues / cleanup items

- `models/Cart.js` looks incomplete (`prod...`) and appears unused.
- `middlewares/errorHandler.js` is empty.
- `sendEmail/sendEmail.js` hardcodes `from` and admin recipient; move those to env vars.
- `MONGODB_URI` in `app.js` uses `tlsAllowInvalidCertificates=true` — don’t use that in production.

---
