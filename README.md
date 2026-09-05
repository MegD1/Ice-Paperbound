# Material Library

A single-screen, desktop-only interactive bookshelf. Seven cloth and paper volumes
can be lifted from the shelf, turned to their covers, opened, and returned.

![Material Library bookshelf](docs/preview.png)

## Run locally

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

Vite prints the local address. Both `/` and `/studio` show the same standalone
bookshelf. There is no backend, login, database, API key, or external service.

## Interactions

- Hover over a book to lift it slightly.
- Click to pull it out and reveal the front cover.
- Click the selected book again to open or close its cover.
- Click an empty area or press Escape to return it to the shelf.
- Tab and Enter provide keyboard access to all seven volumes.
- Reduced-motion preferences are respected. A 2D fallback is available without WebGL.

The composition is designed for desktop, with a minimum width of 1180px.
Mobile layout is intentionally out of scope.

## Build and test

```sh
npm run check
npm run build
npx playwright install chromium
npm test
npm run preview
```

The browser checks cover book opening, closing, keyboard input, two desktop sizes,
canvas rendering, and WebGL fallback. Set `PLAYWRIGHT_CHANNEL=chrome` to use a locally
installed Google Chrome instead of Playwright's Chromium.

## Implementation

React, Three.js, and GSAP, built with Vite. Physical covers pivot around their
binding edges. Cloth, paper, page edges, tape, and cover lettering are rendered
independently. The only image dependency is the included generated book-material
atlas in `public/textures/book-spines.webp`; the project also includes procedural
fallback materials.

All book copy is fictional. This standalone edition contains no personal biography,
resume, private project records, original site routes, or imported Git history.

## Editing

- `src/content.ts`: spine titles, cover titles, and short interior copy.
- `src/BookshelfScene.tsx`: artboard, materials, lighting, and interaction.
- `src/BookBinding.ts`: cover hinges and page-block geometry.
- `src/styles.css`: the full-viewport stage.

No deployment is configured. Repository visibility and hosting are separate choices.
