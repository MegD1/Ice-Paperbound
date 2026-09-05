export type VolumeId = "form" | "light" | "color" | "matter" | "field" | "notes" | "index";

// Fictional editorial copy, independent of any personal portfolio.
export const studioContent = {
  form: {
    spine: "FORM",
    title: "A Study of Form",
    coverCopy: "A line finds an edge. A fold holds a little light. Notes on quiet shapes and the spaces between them.",
    notes: ["Contour", "Balance", "Negative space"],
  },
  light: {
    spine: "LIGHT",
    title: "In Soft Light",
    coverCopy: "Translucent sheets, pale blue shadows, and the slow shift of daylight. A collection of surfaces seen through one another.",
    notes: ["Transparency", "Reflection", "Soft focus"],
  },
  color: {
    spine: "COLOR",
    title: "Color in Passing",
    coverCopy: "Vermilion beside a faded rose. Pigment, paper, and small variations gathered into an unfinished palette.",
    notes: ["Pigment", "Contrast", "Afterimage"],
  },
  matter: {
    spine: "MATTER",
    title: "The Weight of Paper",
    coverCopy: "Woven cloth, worn corners, a piece of blue tape. Ordinary materials carrying the traces of being held.",
    notes: ["Texture", "Fold", "Impression"],
  },
  field: {
    spine: "FIELD",
    title: "An Open Field",
    coverCopy: "A measured line becomes a loose grid. Fragments collected at the edge of a page, with room left for what comes next.",
    notes: ["Observation", "Interval", "Open space"],
  },
  notes: {
    spine: "NOTES",
    title: "Loose Leaves",
    coverCopy: "A few unfinished sentences. A translucent page. Small observations kept together without putting them in order.",
    notes: ["Fragments", "Margins", "Repetition"],
  },
  index: {
    spine: "INDEX",
    title: "Little Index",
    coverCopy: "A small companion to a larger collection. Marks, samples, and other things worth returning to.",
    notes: ["Samples", "Marks", "Return"],
  },
} satisfies Record<VolumeId, { spine: string; title: string; coverCopy: string; notes: string[] }>;
