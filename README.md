# الصفا المروة · Al-Safa Al-Marwa

A bilingual (Arabic-first) gold jewelry gallery for الصفا المروة in Egypt. Browse 18K, 21K and
24K pieces at a live gold rate, save favourites, and order directly on WhatsApp. There is no cart
or online payment — every piece links straight to the shop.

## Features

- **Live gold prices** — a server function (`src/lib/gold-api.ts`) reads Daleelak's Egyptian
  market feed (licensed-seller prices in EGP per gram for 24K/21K/18K) and caches it for 5 minutes.
  If Daleelak is unavailable it falls back to the global spot × USD/EGP rate, then to stored rates.
  An admin override always wins over live prices.
- **Arabic / English** — toggle in the header. Arabic is the default and the document switches to
  RTL automatically (`src/lib/i18n.tsx`).
- **Light & dark themes** — warm ivory/white by default with a refined black/gold dark mode. The
  choice is remembered per browser and applies to the storefront and admin portal. All design
  tokens live in `src/styles.css` (Tailwind v4, CSS-first).
- **Flexible layout** — fluid containers and responsive grids from mobile through wide desktop.
- **Wishlist** — saved locally in the browser.
- **WhatsApp ordering** — product cards, quick view and product pages build a prefilled message.

## Stack

TanStack Start + TanStack Router, React 19, Vite, Tailwind CSS v4, shadcn/ui, React Query,
TypeScript.

## Development

```sh
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run typecheck`, `npm run lint`, `npm test`.

## Admin portal

Visit `/admin` and sign in with the shop password. The portal manages products, categories,
price ranges, gold-rate overrides, WhatsApp enquiries and shop settings. Data lives in SQLite
(`data/shop.db`, created and seeded automatically) and uploaded images in `data/uploads`; both
directories are git-ignored.

Configure these environment variables before deploying (see `.env.example`):

| Variable               | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `ADMIN_PASSWORD`       | Admin login password. Required in production.             |
| `ADMIN_SESSION_SECRET` | HMAC secret for session cookies. Use a long random value. |
| `DATABASE_PATH`        | SQLite file path. Default `./data/shop.db`.               |
| `UPLOAD_DIR`           | Uploaded image directory. Default `./data/uploads`.       |

SQLite uses Node's built-in `node:sqlite`, so Node 22.5+ is required (no native build step).

Build and run on a VPS:

```sh
npm ci
npm run build
ADMIN_PASSWORD=... ADMIN_SESSION_SECRET=... PORT=3000 npm start
```

Back up `data/shop.db` and `data/uploads` regularly.

## Gold price API

`GET`-style server function `getGoldRates` resolves prices in this order:

1. Admin override (`/admin/prices`), if enabled.
2. `https://goldbullioneg.com/` — Gold Bullion Egypt’s public price table. The `شراء` (buy)
   column is used for 24K/21K/18K, matching the storefront’s displayed rates. No key required;
   fetched server-side and cached for one minute.
3. `https://getdaleelak.com/api/v1/feed.json?category=metals` — fallback Egyptian market prices.
4. `https://api.gold-api.com/price/XAU` + `https://open.er-api.com/v6/latest/USD` — global spot
   fallback, then the stored fallback rates.

To use a different provider, edit the endpoints in `src/lib/gold-api.ts`. Keep any API keys
server-side (inside the server function), never in `VITE_*` variables.
