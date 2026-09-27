import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { bus } from "../lib/bus";
import { clamp } from "../lib/dom";
import { morphVertex, pointFragment } from "./morph.glsl";
import { hexToVec3 } from "./sampleText";

/** How present the field is in each formation (text-heavy sections dim it). */
const OPACITY = [1, 0.55, 0.9, 0.7, 0.95, 0.6, 0.5, 0.22, 0.34];
const fieldOpacity = (stage: number) => {
  const i = Math.min(7, Math.floor(stage));
  return OPACITY[i] + (OPACITY[i + 1] - OPACITY[i]) * clamp(stage - i);
};

export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Props = { count: number; quality: number; onFirstFrame?: () => void };

export default function MorphField({ count, quality, onFirstFrame }: Props) {
  const local = useRef({ stage: 0, mx: 0, my: 0, on: 0, menu: 0, vel: 0, rx: 0, ry: 0, first: false });

  const { geometry, material } = useMemo(() => {
    const rnd = mulberry32(1337);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < seeds.length; i++) seeds[i] = rnd();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    const mat = new THREE.ShaderMaterial({
      vertexShader: morphVertex,
      fragmentShader: pointFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uStage: { value: 0 }, uPR: { value: 1 }, uSize: { value: 2.4 },
        uVel: { value: 0 }, uPulse: { value: 0 }, uMenu: { value: 0 }, uBelt: { value: 0 },
        uContact: { value: 0 }, uProjZ: { value: 0 }, uHover: { value: -1 }, uOpacity: { value: 1 },
        uPortrait: { value: 0 }, uMouseOn: { value: 0 },
        uMouse: { value: new THREE.Vector2() }, uHalf: { value: new THREE.Vector2(10, 5.6) },
        uColor: { value: hexToVec3("#d9d5cc") }, uAccent: { value: hexToVec3("#ff9f1c") }
      }
    });
    return { geometry: geo, material: mat };
  }, [count]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useEffect(() => { geometry.setDrawRange(0, Math.floor(count * clamp(quality, 0.3, 1))); }, [geometry, count, quality]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const L = local.current;
    const u = material.uniforms;
    const cam = state.camera as THREE.PerspectiveCamera;
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
    const halfW = halfH * (state.size.width / state.size.height);
    const k = 1 - Math.exp(-dt * 7);

    L.stage += (bus.stage - L.stage) * (1 - Math.exp(-dt * 6));
    L.mx += (bus.mouse.nx * halfW - L.mx) * k;
    L.my += (bus.mouse.ny * halfH - L.my) * k;
    L.on += ((bus.mouse.active ? 1 : 0) - L.on) * k;
    L.menu += (bus.menu - L.menu) * k;
    L.vel += (clamp(bus.scroll.velocity / 60, -1, 1) - L.vel) * (1 - Math.exp(-dt * 8));

    u.uTime.value = state.clock.elapsedTime;
    u.uStage.value = L.stage;
    u.uPR.value = state.gl.getPixelRatio();
    u.uMouse.value.set(L.mx, L.my);
    u.uMouseOn.value = L.on;
    u.uHalf.value.set(halfW, halfH);
    u.uPortrait.value = state.size.width / state.size.height < 0.9 ? 1 : 0;
    u.uVel.value = L.vel;
    u.uPulse.value = bus.pulse;
    u.uMenu.value = L.menu;
    u.uBelt.value = bus.belt;
    u.uContact.value = bus.contact;
    u.uProjZ.value = bus.scroll.y * 0.012;
    u.uHover.value = bus.hoverNode;
    u.uOpacity.value = fieldOpacity(L.stage);
    u.uSize.value = state.size.width < 700 ? 3.0 : 2.4;

    if (ref.current) {
      L.ry += (bus.mouse.nx * 0.03 - L.ry) * k;
      L.rx += (-bus.mouse.ny * 0.02 - L.rx) * k;
      ref.current.rotation.set(L.rx, L.ry, 0);
    }
    if (!L.first) {
      L.first = true;
      onFirstFrame?.();
    }
  });

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />;
}
