"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { createBookBinding, type BookBinding } from "./BookBinding";
import { studioContent, type VolumeId } from "./content";

gsap.registerPlugin(useGSAP);

const ARTBOARD = { width: 1672, height: 941 };
const BASELINE_Y = 884;

type TapeSpec = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: "aged" | "blue" | "linen";
};

type VolumeSpec = {
  id: VolumeId;
  number: string;
  spine: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  rotationZ: number;
  yaw: number;
  base: string;
  side: string;
  ink: string;
  material: "paper" | "vellum" | "matte" | "cloth";
  lower?: {
    color: string;
    y: number;
    height: number;
    opacity?: number;
  };
  lines?: "blue-rule" | "grid" | "cloth-lines" | "field";
  tapes?: TapeSpec[];
  coverCopy: string;
  notes: string[];
};

type ShelfProp = {
  id: string;
  attachedTo?: VolumeId;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  rotationZ?: number;
  kind: "paper" | "vellum" | "cloth" | "tab";
};

type BookNode = {
  id: VolumeId;
  spec: VolumeSpec;
  group: THREE.Group;
  hit: THREE.Object3D;
  binding: BookBinding;
  base: {
    x: number;
    y: number;
    z: number;
    rotationZ: number;
    rotationY: number;
  };
};

const volumes: VolumeSpec[] = [
  {
    id: "form",
    number: "01",
    ...studioContent.form,
    x: 138,
    y: 348,
    width: 126,
    height: 536,
    depth: 34,
    rotationZ: -1.1,
    yaw: -0.03,
    base: "#f8f1df",
    side: "#d9cfb7",
    ink: "#161411",
    material: "paper",
    lower: { color: "#191714", y: 642, height: 242, opacity: 0.98 },
    tapes: [{ x: -72, y: 170, width: 76, height: 116, rotation: -4, color: "aged" }],
  },
  {
    id: "light",
    number: "02",
    ...studioContent.light,
    x: 362,
    y: 340,
    width: 204,
    height: 544,
    depth: 26,
    rotationZ: 0.45,
    yaw: 0.018,
    base: "#f6f3ea",
    side: "#d4d0c3",
    ink: "#151311",
    material: "vellum",
    lower: { color: "#b7c9d7", y: 708, height: 176, opacity: 0.62 },
    lines: "blue-rule",
  },
  {
    id: "color",
    number: "03",
    ...studioContent.color,
    x: 594,
    y: 360,
    width: 106,
    height: 524,
    depth: 30,
    rotationZ: 0.15,
    yaw: -0.012,
    base: "#c84c39",
    side: "#8e332a",
    ink: "#151311",
    material: "matte",
    lower: { color: "#e8bcb6", y: 762, height: 122, opacity: 0.92 },
  },
  {
    id: "matter",
    number: "04",
    ...studioContent.matter,
    x: 704,
    y: 242,
    width: 358,
    height: 642,
    depth: 76,
    rotationZ: 0.25,
    yaw: 0.035,
    base: "#0d2342",
    side: "#071426",
    ink: "#fbf8ee",
    material: "cloth",
    lines: "cloth-lines",
    tapes: [
      { x: 116, y: 306, width: 96, height: 82, rotation: 1.5, color: "blue" },
      { x: -168, y: 236, width: 74, height: 94, rotation: -8, color: "linen" },
    ],
  },
  {
    id: "field",
    number: "05",
    ...studioContent.field,
    x: 1064,
    y: 292,
    width: 190,
    height: 592,
    depth: 32,
    rotationZ: -0.15,
    yaw: -0.018,
    base: "#fbf3df",
    side: "#dfd3b9",
    ink: "#151311",
    material: "paper",
    lower: { color: "#c9cfbc", y: 770, height: 114, opacity: 0.75 },
    lines: "field",
    tapes: [{ x: 70, y: 184, width: 112, height: 40, rotation: 7, color: "aged" }],
  },
  {
    id: "notes",
    number: "06",
    ...studioContent.notes,
    x: 1268,
    y: 348,
    width: 184,
    height: 536,
    depth: 28,
    rotationZ: 0.65,
    yaw: 0.026,
    base: "#f7f5ee",
    side: "#ddd8ce",
    ink: "#151311",
    material: "vellum",
    lower: { color: "#e9c4bd", y: 766, height: 118, opacity: 0.62 },
    tapes: [{ x: -84, y: 182, width: 112, height: 44, rotation: 6, color: "linen" }],
  },
  {
    id: "index",
    number: "07",
    ...studioContent.index,
    x: 1514,
    y: 528,
    width: 70,
    height: 356,
    depth: 26,
    rotationZ: -0.25,
    yaw: -0.025,
    base: "#c49b45",
    side: "#977337",
    ink: "#302817",
    material: "cloth",
    tapes: [{ x: 26, y: -48, width: 50, height: 44, rotation: -2.2, color: "aged" }],
  },
];

const props: ShelfProp[] = [
  {
    id: "left-backing",
    x: 288,
    y: 300,
    z: -36,
    width: 278,
    height: 584,
    color: "#ddd3c0",
    opacity: 0.5,
    rotationZ: -0.3,
    kind: "paper",
  },
  {
    id: "light-backing",
    x: 330,
    y: 350,
    z: -30,
    width: 236,
    height: 534,
    color: "#f4f1e8",
    opacity: 0.36,
    rotationZ: 1.2,
    kind: "vellum",
  },
  {
    id: "right-backing",
    x: 1248,
    y: 350,
    z: -36,
    width: 205,
    height: 534,
    color: "#f4f3ee",
    opacity: 0.5,
    rotationZ: -0.2,
    kind: "vellum",
  },
  {
    id: "pink-tab",
    attachedTo: "notes",
    x: 1434,
    y: 410,
    z: -24,
    width: 76,
    height: 86,
    color: "#e5bea8",
    opacity: 0.96,
    kind: "tab",
  },
];

function toWorldX(px: number) {
  return px - ARTBOARD.width / 2;
}

function toWorldY(px: number) {
  return ARTBOARD.height / 2 - px;
}

function seededRandom(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return () => {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawTrackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  align: "center" | "left" = "center",
) {
  ctx.save();
  ctx.textAlign = "left";
  const chars = Array.from(text);
  const widths = chars.map((char) => ctx.measureText(char).width);
  const total =
    widths.reduce((sum, width) => sum + width, 0) +
    tracking * Math.max(chars.length - 1, 0);
  let cursor = align === "center" ? x - total / 2 : x;

  chars.forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor += widths[index] + tracking;
  });
  ctx.restore();
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function raggedClip(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  roughness: number,
) {
  const step = Math.max(18, Math.round(Math.min(width, height) / 24));

  ctx.beginPath();
  ctx.moveTo(roughness * (rng() - 0.5), roughness * (rng() - 0.5));

  for (let x = 0; x <= width; x += step) {
    ctx.lineTo(x, roughness * (rng() - 0.5));
  }
  for (let y = 0; y <= height; y += step) {
    ctx.lineTo(width + roughness * (rng() - 0.5), y);
  }
  for (let x = width; x >= 0; x -= step) {
    ctx.lineTo(x, height + roughness * (rng() - 0.5));
  }
  for (let y = height; y >= 0; y -= step) {
    ctx.lineTo(roughness * (rng() - 0.5), y);
  }

  ctx.closePath();
  ctx.clip();
}

function addSurfaceNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  mode: VolumeSpec["material"] | ShelfProp["kind"],
  ink = "#171513",
) {
  if (mode === "cloth") {
    for (let index = 0; index < 9500; index += 1) {
      const size = rng() * 0.65 + 0.18;
      ctx.fillStyle =
        rng() > 0.82 ? "rgba(255,255,255,0.012)" : "rgba(0,0,0,0.028)";
      ctx.fillRect(rng() * width, rng() * height, size, size);
    }

    ctx.lineWidth = 0.55;
    ctx.strokeStyle = "rgba(255,255,255,0.026)";
    for (let x = 0; x < width; x += 7) {
      ctx.beginPath();
      ctx.moveTo(x + (rng() - 0.5) * 1.4, 0);
      ctx.lineTo(x + (rng() - 0.5) * 1.4, height);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(0,0,0,0.043)";
    for (let y = 0; y < height; y += 8) {
      ctx.beginPath();
      ctx.moveTo(0, y + (rng() - 0.5) * 1.4);
      ctx.lineTo(width, y + (rng() - 0.5) * 1.4);
      ctx.stroke();
    }
    return;
  }

  const grains = 8500;
  const fiberOpacity = mode === "vellum" ? 0.035 : 0.045;

  for (let index = 0; index < grains; index += 1) {
    const size = rng() * 1.1 + 0.25;
    ctx.fillStyle =
      rng() > 0.54
        ? `rgba(255, 255, 255, ${fiberOpacity})`
        : rgba(ink, fiberOpacity * 0.72);
    ctx.fillRect(rng() * width, rng() * height, size, size);
  }

  ctx.lineWidth = 0.55;
  for (let index = 0; index < 240; index += 1) {
    const y = rng() * height;
    const x = rng() * width;
    const length = rng() * 42 + 12;
    ctx.strokeStyle =
      rng() > 0.5
        ? rgba(ink, fiberOpacity * 1.3)
        : `rgba(255,255,255,${fiberOpacity})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y + (rng() - 0.5) * 2);
    ctx.stroke();
  }

}

function addEdgeWear(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rng: () => number,
  dark = false,
) {
  if (dark) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "rgba(255,255,255,0.075)";
    ctx.lineWidth = 1.1;
    for (let index = 0; index < 5; index += 1) {
      ctx.strokeRect(index + rng() * 2, index + rng() * 2, width - index * 2, height - index * 2);
    }
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  for (let index = 0; index < 130; index += 1) {
    const side = Math.floor(rng() * 4);
    const radius = rng() * 8 + 2;
    const x =
      side === 0 ? rng() * width : side === 1 ? width - rng() * 9 : side === 2 ? rng() * width : rng() * 9;
    const y =
      side === 0 ? rng() * 9 : side === 1 ? rng() * height : side === 2 ? height - rng() * 9 : rng() * height;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = dark ? "screen" : "multiply";
  ctx.strokeStyle = dark ? "rgba(255,255,255,0.08)" : "rgba(31,24,16,0.11)";
  ctx.lineWidth = 1.2;
  for (let index = 0; index < 4; index += 1) {
    ctx.strokeRect(index + rng() * 2, index + rng() * 2, width - index * 2, height - index * 2);
  }
  ctx.restore();
}

function makeTextureFromCanvas(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function distressPlaneGeometry(
  geometry: THREE.PlaneGeometry,
  width: number,
  height: number,
  seed: string,
  roughness: number,
  depthNoise: number,
) {
  const rng = seededRandom(seed);
  const positions = geometry.attributes.position as THREE.BufferAttribute;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const edgeEpsilon = 0.001;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const onVerticalEdge = Math.abs(Math.abs(x) - halfWidth) < edgeEpsilon;
    const onHorizontalEdge = Math.abs(Math.abs(y) - halfHeight) < edgeEpsilon;
    const cornerWeight = onVerticalEdge && onHorizontalEdge ? 1.35 : 1;

    if (onVerticalEdge) {
      positions.setX(index, x + (rng() - 0.5) * roughness * cornerWeight);
    }
    if (onHorizontalEdge) {
      positions.setY(index, y + (rng() - 0.5) * roughness * 0.72 * cornerWeight);
    }
    if (onVerticalEdge || onHorizontalEdge) {
      positions.setZ(index, positions.getZ(index) + (rng() - 0.5) * depthNoise);
    }
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

function createBookTexture(spec: VolumeSpec) {
  const rng = seededRandom(`spine-${spec.id}`);
  const height = 1800;
  const width = Math.max(280, Math.round((height * spec.width) / spec.height));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  raggedClip(ctx, width, height, rng, spec.material === "cloth" ? 5 : 15);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  const topColor =
    spec.material === "cloth"
      ? spec.id === "matter" ? "#10284d" : spec.base
      : spec.material === "matte"
        ? spec.base
        : spec.material === "vellum"
          ? "rgba(255,255,255,0.74)"
          : "#fffaf0";
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(0.45, spec.base);
  gradient.addColorStop(
    1,
    spec.material === "cloth" ? spec.side : rgba(spec.side, 0.38),
  );
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (spec.lower) {
    const lowerY = ((spec.lower.y - spec.y) / spec.height) * height;
    const lowerH = (spec.lower.height / spec.height) * height;
    ctx.globalAlpha = spec.lower.opacity ?? 1;
    ctx.fillStyle = spec.lower.color;
    ctx.fillRect(0, lowerY, width, lowerH);
    ctx.globalAlpha = 1;
  }

  if (spec.lines === "blue-rule") {
    ctx.strokeStyle = "rgba(47, 111, 169, 0.54)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.72, height * 0.02);
    ctx.lineTo(width * 0.72, height * 0.96);
    ctx.stroke();
    ctx.fillStyle = "rgba(244,238,215,0.66)";
    ctx.beginPath();
    ctx.arc(width * 0.86, height * 0.38, width * 0.11, 0, Math.PI * 2);
    ctx.fill();
  }

  if (spec.lines === "cloth-lines") {
    ctx.strokeStyle = "rgba(255,253,248,0.66)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.22);
    ctx.lineTo(width * 0.5, height * 0.38);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width * 0.31, height * 0.92);
    ctx.lineTo(width * 0.69, height * 0.92);
    ctx.stroke();
  }

  if (spec.lines === "field") {
    ctx.strokeStyle = "rgba(23,21,17,0.16)";
    ctx.lineWidth = 1;
    for (let x = width * 0.18; x < width * 0.82; x += width * 0.07) {
      ctx.beginPath();
      ctx.moveTo(x, height * 0.51);
      ctx.lineTo(x, height * 0.73);
      ctx.stroke();
    }
    for (let y = height * 0.56; y < height * 0.72; y += height * 0.035) {
      ctx.beginPath();
      ctx.moveTo(width * 0.12, y);
      ctx.lineTo(width * 0.87, y);
      ctx.stroke();
    }
  }

  addSurfaceNoise(ctx, width, height, rng, spec.material, spec.ink);

  ctx.save();
  ctx.fillStyle = spec.ink;
  ctx.textBaseline = "middle";
  ctx.font = "700 52px Arial, Helvetica, sans-serif";
  const numberY =
    spec.id === "matter"
      ? height * 0.18
      : spec.id === "field"
        ? height * 0.11
        : height * 0.085;
  drawTrackedText(ctx, spec.number, width / 2, numberY, 1, "center");

  ctx.translate(width / 2, (spec.id === "form" ? height * 0.43 : height * 0.52));
  ctx.rotate(-Math.PI / 2);
  ctx.font = "800 64px Arial, Helvetica, sans-serif";
  drawTrackedText(ctx, spec.spine, 0, 0, 18, "center");
  ctx.restore();

  ctx.strokeStyle = spec.id === "matter" ? "rgba(255,253,248,0.52)" : "rgba(23,21,17,0.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width * 0.5, height * 0.72);
  ctx.lineTo(width * 0.5, height * 0.82);
  ctx.stroke();

  addEdgeWear(ctx, width, height, rng, spec.material === "cloth");
  ctx.restore();

  return makeTextureFromCanvas(canvas);
}

function createSpineTexture(spec: VolumeSpec, loader: THREE.ImageLoader) {
  // Keep a usable material if the atlas fails; directory lettering is never baked in.
  const canvas = document.createElement("canvas");
  canvas.width = spec.width * 3;
  canvas.height = spec.height * 3;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  const fallback = createBookTexture(spec);
  ctx.drawImage(fallback.image, 0, 0, canvas.width, canvas.height);
  fallback.dispose();
  const texture = makeTextureFromCanvas(canvas);
  let disposed = false;
  texture.addEventListener("dispose", () => { disposed = true; });
  loader.load("/textures/book-spines.webp", (image) => {
    if (disposed) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(3, 3);
    const crop = spec.id === "index"
      ? { x: 1497, y: 568, width: 33, height: 309 }
      : spec;
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, spec.width, spec.height);

    const placement = {
      form: { x: 62, numberY: 39, labelY: 182 },
      light: { x: 58, numberY: 52, labelY: 228 },
      color: { x: 56, numberY: 38, labelY: 220 },
      matter: { x: 182, numberY: 114, labelY: 353 },
      field: { x: 79, numberY: 64, labelY: 248 },
      notes: { x: 86, numberY: 55, labelY: 237 },
      index: { x: 35, numberY: 32, labelY: 139 },
    }[spec.id];
    ctx.fillStyle = spec.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${spec.id === "index" ? 12 : 17}px Arial, Helvetica, sans-serif`;
    ctx.fillText(spec.number, placement.x, placement.numberY);
    ctx.save();
    ctx.translate(placement.x, placement.labelY);
    ctx.rotate(-Math.PI / 2);
    const tracking = spec.id === "index" ? 3 : 5;
    let fontSize = spec.id === "index" ? 15 : 23;
    const maxWidth = spec.height * 0.42;
    ctx.font = `500 ${fontSize}px Arial, Helvetica, sans-serif`;
    while (ctx.measureText(spec.spine).width + tracking * (spec.spine.length - 1) > maxWidth && fontSize > 10) {
      fontSize -= 1;
      ctx.font = `500 ${fontSize}px Arial, Helvetica, sans-serif`;
    }
    drawTrackedText(ctx, spec.spine, 0, 0, tracking, "center");
    ctx.restore();

    if (spec.id === "matter") {
      ctx.strokeStyle = "rgba(255,253,248,0.72)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(182, 144);
      ctx.lineTo(182, 247);
      ctx.moveTo(124, 590);
      ctx.lineTo(246, 590);
      ctx.stroke();
    }
    ctx.restore();
    texture.needsUpdate = true;
  });
  return texture;
}

