# Project notes

Al-Safa Al-Marwa gold gallery — TanStack Start + React 19 + Tailwind v4.

- Live gold rates are fetched server-side in `src/lib/gold-api.ts`; never move provider calls or
  API keys into browser code.
- Arabic is the default language. UI strings live in `src/lib/i18n.tsx`; add both `ar` and `en`
  entries for every new key.
- Design tokens (black & gold palette) live in `src/styles.css`. Prefer semantic tokens
  (`bg-background`, `text-gold`, etc.) over hardcoded colours.
- Use logical direction utilities (`ms-`, `me-`, `start-`, `end-`, `text-start`) so the layout
  works in RTL and LTR.
- There is no cart or online payment; ordering happens through WhatsApp.
- The admin portal lives at `/admin`. Auth is a single password (`ADMIN_PASSWORD`); server-only
  cookie logic is in `src/server/session.server.ts` and is imported dynamically from server
  functions. Do not import `node:*` or `.server.ts` modules from client-rendered code.
- Catalog data (products, categories, price ranges, settings) lives in SQLite via `node:sqlite`
  (`src/server/db.ts`) and is exposed to the UI through `CatalogProvider` in `src/lib/catalog.tsx`.
  `data/` (database + uploads) is git-ignored and seeded automatically on first run.
- Generated files such as `src/routeTree.gen.ts` are not edited by hand.
- Before finishing a change run `npm run typecheck`, `npm run lint` and `npm test`.
