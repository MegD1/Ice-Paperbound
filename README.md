# Ice-Paperbound

**English** | [简体中文](README.zh-CN.md)

**A website you can take off the shelf.**

An interactive experiment made in collaboration with AI: one shelf, seven books, each with its own material character. Worn paper edges, woven cloth, translucent tracing paper, and aged tape give the scene a tactile quality. Each book can be pulled out, turned toward you, and opened.

This is not a static background image. Every book has its own 3D structure, cover, and interior. The shelf could become a navigation system for a personal website, portfolio, or creative archive. This repository contains the standalone **Studio demo**, with fictional material-study notes inside the books.

![Desktop preview of the interactive bookshelf](docs/preview.png)

## Interactions

- **Hover** to lift and gently rotate a book.
- **Click** to pull it from the shelf and reveal its front cover.
- **Click the selected book again** to open or close its cover.
- **Click an empty area or press Esc** to return it to the shelf.
- **Use the keyboard**: Tab selects a book; Enter activates it.

The seven volumes are `FORM`, `LIGHT`, `COLOR`, `MATTER`, `FIELD`, `NOTES`, and `INDEX`. The small yellow book on the right opens too.

## Run Locally

Requires **Node.js 22.13 or newer**.

```sh
git clone https://github.com/MegD1/Ice-Paperbound.git
cd Ice-Paperbound
npm ci
npm run dev
```

Open the local address printed in your terminal. Both `/` and `/studio` display the same standalone bookshelf. No backend, database, account, or API key is required.

## Technology and Materials

| Part | Implementation |
| --- | --- |
| Application | React, TypeScript, and Vite |
| 3D scene | Native Three.js, an orthographic camera, and individual book models |
| Animation | GSAP controls extraction, rotation, cover opening, and return motion |
| Binding | Covers pivot around their binding edges; covers and page blocks are modeled separately |
| Materials | A generated texture atlas alongside procedural Canvas paper, cloth, and tape textures |
| Fallbacks | Reduced-motion support and a 2D fallback when WebGL is unavailable |

The material atlas is included at `public/textures/book-spines.webp`. The running application does not depend on an external image service.

## Customize the Shelf

| File | What to change |
| --- | --- |
| `src/content.ts` | Spine labels, cover titles, and short interior copy |
| `src/BookshelfScene.tsx` | Composition, materials, lighting, and interactions |
| `src/BookBinding.ts` | Cover hinges and page-block geometry |
| `src/styles.css` | The full-screen stage and base styles |

## Build and Test

```sh
npm run check
npm run build
npx playwright install chromium
npm test
npm run preview
```

`check` runs TypeScript validation and checks the standalone edition's file boundaries. Browser tests cover opening and closing all seven books, keyboard input, two desktop sizes, Canvas rendering, and WebGL fallback.

To run the tests with Google Chrome already installed on your computer:

```sh
PLAYWRIGHT_CHANNEL=chrome npm test
```

## Current Scope

- Designed for desktop, with a minimum layout width of `1180px`. This repository's demo is not yet adapted for mobile.
- This is a bookshelf interaction and material study, not a complete portfolio or content management system.
- Only the anonymous Studio edition is included. There is no personal resume, private work material, original-site page, or imported original-site Git history.
- No deployment is configured. A public repository makes the code available to view and download; it does not automatically host a live website.
