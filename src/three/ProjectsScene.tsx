import * as THREE from "three";
import type { Project } from "../types";
import { createCurvedPlaneGeometry } from "./curvedGeometry";
import { createCardTexture } from "./cardTexture";

export interface ProjectsSceneOptions {
  canvas: HTMLCanvasElement;
  projects: Project[];
  onSelect: (index: number, rect: DOMRect | null) => void;
  onHoverChange?: (index: number | null) => void;
  reduced?: boolean;
  /** Override the minimum number of visual card slots around the ring. */
  minSlots?: number;
}

const BASE_CARD_WIDTH = 320;
const BASE_CARD_HEIGHT = 400;
const BASE_CARD_BEND = 40;
const BASE_RADIUS = 680;
const BASE_CAMERA_Z = 1400;
const ROTATION_SPEED = (Math.PI * 1) / 28;
const DRAG_SENSITIVITY = 0.0055;
const CLICK_THRESHOLD = 8;

// If there are fewer projects than this, repeat them cyclically so the
// carousel always has a full ring of cards instead of a few cards with
// huge gaps between them (e.g. 5 projects -> 0,1,2,3,4,0,1,2,3,4).
const MIN_VISUAL_SLOTS = 12;

export class ProjectsScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private stage = new THREE.Group();
  private cards: THREE.Mesh[] = [];
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(-10, -10);
  private hovered: THREE.Mesh | null = null;
  private clock = new THREE.Clock();
  private frameId = 0;
  private disposed = false;
  private container: HTMLElement;
  private spinning: boolean;
  private opts: ProjectsSceneOptions;
  private scale = 1;

  // Drag state
  private isDragging = false;
  private lastClientX = 0;
  private dragDistance = 0;

  constructor(opts: ProjectsSceneOptions) {
    this.opts = opts;
    const { canvas, projects, reduced } = opts;
    this.container = canvas.parentElement as HTMLElement;
    this.spinning = !reduced;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(35, 1, 10, 5000);
    this.camera.position.set(0, 0, BASE_CAMERA_Z);

    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(200, 400, 600);
    this.scene.add(key, new THREE.AmbientLight(0xffffff, 0.55));
    this.scene.add(this.stage);

    // Pad the ring out to a minimum slot count so a handful of projects
    // still fills the carousel evenly, cycling back through the real
    // project list: slot 0,1,2,3,4,5,6,7,8,9 -> project 0,1,2,3,4,0,1,2,3,4
    const slotCount = Math.max(projects.length, opts.minSlots ?? MIN_VISUAL_SLOTS);
    const angleStep = (Math.PI * 2) / slotCount;
    const geometry = createCurvedPlaneGeometry(
      BASE_CARD_WIDTH,
      BASE_CARD_HEIGHT,
      BASE_CARD_BEND,
      28,
      1
    );

    for (let slot = 0; slot < slotCount; slot++) {
      const projectIndex = slot % projects.length;
      const project = projects[projectIndex];

      const texture = createCardTexture(project, projectIndex, {
        width: BASE_CARD_WIDTH,
        height: BASE_CARD_HEIGHT,
      });
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.55,
        metalness: 0.05,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const angle = slot * angleStep;

      mesh.position.set(
        Math.sin(angle) * BASE_RADIUS,
        0,
        Math.cos(angle) * BASE_RADIUS
      );
      mesh.rotation.y = angle;
      // userData.index is always the REAL project index (never the slot
      // index), so onSelect/onHoverChange always resolve to a valid project
      // even though several meshes can share the same index.
      mesh.userData.index = projectIndex;
      mesh.userData.bobOffset = Math.random() * Math.PI * 2;

      this.stage.add(mesh);
      this.cards.push(mesh);
    }

    // Force the canvas to receive pointer events
    canvas.style.pointerEvents = "auto";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    // Bind
    this.handleResize = this.handleResize.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    // Use capture: true so we get the event even if a custom cursor stops it
    canvas.addEventListener("pointerdown", this.onPointerDown, { capture: true });
    this.container.addEventListener("pointerdown", this.onPointerDown, { capture: true });

    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
    window.addEventListener("resize", this.handleResize);

    this.handleResize();
    this.tick();
  }

  private handleResize() {
    const { clientWidth, clientHeight } = this.container;
    if (!clientWidth || !clientHeight) return;

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(clientWidth, clientHeight, false);

    const shorter = Math.min(clientWidth, clientHeight);
    const targetCardPx = shorter * 0.58;
    this.scale = targetCardPx / BASE_CARD_HEIGHT;

    this.stage.scale.setScalar(this.scale);
    this.camera.position.z = BASE_CAMERA_Z * this.scale;

    this.camera.aspect = clientWidth / clientHeight;
    this.camera.fov = THREE.MathUtils.clamp(38 / this.scale, 28, 48);
    this.camera.updateProjectionMatrix();
  }

  private updatePointer(clientX: number, clientY: number) {
    const rect = this.container.getBoundingClientRect();
    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  private pickCard(): THREE.Mesh | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.cards, false);
    return (hits[0]?.object as THREE.Mesh) ?? null;
  }

  private isEventOnCanvas(event: PointerEvent): boolean {
    const rect = this.container.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  }

  // ───────── Pointer handlers ─────────

  private onPointerDown(event: PointerEvent) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (!this.isEventOnCanvas(event)) return;

    // Prevent the custom cursor / other handlers from eating the event
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    this.lastClientX = event.clientX;
    this.dragDistance = 0;

    // Pause auto-spin
    this.spinning = false;

    this.container.style.cursor = "grabbing";
    this.renderer.domElement.style.cursor = "grabbing";

    this.updatePointer(event.clientX, event.clientY);
  }

  private onPointerMove(event: PointerEvent) {
    this.updatePointer(event.clientX, event.clientY);

    if (this.isDragging) {
      const deltaX = event.clientX - this.lastClientX;
      this.lastClientX = event.clientX;
      this.dragDistance += Math.abs(deltaX);

      this.stage.rotation.y += deltaX * DRAG_SENSITIVITY;
      return;
    }

    // Hover
    const hit = this.pickCard();
    if (hit !== this.hovered) {
      this.hovered = hit;
      const cursor = hit ? "grab" : "default";
      this.container.style.cursor = cursor;
      this.renderer.domElement.style.cursor = cursor;
      this.opts.onHoverChange?.(hit ? (hit.userData.index as number) : null);
    }
  }

  private onPointerUp(event: PointerEvent) {
    if (!this.isDragging) return;

    const wasClick = this.dragDistance < CLICK_THRESHOLD;

    this.isDragging = false;

    // Resume auto-rotation (left direction)
    this.spinning = !this.opts.reduced;

    const hit = this.pickCard();
    const cursor = hit ? "grab" : "default";
    this.container.style.cursor = cursor;
    this.renderer.domElement.style.cursor = cursor;

    if (wasClick) {
      this.updatePointer(event.clientX, event.clientY);
      const clicked = this.pickCard();
      if (clicked) {
        this.opts.onSelect(
          clicked.userData.index as number,
          this.meshScreenRect(clicked)
        );
      }
    }
  }

  setSpinning(spinning: boolean) {
    if (this.isDragging) return;
    this.spinning = spinning;
  }

  /**
   * Screen-space bounding rect for a specific mesh instance. Used instead
   * of the old index-based lookup because, with repeated slots, several
   * meshes can share the same project index — we need the rect of the
   * exact card the user interacted with, not just any card with that index.
   */
  private meshScreenRect(mesh: THREE.Mesh): DOMRect {
    const halfW = BASE_CARD_WIDTH / 2;
    const halfH = BASE_CARD_HEIGHT / 2;
    const corners = [
      new THREE.Vector3(-halfW, -halfH, 0),
      new THREE.Vector3(halfW, -halfH, 0),
      new THREE.Vector3(halfW, halfH, 0),
      new THREE.Vector3(-halfW, halfH, 0),
    ];

    const rect = this.container.getBoundingClientRect();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const corner of corners) {
      const world = corner
        .clone()
        .applyMatrix4(mesh.matrixWorld)
        .project(this.camera);
      const x = (world.x * 0.5 + 0.5) * rect.width + rect.left;
      const y = (-world.y * 0.5 + 0.5) * rect.height + rect.top;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    return new DOMRect(minX, minY, maxX - minX, maxY - minY);
  }

  /**
   * Public lookup by project index, kept for callers that still want a
   * rect without an interaction event (e.g. programmatic focus/scroll-to).
   * NOTE: with repeated slots this returns the rect of the FIRST mesh
   * matching that project index, not necessarily the one the user clicked.
   * Prefer the rect passed into onSelect for click-driven UI.
   */
  getScreenRect(index: number): DOMRect | null {
    const mesh = this.cards.find((m) => (m.userData.index as number) === index);
    return mesh ? this.meshScreenRect(mesh) : null;
  }

  private tick() {
    if (this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    if (this.spinning) {
      this.stage.rotation.y -= dt * ROTATION_SPEED;
    }

    const bobAmount = this.scale < 0.7 ? 4 : 6;
    const hoverLift = this.scale < 0.7 ? 10 : 16;

    for (const mesh of this.cards) {
      const bob =
        Math.sin(t * 0.6 + (mesh.userData.bobOffset as number)) * bobAmount;
      const isHovered = mesh === this.hovered && !this.isDragging;
      const targetY = bob + (isHovered ? hoverLift : 0);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, 0.08);

      const targetScale = isHovered ? 1.03 : 1;
      mesh.scale.setScalar(
        THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.12)
      );
    }

    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(() => this.tick());
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);

    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);

    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown, { capture: true } as any);
    this.container.removeEventListener("pointerdown", this.onPointerDown, { capture: true } as any);

    for (const mesh of this.cards) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.map?.dispose();
      material.dispose();
    }
    this.cards[0]?.geometry.dispose();
    this.renderer.dispose();
  }
}