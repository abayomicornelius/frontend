# StellarSend — Global Money Transfers on Stellar

StellarSend is a production-quality, non-custodial web application for sending money globally using the [Stellar blockchain](https://stellar.org). It connects to the Freighter browser wallet, fetches live exchange quotes (via a backend or Stellar Horizon directly), builds and signs transactions client-side, and submits them to the network.

---
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/e1e72129-bfeb-42bf-b569-33d83cc85801" />

## Features

- **Instant global payments** — 3–5 second settlement on Stellar
- **Non-custodial** — private keys never leave the user's Freighter wallet
- **Multi-asset support** — XLM, USDC, and any Stellar-based token
- **Path payments** — automatic DEX routing for cross-asset transfers
- **Live exchange quotes** — with slippage tolerance and price-impact display
- **Real-time balance display** — XLM + USDC pulled from Horizon
- **Transaction history** — paginated with expand-to-detail rows and Stellar Expert links
- **Activity charts** — 7-day and 30-day volume charts (recharts)
- **Testnet / Mainnet toggle** — switch with one click in Settings
- **Dark-navy UI** — professional indigo/Stellar-blue design, fully responsive
- **Scheduled & recurring payments** — set up a one-time future-dated or repeating transfer (`/subscriptions`)
- **Split / batch payments** — pay multiple recipients in a single transaction (`/batch`)
- **Payment requests / invoicing** — generate a shareable link + QR code that prefills the payer's send flow (`/requests`, `/pay/:id`)
- **Escrow / conditional transfers** — lock funds until a time or arbiter condition releases them (`/escrow`)

---
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/09ab4eb3-44c9-4b90-91a3-e8f2b3c2337b" />

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/b3b7e4a2-f203-48d7-abb8-a337a787c745" />


## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Data fetching | TanStack React Query v5 |
| Forms | react-hook-form + Zod |
| Blockchain | @stellar/stellar-sdk v12 |
| Wallet | @stellar/freighter-api |
| HTTP | Axios |
| Charts | Recharts |
| Icons | Lucide React |

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 18 |
| npm / pnpm / yarn | any recent |
| Freighter browser extension | [freighter.app](https://www.freighter.app) |
| A Stellar testnet account | [friendbot](https://friendbot.stellar.org) for free testnet XLM |

---

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd StellarSend/frontend
npm install
```

### 2. Configure environment variables

Copy the example env file and edit it:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | URL of the StellarSend backend API |

If you don't have a backend running, the app will fall back to querying Horizon directly (read-only history and balances work; quote/send endpoints require the backend).

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

Create a `.env` file at `StellarSend/frontend/.env`:

```env
# Backend API base URL (no trailing slash)
VITE_API_URL=http://localhost:8080
```

In production, set `VITE_API_URL` to your deployed backend URL before running `npm run build`.

---

## How to Run

### Development

```bash
npm run dev          # Vite dev server at :5173
npm run type-check   # TypeScript type check without building
npm run lint         # ESLint
```

### Production build

```bash
npm run build        # Emits to dist/
npm run preview      # Preview the dist/ build locally at :4173
```

### Deploy (static hosting)

The `dist/` folder is a static SPA. Deploy it to:

- **Vercel**: `vercel --prod` (auto-detected as Vite/React)
- **Netlify**: Drag-and-drop `dist/` or use `netlify deploy --dir dist`
- **AWS S3 + CloudFront**: upload `dist/` and set the error page to `index.html`
- **IPFS / Fleek**: same as S3 approach

Add a `_redirects` file (Netlify) or rewrite rule so all paths fall back to `index.html`:

```
/*  /index.html  200
```

---

## Folder Structure

```
src/
├── types/
│   └── index.ts            # All TypeScript types (Account, Transaction, Quote, …)
│
├── lib/
│   ├── stellar.ts          # Stellar SDK helpers: build tx, path payment, fee estimate
│   ├── api.ts              # Axios client + backend & Horizon API wrappers
│   └── utils.ts            # cn(), formatDate(), timeAgo(), copyToClipboard()
│
├── context/
│   └── WalletContext.tsx   # WalletProvider: Freighter state machine via useReducer
│
├── hooks/
│   ├── useWallet.ts        # Convenience hook over WalletContext
│   ├── useTransactions.ts  # React Query hooks for tx history (infinite scroll)
│   └── useSendPayment.ts   # Full send flow: quote → sign → submit state machine
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Top nav with logo, links, wallet button
│   │   ├── Sidebar.tsx     # Left sidebar (desktop)
│   │   └── Layout.tsx      # Route shell (Outlet + Navbar + Sidebar)
│   │
│   ├── ui/
│   │   ├── Button.tsx      # Variants: primary/secondary/ghost/danger/outline/link
│   │   ├── Input.tsx       # Input + Select components
│   │   ├── Card.tsx        # Card, CardHeader, CardTitle, CardBody, CardFooter
│   │   ├── Badge.tsx       # Badge, StatusBadge, NetworkBadge
│   │   ├── Modal.tsx       # Portal modal with backdrop, keyboard close
│   │   └── Spinner.tsx     # Spinner, PageLoader, Skeleton, SkeletonCard, SkeletonRow
│   │
│   ├── wallet/
│   │   ├── ConnectWallet.tsx  # Freighter install modal + connect flow
│   │   └── WalletInfo.tsx     # Dropdown showing address, balances, disconnect
│   │
│   ├── send/
│   │   ├── SendForm.tsx    # Multi-step form: address, asset, amount, path toggle
│   │   ├── QuoteCard.tsx   # Exchange quote with countdown, path display, fees
│   │   ├── ConfirmModal.tsx# Pre-sign confirmation dialog
│   │   └── SuccessScreen.tsx  # Post-send success with tx hash + explorer link
│   │
│   ├── history/
│   │   ├── TransactionTable.tsx  # Infinite scroll table with search
│   │   └── TransactionRow.tsx    # Expandable row with detail panel
│   │
│   └── dashboard/
│       ├── BalanceCard.tsx       # XLM + USDC + other balances with hide toggle
│       ├── QuickStats.tsx        # 4-stat grid: sent/received/count/avg fee
│       └── RecentTransactions.tsx # Last 5 transactions with explorer links
│
└── pages/
    ├── Home.tsx            # Landing page: hero, features, how-it-works, CTA
    ├── Dashboard.tsx       # Balance + stats + activity chart + recent transactions
    ├── Send.tsx            # Send page orchestrating form → quote → confirm → success
    ├── History.tsx         # History stats + 30-day chart + infinite transaction table
    ├── Settings.tsx        # Network toggle, slippage, default memo, display prefs
    └── NotFound.tsx        # 404 page
```

---

## Architecture Notes

### Wallet connection flow

1. `WalletProvider` detects Freighter on mount via `isConnected()`.
2. If previously allowed, it calls `getPublicKey()` and auto-reconnects.
3. Manual connect calls `setAllowed()` (prompts the user in Freighter) then `getPublicKey()`.
4. Account data is fetched from Horizon every 30 s (configurable in Settings).

### Send payment flow

```
SendForm (user input)
  → useSendPayment.requestQuote()
    → POST /quotes (backend) → Quote
  → QuoteCard review
  → ConfirmModal
  → useSendPayment.confirmSend()
    → stellar.buildTransactionFromQuote() → XDR
    → freighter.signTransaction(xdr)
    → paymentApi.send(signedXdr) OR stellar.submitTransaction(signedXdr)
  → SuccessScreen
```

### Horizon fallback

When the backend is unavailable (no `VITE_API_URL` or unreachable), `fetchAccountFromHorizon` and `fetchTransactionsFromHorizon` in `src/lib/api.ts` query the public Stellar Horizon API directly. This means balance display and history work offline from the backend; quote/send still requires the backend.

---

## Differentiator Features

Four pages beyond the core send flow, backed by [`StellarSend/contracts`](https://github.com/StellarSend/contracts) and [`StellarSend/backend`](https://github.com/StellarSend/backend). Every fund-moving action still goes through the same build → sign (Freighter) → submit pattern as a regular send — nothing here asks for or transmits a private key.

| Page | What it does |
|---|---|
| `/subscriptions` (`src/pages/Subscriptions.tsx`) | Create/list/cancel a recurring payment — recipient, asset, amount, interval, start date |
| `/batch` (`src/pages/BatchSend.tsx`) | Add multiple recipient + amount rows and submit them as one transaction |
| `/requests` + `/pay/:id` (`src/pages/PaymentRequests.tsx`, `src/pages/PayRequest.tsx`) | Create a payment request with a shareable link and QR code; `/pay/:id` prefills the send flow from a request |
| `/escrow` (`src/pages/Escrow.tsx`) | Create an escrow and list ones you're party to; release/refund buttons are gated in the UI to match the contract's own rules (`getEscrowPermissions()` in `src/types/index.ts`) — you won't see a "release" button before you're allowed to use it |

New types live in `src/types/index.ts` (`Subscription`, `BatchRecipient`/`BatchPaymentFormValues`, `PaymentRequest`, `Escrow`); new API calls in `src/lib/api.ts` (`subscriptionApi`, `batchPaymentApi`, `paymentRequestApi`, `escrowApi`); new hooks alongside each page (`useSubscriptions`, `useBatchPayment`, `usePaymentRequests`, `useEscrows`). QR rendering uses the `qrcode` package (chosen over hand-rolling an encoder — correct Reed-Solomon error correction is easy to get subtly wrong).

Each feature area has at least one component test (see [Testing](#testing) below) covering real behavior — form validation, zero-amount rejection, escrow button role-gating.

> **Known gap:** these pages were built against a planned backend API spec rather than the backend's final implementation (built in parallel). Escrow's release/refund flow has been reconciled end-to-end (build unsigned tx → sign → relay). The other three features' exact endpoint paths and payload field casing should be checked against `StellarSend/backend`'s `src/lib/api.ts` before relying on them against a live backend.

---

## Testing

This repo previously had `*.test.tsx`/`*.test.ts` files with no test runner actually wired up. That's now fixed:

```bash
npm run test        # vitest run
```

Vitest is configured with `jsdom` and `src/test/setup.ts` (see `vite.config.ts`). 55+ tests currently pass covering utils, hooks, and the new feature components.

---

## Screenshots

### Landing page
Hero section with animated Stellar gradient, feature grid, and step-by-step guide.

### Dashboard
Balance card with hide/show toggle, 4-stat quick stats grid, 7-day area chart, and recent transactions.

### Send Money
Multi-step form → live quote with expiry countdown → confirm modal → success screen with tx hash.

### History
30-day bar chart, summary stats, and infinite-scroll expandable transaction table.

### Settings
Network selector (testnet/mainnet), slippage tolerance, auto-refresh interval, and account info.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Run `npm run type-check && npm run lint` before committing.
3. Write clear commit messages describing the change.
4. Open a pull request against `main`.

---

## License

MIT © StellarSend contributors.

This software is provided for educational and demonstration purposes. It is not affiliated with or endorsed by the Stellar Development Foundation.
