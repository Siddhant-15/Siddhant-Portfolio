import * as THREE from "three";

/**
 * Creates a PlaneGeometry whose surface bends along the local X-axis,
 * like a shallow cylindrical section — the "curved screen" look from the
 * reference (Weichie-style) carousel.
 *
 * At x = 0 (card center) z = 0 (closest to camera). At the left/right
 * edges z = -bendDepth (pushed away from the viewer). This is a parabolic
 * approximation of a cylinder arc — at these shallow depths (a few % of
 * the card width) it's visually indistinguishable from a true cylinder
 * and much cheaper to compute.
 *
 * @param width      card width in world units (match your px-per-unit camera setup)
 * @param height     card height in world units
 * @param bendDepth  how far the edges recede in world units (try ~8-12% of width)
 * @param segmentsX  horizontal subdivisions — more = smoother curve (24-32 is plenty)
 * @param segmentsY  vertical subdivisions — the bend doesn't vary with Y, so 1 is enough
 */
export function createCurvedPlaneGeometry(
  width: number,
  height: number,
  bendDepth: number,
  segmentsX = 28,
  segmentsY = 1
): THREE.PlaneGeometry {
  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
  const position = geometry.attributes.position;
  const halfWidth = width / 2;

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const t = x / halfWidth; // -1..1 across the card
    const z = -bendDepth * t * t; // parabolic bend, 0 at center, -bendDepth at edges
    position.setZ(i, z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}