function createBumpTexture(spec: VolumeSpec) {
  const rng = seededRandom(`bump-${spec.id}`);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(280, Math.round((1200 * spec.width) / spec.height));
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  addSurfaceNoise(ctx, canvas.width, canvas.height, rng, spec.material, "#5f5b55");

  const texture = makeTextureFromCanvas(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

function createJacketTexture(spec: VolumeSpec, loader: THREE.ImageLoader) {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1400;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  const texture = makeTextureFromCanvas(canvas);
  let disposed = false;
  texture.addEventListener("dispose", () => { disposed = true; });

  const draw = (atlas?: HTMLImageElement) => {
    ctx.fillStyle = spec.base;
    ctx.fillRect(0, 0, 1000, 1400);
    if (atlas) {
      const crop = spec.id === "index" ? { x: 1497, y: 568, width: 33, height: 309 } : spec;
      ctx.drawImage(atlas, crop.x, crop.y, crop.width, crop.height, 0, 0, 1000, 1400);
    } else {
      addSurfaceNoise(ctx, 1000, 1400, seededRandom(`jacket-${spec.id}`), spec.material, spec.ink);
    }

    ctx.fillStyle = spec.ink;
    ctx.textAlign = "left";
    ctx.font = "24px Arial, Helvetica, sans-serif";
    ctx.fillText(`MATERIAL STUDIES     /     ${spec.number}`, 96, 126);
    ctx.strokeStyle = spec.ink;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(96, 169);
    ctx.lineTo(894, 169);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.font = "92px Georgia, Times New Roman, serif";
    const words = spec.title.split(" ");
    let line = "";
    let y = 368;
    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > 785 && line) {
        ctx.fillText(line, 96, y);
        line = word;
        y += 106;
      } else line = next;
    });
    ctx.fillText(line, 96, y);

    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 2;
    if (spec.id === "index") {
      ctx.strokeRect(196, 690, 602, 322);
      ctx.beginPath();
      ctx.moveTo(196, 690);
      ctx.lineTo(497, 878);
      ctx.lineTo(798, 690);
      ctx.stroke();
    } else if (spec.id === "matter") {
      ctx.strokeRect(100, 630, 590, 370);
      ctx.strokeRect(252, 722, 590, 370);
      ctx.strokeRect(405, 814, 436, 278);
    } else if (spec.id === "light") {
      for (let i = 0; i < 5; i += 1) {
        ctx.beginPath();
        ctx.moveTo(120, 708 + i * 56);
        ctx.bezierCurveTo(390, 630 + i * 30, 564, 1150 - i * 64, 876, 720 + i * 58);
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(98, 790);
      ctx.lineTo(668, 790);
      ctx.moveTo(668, 675);
      ctx.lineTo(668, 1030);
      ctx.stroke();
      ctx.font = "140px Georgia, Times New Roman, serif";
      if (spec.id === "form") ctx.fillStyle = "#f6f1e5";
      ctx.fillText(spec.number, 730, 950);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = spec.id === "form" ? "#f6f1e5" : spec.ink;
    ctx.font = "22px Arial, Helvetica, sans-serif";
    ctx.fillText(spec.spine, 98, 1300);
    ctx.textAlign = "right";
    ctx.fillText("COLLECTED EDITIONS", 890, 1300);
    texture.needsUpdate = true;
  };
  draw();
  loader.load("/textures/book-spines.webp", (atlas) => { if (!disposed) draw(atlas); });
  return texture;
}

function createEndpaperTexture(spec: VolumeSpec) {
  const canvas = document.createElement("canvas");
  canvas.width = 700;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.fillStyle = spec.id === "matter" ? "#d8ded5" : "#eee8d9";
  ctx.fillRect(0, 0, 700, 1000);
  addSurfaceNoise(ctx, 700, 1000, seededRandom(`endpaper-${spec.id}`), "paper", spec.ink);
  ctx.strokeStyle = "rgba(68,76,65,0.13)";
  ctx.lineWidth = 1;
  for (let x = 30; x < 700; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1000);
    ctx.stroke();
  }
  for (let y = 20; y < 1000; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(700, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#f8f4e9";
  ctx.fillRect(110, 310, 480, 260);
  ctx.fillStyle = "#34372e";
  ctx.textAlign = "center";
  ctx.font = "18px Georgia, Times New Roman, serif";
  ctx.fillText("AN UNFINISHED COLLECTION", 350, 370);
  ctx.font = "46px Georgia, Times New Roman, serif";
  ctx.fillText("Material Studies", 350, 442);
  ctx.font = "20px Arial, Helvetica, sans-serif";
  ctx.fillText(`${spec.number}   /   ${spec.spine}`, 350, 520);
  return makeTextureFromCanvas(canvas);
}

function createCoverTexture(spec: VolumeSpec) {
  const rng = seededRandom(`cover-${spec.id}`);
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const dark = spec.id === "matter";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  raggedClip(ctx, canvas.width, canvas.height, rng, dark ? 7 : 18);

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, dark ? "#0a1f3d" : "#fffaf0");
  gradient.addColorStop(0.55, spec.base);
  gradient.addColorStop(1, dark ? "#0f2d58" : "#ebe0c9");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  addSurfaceNoise(ctx, canvas.width, canvas.height, rng, spec.material, spec.ink);

  ctx.fillStyle = spec.ink;
  ctx.textBaseline = "alphabetic";
  ctx.font = "700 28px Arial, Helvetica, sans-serif";
  drawTrackedText(ctx, spec.number, 104, 112, 3, "left");
  let titleSize = 78;
  ctx.font = `700 ${titleSize}px Arial, Helvetica, sans-serif`;
  while (ctx.measureText(spec.title.toUpperCase()).width + (spec.title.length - 1) * 2 > 790 && titleSize > 32) {
    titleSize -= 1;
    ctx.font = `700 ${titleSize}px Arial, Helvetica, sans-serif`;
  }
  drawTrackedText(ctx, spec.title.toUpperCase(), 104, 232, 2, "left");

  ctx.strokeStyle = dark ? "rgba(255,253,248,0.62)" : "rgba(23,21,17,0.28)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(104, 294);
  ctx.lineTo(442, 294);
  ctx.stroke();

  if (spec.id === "form") {
    ctx.strokeStyle = "rgba(23,21,17,0.32)";
    ctx.lineWidth = 3;
    [0, 1, 2].forEach((row) => {
      const y = 420 + row * 108;
      ctx.beginPath();
      ctx.moveTo(118, y);
      ctx.bezierCurveTo(260, y - 80, 350, y + 84, 500, y + 4);
      ctx.bezierCurveTo(640, y - 72, 744, y + 30, 862, y - 18);
      ctx.stroke();
    });
    ["#171513", "#c84c39", "#2f6fa9", "#e1b04a"].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(180 + index * 174, 420 + (index % 2) * 110, 18, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (spec.id === "light") {
    [
      ["#2f6fa9", 188, 460, 132, 0.24],
      ["#c84c39", 340, 410, 82, 0.18],
      ["#e1b04a", 604, 520, 150, 0.2],
      ["#88a891", 720, 394, 72, 0.18],
    ].forEach(([color, x, y, radius, alpha]) => {
      ctx.fillStyle = rgba(String(color), Number(alpha));
      ctx.beginPath();
      ctx.arc(Number(x), Number(y), Number(radius), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.strokeStyle = "rgba(23,21,17,0.2)";
    for (let y = 760; y <= 900; y += 48) {
      ctx.beginPath();
      ctx.moveTo(120, y);
      ctx.lineTo(820 - (y % 96), y);
      ctx.stroke();
    }
  }

  if (spec.id === "color") {
    ctx.strokeStyle = "rgba(23,21,17,0.46)";
    ctx.lineWidth = 4;
    const boxes = [
      [145, 430, 225, 122],
      [572, 430, 225, 122],
      [358, 690, 225, 122],
    ];
    boxes.forEach(([x, y, w, h]) => {
      ctx.strokeRect(x, y, w, h);
    });
    ctx.beginPath();
    ctx.moveTo(370, 490);
    ctx.lineTo(572, 490);
    ctx.moveTo(684, 552);
    ctx.lineTo(684, 690);
    ctx.moveTo(258, 552);
    ctx.lineTo(258, 690);
    ctx.lineTo(358, 690);
    ctx.stroke();
  }

  if (spec.id === "matter") {
    ctx.strokeStyle = "rgba(255,253,248,0.52)";
    ctx.lineWidth = 2;
    ctx.strokeRect(112, 404, 298, 200);
    ctx.strokeRect(498, 404, 300, 200);
    ctx.strokeRect(112, 704, 686, 98);
    ctx.fillStyle = "rgba(225,176,74,0.86)";
    ctx.beginPath();
    ctx.arc(730, 238, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  if (spec.id === "field") {
    ctx.strokeStyle = "rgba(23,21,17,0.2)";
    ctx.lineWidth = 2;
    for (let x = 120; x <= 860; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 400);
      ctx.lineTo(x, 820);
      ctx.stroke();
    }
    for (let y = 410; y <= 820; y += 54) {
      ctx.beginPath();
      ctx.moveTo(120, y);
      ctx.lineTo(860, y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(201,207,188,0.64)";
    ctx.fillRect(112, 840, 690, 130);
  }

  if (spec.id === "notes") {
    ctx.strokeStyle = "rgba(23,21,17,0.27)";
    ctx.lineWidth = 3;
    for (let y = 420; y <= 720; y += 68) {
      ctx.beginPath();
      ctx.moveTo(118, y);
      ctx.lineTo(820 - ((y / 68) % 3) * 90, y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(225,176,74,0.28)";
    ctx.beginPath();
    ctx.bezierCurveTo(674, 342, 806, 330, 826, 446);
    ctx.bezierCurveTo(850, 584, 636, 556, 674, 342);
    ctx.fill();
  }

  const copy = spec.coverCopy.split(" ");
  ctx.fillStyle = dark ? "rgba(255,253,248,0.76)" : "rgba(23,21,17,0.74)";
  ctx.font = "400 31px Arial, Helvetica, sans-serif";
  let line = "";
  let y = 940;
  copy.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > 620) {
      ctx.fillText(line, 112, y);
      line = word;
      y += 43;
    } else {
      line = next;
    }
  });
  ctx.fillText(line, 112, y);

  ctx.font = "500 20px Arial, Helvetica, sans-serif";
  spec.notes.forEach((note, index) => {
    ctx.fillText(note, 112 + index * 260, 1180, 240);
  });

  addEdgeWear(ctx, canvas.width, canvas.height, rng, dark);
  ctx.restore();

  return makeTextureFromCanvas(canvas);
}

function createTapeTexture(color: TapeSpec["color"]) {
  const rng = seededRandom(`tape-${color}`);
  const canvas = document.createElement("canvas");
  canvas.width = 520;
  canvas.height = 190;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const palette = {
    aged: ["#d8c99e", "#f2ead0", "#b9ae89"],
    blue: ["#0c285e", "#173874", "#071a3d"],
    linen: ["#d6c9a7", "#f1e9cf", "#bbb08f"],
  }[color];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  raggedClip(ctx, canvas.width, canvas.height, rng, 18);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(0.5, palette[1]);
  gradient.addColorStop(1, palette[2]);
  ctx.globalAlpha = color === "blue" ? 0.92 : 0.76;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = color === "blue" ? "rgba(255,255,255,0.035)" : "rgba(73,54,28,0.08)";
  ctx.lineWidth = 1;
  for (let x = 16; x < canvas.width; x += 19) {
    ctx.beginPath();
    ctx.moveTo(x + (rng() - 0.5) * 5, 0);
    ctx.lineTo(x + (rng() - 0.5) * 5, canvas.height);
    ctx.stroke();
  }
  addSurfaceNoise(ctx, canvas.width, canvas.height, rng, "paper");
  addEdgeWear(ctx, canvas.width, canvas.height, rng, color === "blue");
  ctx.restore();

  return makeTextureFromCanvas(canvas);
}

function createPropTexture(prop: ShelfProp) {
  const rng = seededRandom(`prop-${prop.id}`);
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = Math.max(260, Math.round((canvas.width * prop.height) / prop.width));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  if (prop.kind === "tab") {
    roundedRectPath(ctx, 22, 20, canvas.width - 44, canvas.height - 40, 72);
    ctx.clip();
  } else {
    raggedClip(ctx, canvas.width, canvas.height, rng, 18);
  }

  ctx.fillStyle = prop.color;
  ctx.globalAlpha = prop.opacity;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  if (prop.kind === "cloth") {
    addSurfaceNoise(ctx, canvas.width, canvas.height, rng, "cloth");
  } else {
    addSurfaceNoise(ctx, canvas.width, canvas.height, rng, prop.kind);
  }

  ctx.restore();
  return makeTextureFromCanvas(canvas);
}

function createSoftShadowTexture(seed: string) {
  const rng = seededRandom(`shadow-${seed}`);
  const canvas = document.createElement("canvas");
  canvas.width = 760;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.filter = "blur(24px)";
  const gradient = ctx.createRadialGradient(
    canvas.width * 0.54,
    canvas.height * 0.55,
    canvas.width * 0.08,
    canvas.width * 0.52,
    canvas.height * 0.56,
    canvas.width * 0.56,
  );
  gradient.addColorStop(0, `rgba(31,24,17,${0.16 + rng() * 0.04})`);
  gradient.addColorStop(0.5, "rgba(31,24,17,0.062)");
  gradient.addColorStop(1, "rgba(31,24,17,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(72, 76, canvas.width - 144, canvas.height - 152);
  ctx.restore();

  return makeTextureFromCanvas(canvas);
}

function createBackgroundTexture() {
  const rng = seededRandom("background-paper");
  const canvas = document.createElement("canvas");
  canvas.width = 2400;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#fbf7ed");
  gradient.addColorStop(0.72, "#f6efdf");
  gradient.addColorStop(1, "#eee3cf");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  addSurfaceNoise(ctx, canvas.width, canvas.height, rng, "paper");

  ctx.globalCompositeOperation = "multiply";
  for (let index = 0; index < 260; index += 1) {
    ctx.fillStyle = `rgba(87,67,43,${rng() * 0.025})`;
    ctx.beginPath();
    ctx.arc(rng() * canvas.width, rng() * canvas.height, rng() * 3.2 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  return makeTextureFromCanvas(canvas);
}

function createBook(
  spec: VolumeSpec,
  texture: THREE.Texture,
  bump: THREE.Texture,
  transientTextures: THREE.Texture[],
  jacket: THREE.Texture,
  inside: THREE.Texture,
  endpaper: THREE.Texture,
) {
  const group = new THREE.Group();
  const centerX = toWorldX(spec.x + spec.width / 2);
  const centerY = toWorldY(BASELINE_Y - spec.height / 2);

  group.position.set(centerX, centerY, 0);
  group.rotation.z = THREE.MathUtils.degToRad(spec.rotationZ);
  group.rotation.y = spec.yaw;

  const binding = createBookBinding({
    thickness: spec.width,
    height: spec.height,
    width: Math.max(300, spec.height * 0.72),
    spineZ: spec.depth / 2,
    color: spec.side,
    cover: jacket,
    inside,
    endpaper,
    bump,
  });
  group.add(binding.group);

  const frontMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    bumpMap: bump,
    bumpScale:
      spec.material === "cloth" ? 0.18 : spec.material === "vellum" ? 0.08 : 0.12,
    roughness: spec.material === "cloth" ? 0.98 : 0.9,
    metalness: 0,
    transparent: true,
    opacity: spec.material === "vellum" ? 0.9 : 1,
    alphaTest: 0.03,
    side: THREE.DoubleSide,
  });
  const frontGeometry = new THREE.PlaneGeometry(spec.width, spec.height, 24, 96);
  const positions = frontGeometry.attributes.position as THREE.BufferAttribute;
  const ripple = seededRandom(`ripple-${spec.id}`);
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const amplitude =
      spec.material === "cloth" ? 0.14 : spec.material === "vellum" ? 0.18 : 0.12;
    const wave =
      Math.sin((x + spec.width * 0.5) * 0.021 + y * 0.009) * amplitude * 0.48;
    positions.setZ(index, wave + (ripple() - 0.5) * amplitude * 0.18);
  }
  const edgeRoughness =
    spec.material === "cloth"
      ? 1.3
      : spec.material === "matte"
        ? 1.9
        : spec.material === "vellum"
          ? 2.8
          : 3.4;
  distressPlaneGeometry(
    frontGeometry,
    spec.width,
    spec.height,
    `front-edge-${spec.id}`,
    edgeRoughness,
    edgeRoughness * 0.24,
  );
  positions.needsUpdate = true;
  frontGeometry.computeVertexNormals();

  const front = new THREE.Mesh(frontGeometry, frontMaterial);
  front.position.z = spec.depth / 2 + 1;
  front.castShadow = true;
  front.receiveShadow = true;
  front.userData.bookId = spec.id;
  group.add(front);

  const includeLooseTapeMeshes = true;
  if (includeLooseTapeMeshes) {
    spec.tapes?.forEach((tape) => {
      if (tape.color === "blue") return;
      const tapeTexture = createTapeTexture(tape.color);
      transientTextures.push(tapeTexture);
      const tapeOpacity = tape.color === "aged" ? 0.42 : 0.38;
      const tapeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(tape.width, tape.height, 8, 4),
        new THREE.MeshStandardMaterial({
          map: tapeTexture,
          roughness: 0.88,
          transparent: true,
          opacity: tapeOpacity,
          alphaTest: 0.018,
          side: THREE.DoubleSide,
        }),
      );
      tapeMesh.position.set(tape.x, tape.y, spec.depth / 2 + 5);
      tapeMesh.rotation.z = THREE.MathUtils.degToRad(tape.rotation);
      tapeMesh.castShadow = true;
      group.add(tapeMesh);
    });
  }

  return {
    id: spec.id,
    spec,
    group,
    hit: front,
    binding,
    base: {
      x: centerX,
      y: centerY,
      z: 0,
      rotationZ: group.rotation.z,
      rotationY: group.rotation.y,
    },
  };
}

function createLineCross(x: number, y: number) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        x - 16,
        y,
        8,
        x + 16,
        y,
        8,
        x,
        y - 16,
        8,
        x,
        y + 16,
        8,
      ],
      3,
    ),
  );
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ color: "#171513", transparent: true, opacity: 0.38 }),
  );
}

