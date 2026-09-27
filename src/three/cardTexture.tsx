import * as THREE from "three";
import type { Project } from "../types";

const PIXEL_RATIO = 2;
const ACCENT = "#ff9f1c";

export interface CardTextureSize {
  width: number;
  height: number;
}

function mulberry32(seed: number) {
  let a = seed | 0;

  return function () {
    a =
      (a + 0x6d2b79f5) |
      0;

    let t = Math.imul(
      a ^ (a >>> 15),
      1 | a
    );

    t =
      (t +
        Math.imul(
          t ^ (t >>> 7),
          61 | t
        )) ^
      t;

    return (
      ((t ^ (t >>> 14)) >>> 0) /
      4294967296
    );
  };
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();

  ctx.moveTo(x + r, y);

  ctx.arcTo(
    x + w,
    y,
    x + w,
    y + h,
    r
  );

  ctx.arcTo(
    x + w,
    y + h,
    x,
    y + h,
    r
  );

  ctx.arcTo(
    x,
    y + h,
    x,
    y,
    r
  );

  ctx.arcTo(
    x,
    y,
    x + w,
    y,
    r
  );

  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
) {
  const words = text.split(" ");

  const lines: string[] = [];

  let line = "";

  for (const word of words) {
    const test = line
      ? `${line} ${word}`
      : word;

    if (
      ctx.measureText(test).width >
        maxWidth &&
      line
    ) {
      lines.push(line);
      line = word;

      if (
        lines.length ===
        maxLines - 1
      ) {
        break;
      }
    } else {
      line = test;
    }
  }

  if (line) {
    lines.push(line);
  }

  if (lines.length === maxLines) {
    const consumed =
      lines.join(" ").length;

    if (consumed < text.length) {
      lines[lines.length - 1] =
        lines[lines.length - 1].replace(
          /\s*\S*$/,
          "…"
        );
    }
  }

  return lines;
}

function drawArt(
  ctx: CanvasRenderingContext2D,
  kind: string,
  w: number,
  h: number,
  seed: number
) {
  const rand = mulberry32(seed);

  ctx.save();

  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.clip();

  const glow =
    ctx.createRadialGradient(
      w * 0.72,
      h * 0.1,
      0,
      w * 0.72,
      h * 0.1,
      w * 0.9
    );

  glow.addColorStop(
    0,
    "rgba(255,159,28,0.20)"
  );

  glow.addColorStop(
    1,
    "rgba(255,159,28,0)"
  );

  ctx.fillStyle = glow;
  ctx.fillRect(
    0,
    0,
    w,
    h
  );

  const shade =
    ctx.createLinearGradient(
      0,
      0,
      0,
      h
    );

  shade.addColorStop(
    0,
    "rgba(0,0,0,0.25)"
  );

  shade.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle = shade;

  ctx.fillRect(
    0,
    0,
    w,
    h
  );

  if (kind === "graph") {
    const cols = 6;

    for (
      let i = 0;
      i < cols;
      i++
    ) {
      const x =
        (w / cols) *
        (i + 0.5);

      const barH =
        h *
        (0.25 +
          rand() * 0.5);

      ctx.fillStyle =
        i % 2 === 0
          ? "rgba(255,159,28,0.35)"
          : "rgba(255,255,255,0.12)";

      ctx.fillRect(
        x - 14,
        h - barH,
        28,
        barH
      );
    }
  } else {
    for (
      let i = 0;
      i < 4;
      i++
    ) {
      const y0 =
        h *
          (0.22 +
            i * 0.18) +
        rand() * 20;

      ctx.beginPath();

      ctx.moveTo(
        -20,
        y0
      );

      ctx.bezierCurveTo(
        w * 0.3,
        y0 -
          60 -
          rand() * 40,
        w * 0.6,
        y0 +
          60 +
          rand() * 40,
        w + 20,
        y0
      );

      ctx.strokeStyle =
        i % 2 === 0
          ? "rgba(255,159,28,0.4)"
          : "rgba(255,255,255,0.15)";

      ctx.lineWidth = 3;

      ctx.stroke();
    }
  }

  ctx.restore();
}

