import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BookshelfScene } from "./BookshelfScene";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="site-shell shelf-only" aria-label="Material Library">
      <BookshelfScene />
    </main>
  </StrictMode>,
);