function renderCanvasFallback(host: HTMLDivElement, volumes: VolumeSpec[]) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  canvas.className = "bookshelf-canvas bookshelf-canvas--fallback";
  host.appendChild(canvas);

  let activeId: VolumeId | null = null;
  let hoverId: VolumeId | null = null;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  const drawBook = (spec: VolumeSpec) => {
    const rng = seededRandom(`fallback-${spec.id}`);
    const x = offsetX + spec.x * scale;
    const y = offsetY + spec.y * scale;
    const width = spec.width * scale;
    const height = spec.height * scale;
    const depth = spec.depth * 0.22 * scale;
    const lifted = activeId === spec.id ? -52 * scale : hoverId === spec.id ? -18 * scale : 0;

    ctx.save();
    ctx.translate(x + width / 2, y + height + lifted);
    ctx.rotate(THREE.MathUtils.degToRad(spec.rotationZ));
    ctx.translate(-width / 2, -height);

    ctx.shadowColor = "rgba(23, 21, 17, 0.18)";
    ctx.shadowBlur = 32 * scale;
    ctx.shadowOffsetY = 24 * scale;
    ctx.fillStyle = spec.side;
    ctx.beginPath();
    ctx.moveTo(width, 5 * scale);
    ctx.lineTo(width + depth, 14 * scale);
    ctx.lineTo(width + depth, height - 7 * scale);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.save();
    raggedClip(ctx, width, height, rng, (spec.material === "cloth" ? 4 : 11) * scale);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const topColor =
      spec.material === "cloth"
        ? "#10284d"
        : spec.material === "matte"
          ? spec.base
          : spec.material === "vellum"
            ? "rgba(255,255,255,0.74)"
            : "#fffaf0";
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(0.44, spec.base);
    gradient.addColorStop(1, spec.material === "cloth" ? spec.side : rgba(spec.side, 0.42));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (spec.lower) {
      const lowerY = (spec.lower.y - spec.y) * scale;
      ctx.globalAlpha = spec.lower.opacity ?? 1;
      ctx.fillStyle = spec.lower.color;
      ctx.fillRect(0, lowerY, width, spec.lower.height * scale);
      ctx.globalAlpha = 1;
    }

    addSurfaceNoise(ctx, width, height, rng, spec.material, spec.ink);
    addEdgeWear(ctx, width, height, rng, spec.material === "cloth");

    ctx.fillStyle = spec.ink;
    ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.max(10, 19 * scale)}px Arial, Helvetica, sans-serif`;
    const numberY =
      spec.id === "matter"
        ? height * 0.18
        : spec.id === "field"
          ? height * 0.11
          : height * 0.085;
    drawTrackedText(ctx, spec.number, width / 2, numberY, 1.2 * scale, "center");
    ctx.save();
    ctx.translate(width / 2, (spec.id === "form" ? height * 0.43 : height * 0.52));
    ctx.rotate(-Math.PI / 2);
    ctx.font = `800 ${Math.max(14, 24 * scale)}px Arial, Helvetica, sans-serif`;
    drawTrackedText(ctx, spec.spine, 0, 0, 5.2 * scale, "center");
    ctx.restore();
    ctx.restore();

    spec.tapes?.forEach((tape) => {
      ctx.save();
      ctx.translate(width / 2 + tape.x * scale, height / 2 - tape.y * scale);
      ctx.rotate(THREE.MathUtils.degToRad(tape.rotation));
      const tapeW = tape.width * scale;
      const tapeH = tape.height * scale;
      const palette =
        tape.color === "blue"
          ? "#102c56"
          : tape.color === "linen"
            ? "#d8cfad"
            : "#dfd2a7";
      raggedClip(ctx, tapeW, tapeH, rng, 5 * scale);
      ctx.globalAlpha = tape.color === "blue" ? 0.9 : 0.72;
      ctx.fillStyle = palette;
      ctx.fillRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH);
      ctx.globalAlpha = 1;
      ctx.restore();
    });

    ctx.restore();
  };

  const drawCover = () => {
    const active = volumes.find((spec) => spec.id === activeId);
    if (!active) return;
    const coverWidth = 430 * scale;
    const coverHeight = 540 * scale;
    const activeCenter = active.x + active.width / 2;
    const coverCenter = THREE.MathUtils.clamp(
      activeCenter +
        (active.id === "matter" ? -372 : activeCenter < ARTBOARD.width / 2 ? 300 : -300),
      220,
      ARTBOARD.width - 220,
    );
    const x = offsetX + coverCenter * scale - coverWidth / 2;
    const y = offsetY + 226 * scale;
    const rng = seededRandom(`fallback-cover-${active.id}`);

    ctx.save();
    ctx.shadowColor = "rgba(23, 21, 17, 0.22)";
    ctx.shadowBlur = 42 * scale;
    ctx.shadowOffsetY = 28 * scale;
    ctx.translate(x, y);
    raggedClip(ctx, coverWidth, coverHeight, rng, 13 * scale);
    const dark = active.id === "matter";
    ctx.fillStyle = dark ? "#0d2342" : "#fff8e9";
    ctx.fillRect(0, 0, coverWidth, coverHeight);
    addSurfaceNoise(ctx, coverWidth, coverHeight, rng, active.material, active.ink);
    ctx.shadowColor = "transparent";
    ctx.fillStyle = active.ink;
    ctx.textBaseline = "alphabetic";
    ctx.font = `800 ${Math.max(18, 34 * scale)}px Arial, Helvetica, sans-serif`;
    ctx.fillText(active.title.toUpperCase(), 44 * scale, 88 * scale);
    ctx.font = `400 ${Math.max(12, 16 * scale)}px Arial, Helvetica, sans-serif`;
    const words = active.coverCopy.split(" ");
    let line = "";
    let textY = 388 * scale;
    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > coverWidth - 88 * scale) {
        ctx.fillText(line, 44 * scale, textY);
        line = word;
        textY += 24 * scale;
      } else {
        line = next;
      }
    });
    ctx.fillText(line, 44 * scale, textY);
    ctx.restore();
  };

  const draw = () => {
    const cssWidth = Math.max(host.clientWidth, 1);
    const cssHeight = Math.max(host.clientHeight, 1);
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.min(cssWidth / ARTBOARD.width, cssHeight / ARTBOARD.height);
    offsetX = (cssWidth - ARTBOARD.width * scale) / 2;
    offsetY = (cssHeight - ARTBOARD.height * scale) / 2;

    const background = ctx.createLinearGradient(0, 0, 0, cssHeight);
    background.addColorStop(0, "#fbf4e5");
    background.addColorStop(0.72, "#f6edde");
    background.addColorStop(1, "#ecdec9");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    ctx.strokeStyle = "rgba(23,21,17,0.42)";
    ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath();
    ctx.moveTo(offsetX + 31 * scale, offsetY + BASELINE_Y * scale);
    ctx.lineTo(offsetX + 1640 * scale, offsetY + BASELINE_Y * scale);
    ctx.stroke();

    props.forEach((prop) => {
      const x = offsetX + prop.x * scale;
      const y = offsetY + prop.y * scale;
      ctx.save();
      ctx.translate(x + (prop.width * scale) / 2, y + (prop.height * scale) / 2);
      ctx.rotate(THREE.MathUtils.degToRad(prop.rotationZ ?? 0));
      ctx.globalAlpha = prop.opacity;
      ctx.fillStyle = prop.color;
      if (prop.kind === "tab") {
        roundedRectPath(
          ctx,
          (-prop.width * scale) / 2,
          (-prop.height * scale) / 2,
          prop.width * scale,
          prop.height * scale,
          8 * scale,
        );
        ctx.fill();
      } else {
        ctx.fillRect(
          (-prop.width * scale) / 2,
          (-prop.height * scale) / 2,
          prop.width * scale,
          prop.height * scale,
        );
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    });

    volumes.forEach(drawBook);
    drawCover();
  };

  const toArtboardPoint = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - offsetX) / scale,
      y: (event.clientY - rect.top - offsetY) / scale,
    };
  };

  const hitTest = (event: PointerEvent) => {
    const point = toArtboardPoint(event);
    return [...volumes].reverse().find((spec) => {
      return (
        point.x >= spec.x &&
        point.x <= spec.x + spec.width &&
        point.y >= spec.y &&
        point.y <= BASELINE_Y
      );
    });
  };

  const onPointerMove = (event: PointerEvent) => {
    hoverId = hitTest(event)?.id ?? null;
    canvas.style.cursor = hoverId ? "pointer" : "default";
    draw();
  };

  const onPointerDown = (event: PointerEvent) => {
    const hit = hitTest(event);
    activeId = hit ? (activeId === hit.id ? null : hit.id) : null;
    draw();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      activeId = null;
      draw();
    }
  };

  draw();
  window.addEventListener("resize", draw);
  window.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);

  return () => {
    window.removeEventListener("resize", draw);
    window.removeEventListener("keydown", onKeyDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.remove();
  };
}

export function BookshelfScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = hostRef.current;
      if (!host) return undefined;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#f7edde");

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        });
      } catch {
        return renderCanvasFallback(host, volumes);
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.className = "bookshelf-canvas";
      host.appendChild(renderer.domElement);

      const camera = new THREE.OrthographicCamera(
        -ARTBOARD.width / 2,
        ARTBOARD.width / 2,
        ARTBOARD.height / 2,
        -ARTBOARD.height / 2,
        0.1,
        2200,
      );
      camera.position.set(0, 0, 1050);
      camera.lookAt(0, 0, 0);

      const ambient = new THREE.HemisphereLight("#fff6e8", "#b99d77", 1.72);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight("#fff8ec", 1.38);
      keyLight.position.set(-360, 420, 780);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(2048, 2048);
      keyLight.shadow.camera.left = -900;
      keyLight.shadow.camera.right = 900;
      keyLight.shadow.camera.top = 600;
      keyLight.shadow.camera.bottom = -520;
      keyLight.shadow.camera.far = 2400;
      keyLight.shadow.bias = -0.0002;
      keyLight.shadow.normalBias = 0.8;
      scene.add(keyLight);

      const paperTexture = createBackgroundTexture();
      const background = new THREE.Mesh(
        new THREE.PlaneGeometry(2400, 1350),
        new THREE.MeshBasicMaterial({
          map: paperTexture,
        }),
      );
      background.position.set(0, 0, -700);
      background.receiveShadow = true;
      scene.add(background);

      const shadowTextures = new Map<string, THREE.Texture>();
      const transientTextures: THREE.Texture[] = [];
      const attachments: { mesh: THREE.Mesh; prop: ShelfProp }[] = [];
      const spineLoadingManager = new THREE.LoadingManager();
      const spineLoader = new THREE.ImageLoader(spineLoadingManager);
      let setupComplete = false;
      let spinesReady = false;
      let sceneRevealed = false;
      let disposed = false;
      let revealScene = () => {
        spinesReady = true;
      };
      spineLoadingManager.onLoad = () => { if (!disposed) revealScene(); };

      props.forEach((prop) => {
        const propTexture = createPropTexture(prop);
        transientTextures.push(propTexture);
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(prop.width, prop.height, 8, 16),
          new THREE.MeshStandardMaterial({
            map: propTexture,
            roughness: prop.kind === "cloth" ? 0.98 : 0.93,
            metalness: 0,
            transparent: true,
            opacity: prop.opacity,
            alphaTest: prop.kind === "tab" ? 0.02 : 0.012,
            side: THREE.DoubleSide,
          }),
        );
        // Overlapping paper and tape need separate planes to avoid depth-buffer flicker.
        mesh.position.set(
          toWorldX(prop.x + prop.width / 2),
          toWorldY(prop.y + prop.height / 2),
          prop.z,
        );
        mesh.rotation.z = THREE.MathUtils.degToRad(prop.rotationZ ?? 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (prop.attachedTo) attachments.push({ mesh, prop });
        else scene.add(mesh);
      });

      const shelfLine = new THREE.Mesh(
        new THREE.PlaneGeometry(1620, 1.3),
        new THREE.MeshBasicMaterial({ color: "#171513", transparent: true, opacity: 0.52 }),
      );
      shelfLine.position.set(0, toWorldY(BASELINE_Y), 4);
      scene.add(shelfLine);

      scene.add(createLineCross(toWorldX(32), toWorldY(44)));
      scene.add(createLineCross(toWorldX(32), toWorldY(872)));
      scene.add(createLineCross(toWorldX(1638), toWorldY(896)));

      const bookTextures = new Map<VolumeId, THREE.Texture>();
      const bumpTextures = new Map<VolumeId, THREE.Texture>();
      const coverTextures = new Map<VolumeId, THREE.Texture>();
      const nodes: BookNode[] = [];

      volumes.forEach((spec) => {
        const texture = createSpineTexture(spec, spineLoader);
        const bump = createBumpTexture(spec);
        const cover = createCoverTexture(spec);
        const jacket = createJacketTexture(spec, spineLoader);
        const endpaper = createEndpaperTexture(spec);
        transientTextures.push(jacket, endpaper);
        const shadowTexture = createSoftShadowTexture(spec.id);
        bookTextures.set(spec.id, texture);
        bumpTextures.set(spec.id, bump);
        coverTextures.set(spec.id, cover);
        shadowTextures.set(spec.id, shadowTexture);
        const shadow = new THREE.Mesh(
          new THREE.PlaneGeometry(spec.width + 118, spec.height + 88),
          new THREE.MeshBasicMaterial({
            map: shadowTexture,
            transparent: true,
            opacity: spec.id === "matter" ? 0.26 : 0.15,
            depthWrite: false,
          }),
        );
        shadow.position.set(
          toWorldX(spec.x + spec.width / 2) + 14,
          toWorldY(BASELINE_Y - spec.height / 2) - 18,
          -66,
        );
        shadow.rotation.z = THREE.MathUtils.degToRad(spec.rotationZ);
        scene.add(shadow);

        const node = createBook(spec, texture, bump, transientTextures, jacket, cover, endpaper);
        nodes.push(node);
        scene.add(node.group);
      });

      attachments.forEach(({ mesh, prop }) => {
        const owner = nodes.find((node) => node.id === prop.attachedTo);
        if (!owner) return;
        mesh.position.set(
          toWorldX(prop.x + prop.width / 2) - owner.base.x,
          toWorldY(prop.y + prop.height / 2) - owner.base.y,
          owner.spec.depth / 2 + 6,
        );
        owner.group.add(mesh);
      });

      const pointer = new THREE.Vector2(-10, -10);
      const raycaster = new THREE.Raycaster();
      const parallaxTarget = new THREE.Vector2(0, 0);
      const parallax = new THREE.Vector2(0, 0);
      let hovered: BookNode | null = null;
      let active: BookNode | null = null;
      let bookView: "shelf" | "extracting" | "cover" | "opening" | "open" = "shelf";
      const bookMotions = new Map<VolumeId, gsap.core.Timeline>();
      let rafId = 0;

      const resize = () => {
        const width = Math.max(host.clientWidth, 1);
        const height = Math.max(host.clientHeight, 1);
        renderer.setSize(width, height, false);
        const aspect = width / height;
        const artboardAspect = ARTBOARD.width / ARTBOARD.height;
        let viewWidth = ARTBOARD.width;
        let viewHeight = ARTBOARD.height;
        if (aspect > artboardAspect) {
          viewWidth = ARTBOARD.height * aspect;
        } else {
          viewHeight = ARTBOARD.width / aspect;
        }
        camera.left = -viewWidth / 2;
        camera.right = viewWidth / 2;
        camera.top = viewHeight / 2;
        camera.bottom = -viewHeight / 2;
        camera.updateProjectionMatrix();
      };

      const setPointerFromEvent = (event: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        parallaxTarget.copy(pointer);
      };

      const hitTestPointer = () => {
        const worldX =
          camera.position.x +
          THREE.MathUtils.lerp(camera.left, camera.right, (pointer.x + 1) / 2);
        const worldY =
          camera.position.y +
          THREE.MathUtils.lerp(camera.bottom, camera.top, (pointer.y + 1) / 2);
        const artboardX = worldX + ARTBOARD.width / 2;
        const artboardY = ARTBOARD.height / 2 - worldY;
        const margin = 18;

        return [...nodes].reverse().find((node) => {
          const { spec } = node;
          return (
            artboardX >= spec.x - margin &&
            artboardX <= spec.x + spec.width + margin &&
            artboardY >= spec.y - margin &&
            artboardY <= BASELINE_Y + margin
          );
        }) ?? null;
      };

      const setHoveredNode = (next: BookNode | null) => {
        if (next !== hovered) {
          if (hovered && hovered !== active) animateBook(hovered, false);
          hovered = next;
          if (hovered && hovered !== active) animateBook(hovered, true);
        }

        renderer.domElement.style.cursor = hovered ? "pointer" : "default";
        document.body.style.cursor = hovered ? "pointer" : "default";
      };

      const animateBook = (node: BookNode, hover: boolean) => {
        if (bookMotions.get(node.id)?.isActive()) return;
        const targetY = node.base.y + (hover ? 16 : 0);
        const targetZ = node.base.z + (hover ? 76 : 0);
        const targetYaw = node.base.rotationY + (hover ? 0.08 : 0);
        gsap.to(node.group.position, {
          y: targetY,
          z: targetZ,
          duration: hover ? 0.28 : 0.42,
          ease: hover ? "power3.out" : "power3.out",
          overwrite: "auto",
        });
        gsap.to(node.group.rotation, {
          y: targetYaw,
          z: node.base.rotationZ + (hover ? THREE.MathUtils.degToRad(0.9) : 0),
          duration: hover ? 0.28 : 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const stopBookMotion = (node: BookNode) => {
        bookMotions.get(node.id)?.kill();
        gsap.killTweensOf([node.group.position, node.group.rotation, node.group.scale, node.binding.hinge.rotation]);
      };

      const returnBook = (node: BookNode) => {
        stopBookMotion(node);
        const motion = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => { if (!active) host.dataset.bookView = "shelf"; },
        });
        bookMotions.set(node.id, motion);
        motion
          .to(node.binding.hinge.rotation, { y: Math.PI / 2, duration: 0.45 })
          .to(node.group.rotation, { x: 0, y: node.base.rotationY, z: node.base.rotationZ, duration: 0.62 })
          .to(node.group.scale, { x: 1, y: 1, z: 1, duration: 0.62 }, "<")
          .to(node.group.position, { x: node.base.x, y: node.base.y + 22, z: 520, duration: 0.62 }, "<")
          .to(node.group.position, { y: node.base.y, z: node.base.z, duration: 0.52 });
        if (reducedMotion) motion.progress(1);
      };

      const openBook = (node: BookNode) => {
        if (active && active !== node) returnBook(active);
        stopBookMotion(node);
        active = node;
        host.dataset.activeVolume = node.id;
        bookView = "extracting";
        host.dataset.bookView = bookView;
        const scale = Math.min(1.55, 600 / node.spec.height);
        const motion = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            if (active !== node) return;
            bookView = "cover";
            host.dataset.bookView = bookView;
          },
        });
        bookMotions.set(node.id, motion);
        motion
          .to(node.binding.hinge.rotation, { y: Math.PI / 2, duration: 0.2 }, 0)
          .to(node.group.position, { y: 20, z: 580, duration: 0.55 }, 0)
          .to(node.group.rotation, { x: 0.1, y: -Math.PI / 2 + 0.18, z: -0.025, duration: 0.85 }, 0.5)
          .to(node.group.position, { x: (-node.binding.width / 2 + node.spec.depth / 2) * scale, y: 20, z: 260, duration: 0.85 }, 0.5)
          .to(node.group.scale, { x: scale, y: scale, z: scale, duration: 0.85 }, 0.5);
        if (reducedMotion) motion.progress(1);
      };

      const toggleCover = () => {
        if (!active || (bookView !== "cover" && bookView !== "open")) return;
        const node = active;
        const opening = bookView === "cover";
        stopBookMotion(node);
        bookView = "opening";
        host.dataset.bookView = bookView;
        const scale = node.group.scale.x;
        const targetX = opening
          ? (node.spec.depth / 2 - Math.sin(0.18) * node.spec.width / 2) * scale
          : (-node.binding.width / 2 + node.spec.depth / 2) * scale;
        const motion = gsap.timeline({
          defaults: { duration: 1.05, ease: "power3.inOut" },
          onComplete: () => {
            if (active !== node) return;
            bookView = opening ? "open" : "cover";
            host.dataset.bookView = bookView;
          },
        });
        bookMotions.set(node.id, motion);
        motion
          .to(node.binding.hinge.rotation, { y: Math.PI / 2 - (opening ? 2.82 : 0) }, 0)
          .to(node.group.position, { x: targetX }, 0);
        if (reducedMotion) motion.progress(1);
      };

      const closeBook = () => {
        if (!active) return;
        const previous = active;
        active = null;
        bookView = "shelf";
        delete host.dataset.activeVolume;
        host.dataset.bookView = "returning";
        returnBook(previous);
      };

      const hitsActiveBook = () => {
        if (!active) return false;
        scene.updateMatrixWorld();
        raycaster.setFromCamera(pointer, camera);
        return raycaster.intersectObject(active.group, true).length > 0;
      };

      const render = () => {
        if (!reducedMotion) {
          parallax.x += (parallaxTarget.x - parallax.x) * 0.045;
          parallax.y += (parallaxTarget.y - parallax.y) * 0.045;
          camera.position.x = parallax.x * 10;
          camera.position.y = parallax.y * 6;
          camera.lookAt(0, 0, 0);
        }
        renderer.render(scene, camera);
        rafId = window.requestAnimationFrame(render);
      };

      const onPointerMove = (event: PointerEvent) => {
        setPointerFromEvent(event);
        if (hitsActiveBook()) {
          setHoveredNode(null);
          renderer.domElement.style.cursor = "pointer";
          document.body.style.cursor = "pointer";
          return;
        }
        setHoveredNode(hitTestPointer());
      };

      const onPointerLeave = () => {
        pointer.set(-10, -10);
        parallaxTarget.set(0, 0);
        setHoveredNode(null);
      };

      const onPointerDown = (event: PointerEvent) => {
        setPointerFromEvent(event);
        if (hitsActiveBook()) {
          toggleCover();
          return;
        }
        const next = hitTestPointer();
        if (!next) {
          closeBook();
          return;
        }
        if (active === next) {
          closeBook();
          return;
        }
        openBook(next);
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") closeBook();
      };

      const directoryNode = (event: Event) => {
        const id = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-volume]")?.dataset.volume;
        return nodes.find((node) => node.id === id) ?? null;
      };
      const onDirectoryFocus = (event: FocusEvent) => setHoveredNode(directoryNode(event));
      const onDirectoryClick = (event: MouseEvent) => {
        const node = directoryNode(event);
        if (node && node === active) toggleCover();
        else if (node) openBook(node);
      };

      revealScene = () => {
        spinesReady = true;
        if (!setupComplete || sceneRevealed) return;

        sceneRevealed = true;
        renderer.domElement.classList.add("bookshelf-canvas--ready");
        if (!reducedMotion) {
          nodes.forEach((node, index) => {
            gsap.from(node.group.position, {
              y: node.base.y - 20,
              z: -18,
              duration: 0.74,
              delay: 0.08 + index * 0.045,
              ease: "power4.out",
              overwrite: "auto",
            });
            gsap.from(node.group.rotation, {
              z: node.base.rotationZ + THREE.MathUtils.degToRad(index % 2 === 0 ? -1.2 : 1.2),
              duration: 0.74,
              delay: 0.08 + index * 0.045,
              ease: "power4.out",
              overwrite: "auto",
            });
          });
        }
      };

      resize();
      setupComplete = true;
      if (spinesReady) revealScene();
      render();

      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerleave", onPointerLeave);
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("resize", resize);
      window.addEventListener("keydown", onKeyDown);
      host.addEventListener("focusin", onDirectoryFocus);
      host.addEventListener("click", onDirectoryClick);

      return () => {
        disposed = true;
        delete host.dataset.activeVolume;
        delete host.dataset.bookView;
        host.removeEventListener("focusin", onDirectoryFocus);
        host.removeEventListener("click", onDirectoryClick);
        window.cancelAnimationFrame(rafId);
        renderer.domElement.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("resize", resize);
        window.removeEventListener("keydown", onKeyDown);
        document.body.style.cursor = "default";
        bookMotions.forEach((motion) => motion.kill());
        nodes.forEach((node) => {
          gsap.killTweensOf([node.group.position, node.group.rotation, node.group.scale, node.binding.hinge.rotation]);
        });
        scene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const material = mesh.material;
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else if (material) {
            material.dispose();
          }
        });
        bookTextures.forEach((texture) => texture.dispose());
        bumpTextures.forEach((texture) => texture.dispose());
        coverTextures.forEach((texture) => texture.dispose());
        shadowTextures.forEach((texture) => texture.dispose());
        transientTextures.forEach((texture) => texture.dispose());
        paperTexture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    },
    { scope: hostRef },
  );

  return (
    <div
      aria-label="Interactive material studies bookshelf"
      className="bookshelf-stage"
      ref={hostRef}
      tabIndex={0}
    >
      <nav className="shelf-a11y" aria-label="Book collection">
        {volumes.map((volume) => (
          <button key={volume.id} type="button" data-volume={volume.id}>
            {volume.number} {volume.spine}: {volume.title}
          </button>
        ))}
      </nav>
    </div>
  );
}