export function createCardTexture(
  project: Project,
  index: number,
  {
    width,
    height,
  }: CardTextureSize
): THREE.CanvasTexture {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    width * PIXEL_RATIO;

  canvas.height =
    height * PIXEL_RATIO;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "2D context unavailable for card texture"
    );
  }

  ctx.scale(
    PIXEL_RATIO,
    PIXEL_RATIO
  );

  const radius = 26;

  roundRectPath(
    ctx,
    0,
    0,
    width,
    height,
    radius
  );

  ctx.save();
  ctx.clip();

  const bg =
    ctx.createLinearGradient(
      0,
      0,
      width * 0.4,
      height
    );

  bg.addColorStop(
    0,
    "rgba(255,255,255,0.07)"
  );

  bg.addColorStop(
    0.45,
    "#141416"
  );

  bg.addColorStop(
    1,
    "#0b0b0c"
  );

  ctx.fillStyle = bg;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  const artHeight =
    height * 0.56;

  /**
   * Use the REAL project index as the
   * deterministic art seed.
   *
   * Duplicate visual cards therefore
   * remain visually consistent.
   */
  drawArt(
    ctx,
    project.art,
    width,
    artHeight,
    index + 3
  );

  const scrim =
    ctx.createLinearGradient(
      0,
      artHeight,
      0,
      height
    );

  scrim.addColorStop(
    0,
    "rgba(0,0,0,0)"
  );

  scrim.addColorStop(
    1,
    "rgba(0,0,0,0.3)"
  );

  ctx.fillStyle = scrim;

  ctx.fillRect(
    0,
    artHeight,
    width,
    height - artHeight
  );

  const padX =
    width * 0.07;

  let cursorY =
    artHeight +
    height * 0.08;

  /**
   * PROJECT INDEX
   *
   * This is deliberately NOT the visual
   * carousel slot index.
   *
   * Example:
   *
   * visual slots:
   * 0 1 2 3 4 5 6 7 8 9 10
   *
   * project indexes:
   * 0 1 2 3 4 0 1 2 3 4 0
   *
   * displayed:
   * 01 02 03 04 05 01 02 03 04 05 01
   */
  ctx.font =
    "700 15px Inter, system-ui, sans-serif";

  ctx.fillStyle = ACCENT;

  const idxLabel =
    String(index + 1).padStart(
      2,
      "0"
    );

  ctx.fillText(
    idxLabel,
    padX,
    cursorY
  );

  const idxWidth =
    ctx.measureText(
      idxLabel
    ).width;

  ctx.font =
    "500 13px Inter, system-ui, sans-serif";

  ctx.fillStyle =
    "#8a877f";

  ctx.fillText(
    project.category,
    padX + idxWidth + 12,
    cursorY
  );

  cursorY += 30;

  ctx.font =
    "800 30px Inter, system-ui, sans-serif";

  ctx.fillStyle =
    "#f4f1ea";

  ctx.fillText(
    project.title,
    padX,
    cursorY
  );

  cursorY += 26;

  ctx.font =
    "400 15px Inter, system-ui, sans-serif";

  ctx.fillStyle =
    "#c5c0b5";

  for (const line of wrapText(
    ctx,
    project.description,
    width - padX * 2,
    2
  )) {
    ctx.fillText(
      line,
      padX,
      cursorY
    );

    cursorY += 20;
  }

  const footerY =
    height - height * 0.1;

  ctx.strokeStyle =
    "rgba(255,255,255,0.07)";

  ctx.beginPath();

  ctx.moveTo(
    padX,
    footerY - 16
  );

  ctx.lineTo(
    width - padX,
    footerY - 16
  );

  ctx.stroke();

  ctx.font =
    "500 11px Inter, system-ui, sans-serif";

  ctx.fillStyle =
    "#6f6c64";

  ctx.fillText(
    project.technologies
      .slice(0, 4)
      .join("  ·  "),
    padX,
    footerY + 6
  );

  ctx.textAlign = "right";

  ctx.fillStyle = ACCENT;

  ctx.font =
    "600 12px Inter, system-ui, sans-serif";

  ctx.fillText(
    "View case study →",
    width - padX,
    footerY + 6
  );

  ctx.textAlign = "left";

  ctx.restore();

  roundRectPath(
    ctx,
    0.5,
    0.5,
    width - 1,
    height - 1,
    radius
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.1)";

  ctx.lineWidth = 1;

  ctx.stroke();

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.anisotropy = 4;

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}