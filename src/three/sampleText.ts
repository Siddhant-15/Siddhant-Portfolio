import * as THREE from "three";

/**
 * Rasterises words to an offscreen canvas and samples pixels into
 * per-particle target positions (unit space: widest word spans x∈[-0.5,0.5]).
 * Particles are assigned left→right so morphs between words stay spatially coherent.
 */
export async function sampleWords(words: string[], count: number): Promise<Float32Array[]> {
  try {
    await document.fonts.load('800 200px "Geist Variable"');
  } catch {
    /* fall back to system font */
  }
  const family = '"Geist Variable", "Helvetica Neue", Arial, sans-serif';
  const W = 2400;
  const H = 460;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d context unavailable");

  ctx.font = `800 300px ${family}`;
  const widest = Math.max(...words.map((w) => ctx.measureText(w).width));
  const fontSize = Math.min(300 * (W * 0.96) / widest, 330);
  ctx.font = `800 ${fontSize}px ${family}`;
  const wMax = Math.max(...words.map((w) => ctx.measureText(w).width));
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  return words.map((word) => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    ctx.fillText(word, W / 2, H / 2 + fontSize * 0.04);
    const img = ctx.getImageData(0, 0, W, H).data;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let y = 0; y < H; y += 2) {
      for (let x = 0; x < W; x += 2) {
        if (img[(y * W + x) * 4 + 3] > 128) {
          xs.push(x);
          ys.push(y);
        }
      }
    }
    const n = xs.length || 1;
    const order = Array.from({ length: n }, (_, i) => i).sort(
      (a, b) => xs[a] + Math.random() * 40 - (xs[b] + Math.random() * 40)
    );
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const idx = order[Math.min(n - 1, Math.floor((i / count) * n + Math.random() * (n / count)))] ?? 0;
      out[i * 3] = ((xs[idx] ?? W / 2) - W / 2) / wMax;
      out[i * 3 + 1] = -((ys[idx] ?? H / 2) - H / 2) / wMax;
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
    }
    return out;
  });
}

export const hexToVec3 = (hex: string) => {
  const c = new THREE.Color(hex);
  // ShaderMaterial output is not colour-managed here, so hand over display (sRGB) values.
  const s = c.clone().convertLinearToSRGB();
  return new THREE.Vector3(s.r, s.g, s.b);
};
