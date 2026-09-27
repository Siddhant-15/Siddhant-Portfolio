import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { useApp } from "../context";
import { useRunway } from "../hooks/useRunway";
import { LEN } from "../lib/layout";
import { techIcons } from "../data/techIcons";
import styles from "./TechOrbit.module.css";

const MAX_SPEED = 22;

interface BobParams {
  phaseX: number;
  phaseY: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
}

export default function TechOrbit() {
  const { env } = useApp();

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  useRunway(
    sectionRef,
    LEN.tech,
    env.reduced,
    (tl, { el }) => {
      const wrap = el.querySelector("[data-wrap]");
      const cap = el.querySelector("[data-cap]");

      tl.fromTo(
        wrap,
        {
          scaleY: 0.02,
          scaleX: 1.5,
          autoAlpha: 0,
        },
        {
          scaleY: 1,
          scaleX: 1,
          autoAlpha: 1,
          duration: 90,
          ease: "expo.out",
        },
        10
      )
        .fromTo(
          cap,
          {
            autoAlpha: 0,
            y: 20,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 30,
          },
          70
        )
        .to(
          cap,
          {
            autoAlpha: 0,
            duration: 30,
          },
          110
        )
        .to(
          wrap,
          {
            scale: 2.6,
            autoAlpha: 0,
            duration: 100,
            ease: "power3.in",
          },
          120
        );
    }
  );

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || env.reduced) return;

    const {
      Engine,
      World,
      Bodies,
      Body,
      Events,
      Runner,
      Vector,
    } = Matter;

    const tileSize =
      parseFloat(
        getComputedStyle(stage).getPropertyValue("--tile")
      ) || 108;

    const halfTile = tileSize / 2;

    const engine = Engine.create();

    engine.gravity.x = 0;
    engine.gravity.y = 0;

    const world = engine.world;

    let width = stage.clientWidth;
    let height = stage.clientHeight;

    /*
     * ------------------------------------------------------------
     * BOUNDS
     * ------------------------------------------------------------
     */

    const clampX = (x: number) =>
      Math.min(
        width - halfTile,
        Math.max(halfTile, x)
      );

    const clampY = (y: number) =>
      Math.min(
        height - halfTile,
        Math.max(halfTile, y)
      );

    /*
     * ------------------------------------------------------------
     * WALLS
     * ------------------------------------------------------------
     */

    const wallThickness = 80;

    let walls: Matter.Body[] = [];

    const buildWalls = () => {
      if (walls.length) {
        World.remove(world, walls);
      }

      walls = [
        Bodies.rectangle(
          width / 2,
          -wallThickness / 2,
          width + wallThickness * 2,
          wallThickness,
          {
            isStatic: true,
          }
        ),

        Bodies.rectangle(
          width / 2,
          height + wallThickness / 2,
          width + wallThickness * 2,
          wallThickness,
          {
            isStatic: true,
          }
        ),

        Bodies.rectangle(
          -wallThickness / 2,
          height / 2,
          wallThickness,
          height + wallThickness * 2,
          {
            isStatic: true,
          }
        ),

        Bodies.rectangle(
          width + wallThickness / 2,
          height / 2,
          wallThickness,
          height + wallThickness * 2,
          {
            isStatic: true,
          }
        ),
      ];

      World.add(world, walls);
    };

    buildWalls();

    /*
     * ------------------------------------------------------------
     * SPAWN TILES
     * ------------------------------------------------------------
     */

    const n = techIcons.length;

    const cols = Math.max(
      1,
      Math.round(Math.sqrt((n * width) / height))
    );

    const rows = Math.ceil(n / cols);

    const cellW = width / cols;
    const cellH = height / rows;

    const jitterRangeX = Math.max(
      0,
      cellW - tileSize - 12
    );

    const jitterRangeY = Math.max(
      0,
      cellH - tileSize - 12
    );

    const bodies = techIcons.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const cx = clampX(
        cellW * (col + 0.5) +
          (Math.random() - 0.5) * jitterRangeX
      );

      const cy = clampY(
        cellH * (row + 0.5) +
          (Math.random() - 0.5) * jitterRangeY
      );

      const body = Bodies.rectangle(
        cx,
        cy,
        tileSize,
        tileSize,
        {
          chamfer: {
            radius: 18,
          },

          restitution: 0.55,
          frictionAir: 0.06,
          friction: 0.15,
          density: 0.002,
        }
      );

      Body.setAngularVelocity(
        body,
        (Math.random() - 0.5) * 0.02
      );

      return body;
    });

    World.add(world, bodies);

    /*
     * ------------------------------------------------------------
     * AMBIENT FLOATING
     * ------------------------------------------------------------
     */

    const bob: BobParams[] = bodies.map(() => ({
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,

      freqX:
        0.35 + Math.random() * 0.35,

      freqY:
        0.35 + Math.random() * 0.35,

      ampX:
        6 + Math.random() * 7,

      ampY:
        6 + Math.random() * 7,
    }));

    /*
     * ------------------------------------------------------------
     * VELOCITY CLAMP
     * ------------------------------------------------------------
     */

    const clampVelocity = () => {
      for (const body of bodies) {
        const speed = Vector.magnitude(
          body.velocity
        );

        if (speed > MAX_SPEED) {
          const scale = MAX_SPEED / speed;

          Body.setVelocity(body, {
            x: body.velocity.x * scale,
            y: body.velocity.y * scale,
          });
        }
      }
    };

    Events.on(
      engine,
      "afterUpdate",
      clampVelocity
    );

    /*
     * ------------------------------------------------------------
     * POSITION CLAMP
     * ------------------------------------------------------------
     */

    const clampPositions = () => {
      for (const body of bodies) {
        const x = clampX(body.position.x);
        const y = clampY(body.position.y);

        if (
          x !== body.position.x ||
          y !== body.position.y
        ) {
          Body.setPosition(body, {
            x,
            y,
          });
        }
      }
    };

    Events.on(
      engine,
      "afterUpdate",
      clampPositions
    );

    /*
     * ------------------------------------------------------------
     * RUN PHYSICS
     * ------------------------------------------------------------
     */

    const runner = Runner.create();

    Runner.run(
      runner,
      engine
    );

    /*
     * ------------------------------------------------------------
     * DRAG STATE
     * ------------------------------------------------------------
     */

    let draggingIndex: number | null = null;

    let activePointerId: number | null = null;

    let activeBody: Matter.Body | null = null;

    let activeElement: HTMLDivElement | null = null;

    /*
     * Offset between cursor and tile center.
     *
     * This prevents the tile from jumping when grabbed from
     * somewhere other than its exact center.
     */

    let grabOffsetX = 0;
    let grabOffsetY = 0;

    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    let velX = 0;
    let velY = 0;

    /*
     * ------------------------------------------------------------
     * POINTER MOVE
     *
     * Attached to WINDOW instead of the tile.
     *
     * This is important because your portfolio has custom
     * scrolling / runway behavior. Once dragging begins,
     * the pointer should remain under our control regardless
     * of where it moves.
     * ------------------------------------------------------------
     */

    const onPointerMove = (e: PointerEvent) => {
      if (
        draggingIndex === null ||
        !activeBody ||
        activePointerId !== e.pointerId
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const rect =
        stage.getBoundingClientRect();

      const rawX =
        e.clientX -
        rect.left -
        grabOffsetX;

      const rawY =
        e.clientY -
        rect.top -
        grabOffsetY;

      const targetX = clampX(rawX);
      const targetY = clampY(rawY);

      Body.setPosition(
        activeBody,
        {
          x: targetX,
          y: targetY,
        }
      );

      /*
       * Calculate throw velocity.
       */

      const now = performance.now();

      const dt = Math.max(
        1,
        now - lastT
      );

      velX =
        ((e.clientX - lastX) / dt) * 16;

      velY =
        ((e.clientY - lastY) / dt) * 16;

      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };

    /*
     * ------------------------------------------------------------
     * POINTER UP
     * ------------------------------------------------------------
     */

    const onPointerUp = (e: PointerEvent) => {
      if (
        draggingIndex === null ||
        !activeBody ||
        activePointerId !== e.pointerId
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      Body.setStatic(
        activeBody,
        false
      );

      Body.setVelocity(
        activeBody,
        {
          x: velX,
          y: velY,
        }
      );

      if (activeElement) {
        activeElement.style.zIndex = "1";
      }

      draggingIndex = null;
      activePointerId = null;
      activeBody = null;
      activeElement = null;

      grabOffsetX = 0;
      grabOffsetY = 0;

      velX = 0;
      velY = 0;
    };

    /*
     * ------------------------------------------------------------
     * POINTER DOWN
     * ------------------------------------------------------------
     */

    const cleanups: Array<() => void> = [];

    bodies.forEach((body, i) => {
      const el = tileRefs.current[i];

      if (!el) return;

      const onPointerDown = (
        e: PointerEvent
      ) => {
        e.preventDefault();
        e.stopPropagation();

        /*
         * Ignore another pointer while a tile is already being
         * dragged.
         */

        if (draggingIndex !== null) {
          return;
        }

        const rect =
          stage.getBoundingClientRect();

        /*
         * Store where inside the tile the user grabbed it.
         */

        grabOffsetX =
          e.clientX -
          rect.left -
          body.position.x;

        grabOffsetY =
          e.clientY -
          rect.top -
          body.position.y;

        draggingIndex = i;

        activePointerId =
          e.pointerId;

        activeBody = body;

        activeElement = el;

        lastX = e.clientX;
        lastY = e.clientY;
        lastT = performance.now();

        velX = 0;
        velY = 0;

        /*
         * Stop physics while held.
         */

        Body.setStatic(
          body,
          true
        );

        /*
         * Bring tile above everything else.
         */

        el.style.zIndex = "5";
      };

      /*
       * Capture the initial pointerdown directly on the tile.
       *
       * We intentionally DON'T use setPointerCapture here.
       * Window-level move/up listeners handle the rest.
       */

      el.addEventListener(
        "pointerdown",
        onPointerDown,
        {
          capture: true,
        }
      );

      cleanups.push(() => {
        el.removeEventListener(
          "pointerdown",
          onPointerDown,
          {
            capture: true,
          } as EventListenerOptions
        );
      });
    });

    /*
     * Global drag listeners.
     */

    window.addEventListener(
      "pointermove",
      onPointerMove,
      {
        capture: true,
      }
    );

    window.addEventListener(
      "pointerup",
      onPointerUp,
      {
        capture: true,
      }
    );

    window.addEventListener(
      "pointercancel",
      onPointerUp,
      {
        capture: true,
      }
    );

    /*
     * ------------------------------------------------------------
     * RENDER LOOP
     * ------------------------------------------------------------
     */

    let rafId: number;

    const render = () => {
      const t =
        performance.now() / 1000;

      bodies.forEach(
        (body, i) => {
          const el =
            tileRefs.current[i];

          if (!el) return;

          const isDragging =
            draggingIndex === i;

          const b = bob[i];

          const bobX = isDragging
            ? 0
            : Math.sin(
                t * b.freqX +
                  b.phaseX
              ) * b.ampX;

          const bobY = isDragging
            ? 0
            : Math.cos(
                t * b.freqY +
                  b.phaseY
              ) * b.ampY;

          const visualX = clampX(
            body.position.x + bobX
          );

          const visualY = clampY(
            body.position.y + bobY
          );

          el.style.transform =
            `translate3d(` +
            `${visualX - halfTile}px, ` +
            `${visualY - halfTile}px, ` +
            `0) rotate(${body.angle}rad)`;
        }
      );

      rafId =
        requestAnimationFrame(render);
    };

    rafId =
      requestAnimationFrame(render);

    /*
     * ------------------------------------------------------------
     * RESIZE
     * ------------------------------------------------------------
     */

    const onResize = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;

      buildWalls();

      /*
       * Keep every body inside the new dimensions.
       */

      for (const body of bodies) {
        Body.setPosition(body, {
          x: clampX(body.position.x),
          y: clampY(body.position.y),
        });
      }
    };

    window.addEventListener(
      "resize",
      onResize
    );

    /*
     * ------------------------------------------------------------
     * CLEANUP
     * ------------------------------------------------------------
     */

    return () => {
      cancelAnimationFrame(rafId);

      Runner.stop(runner);

      Events.off(
        engine,
        "afterUpdate",
        clampVelocity
      );

      Events.off(
        engine,
        "afterUpdate",
        clampPositions
      );

      window.removeEventListener(
        "pointermove",
        onPointerMove,
        {
          capture: true,
        } as EventListenerOptions
      );

      window.removeEventListener(
        "pointerup",
        onPointerUp,
        {
          capture: true,
        } as EventListenerOptions
      );

      window.removeEventListener(
        "pointercancel",
        onPointerUp,
        {
          capture: true,
        } as EventListenerOptions
      );

      window.removeEventListener(
        "resize",
        onResize
      );

      cleanups.forEach(
        (cleanup) => cleanup()
      );

      World.clear(
        world,
        false
      );

      Engine.clear(engine);
    };
  }, [env.reduced]);

  return (
    <div
      ref={sectionRef}
      className={styles.tech}
    >
      <div
        data-wrap
        className={styles.wrap}
      >
        <div
          ref={stageRef}
          className={styles.stage}
          data-reduced={
            env.reduced || undefined
          }
        >
          {techIcons.map(
            (
              {
                name,
                Icon,
                color,
              },
              i
            ) => (
              <div
                key={name}
                ref={(node) => {
                  tileRefs.current[i] =
                    node;
                }}
                className={styles.tile}
              >
                <Icon
                  className={styles.icon}
                  style={{
                    color,
                  }}
                  aria-hidden
                />

                <span
                  className={
                    styles.label
                  }
                >
                  {name}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      <p
        data-cap
        className={styles.cap}
      >
        Drag a tile. Throw it. Watch it
        float.
      </p>
    </div>
  );
}