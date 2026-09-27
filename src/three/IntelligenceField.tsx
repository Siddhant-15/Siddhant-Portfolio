import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { bus } from "../lib/bus";
import { clamp } from "../lib/dom";
import { intelVertex, pointFragment } from "./morph.glsl";
import { hexToVec3 } from "./sampleText";
import { mulberry32 } from "./MorphField";

type Props = { data: Float32Array[] | null; count: number; quality: number };

export default function IntelligenceField({ data, count, quality }: Props) {
  const local = useRef({ mx: 0, my: 0, on: 0 });
  const ref = useRef<THREE.Points>(null);

  const built = useMemo(() => {
    if (!data || data.length < 4) return null;
    const rnd = mulberry32(4242);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < seeds.length; i++) seeds[i] = rnd();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    data.slice(0, 4).forEach((arr, i) => geo.setAttribute(`aW${i}`, new THREE.BufferAttribute(arr, 3)));
    const mat = new THREE.ShaderMaterial({
      vertexShader: intelVertex,
      fragmentShader: pointFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uWord: { value: 0 }, uForm: { value: 0 }, uDisp: { value: 0 }, uConv: { value: 0 },
        uPR: { value: 1 }, uSize: { value: 2.2 }, uOpacity: { value: 0 }, uWidth: { value: 16 }, uMouseOn: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uColor: { value: hexToVec3("#eeeae2") }, uAccent: { value: hexToVec3("#ff9f1c") }
      }
    });
    return { geo, mat };
  }, [data, count]);

  useEffect(() => () => { built?.geo.dispose(); built?.mat.dispose(); }, [built]);
  useEffect(() => { built?.geo.setDrawRange(0, Math.floor(count * clamp(quality, 0.3, 1))); }, [built, count, quality]);

  useFrame((state, dtRaw) => {
    if (!built || !ref.current) return;
    const { intel } = bus;
    const visible = intel.form > 0.001 && intel.conv < 0.999;
    ref.current.visible = visible;
    if (!visible) return;
    const dt = Math.min(dtRaw, 0.05);
    const L = local.current;
    const u = built.mat.uniforms;
    const cam = state.camera as THREE.PerspectiveCamera;
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
    const halfW = halfH * (state.size.width / state.size.height);
    const k = 1 - Math.exp(-dt * 8);
    L.mx += (bus.mouse.nx * halfW - L.mx) * k;
    L.my += (bus.mouse.ny * halfH - L.my) * k;
    L.on += ((bus.mouse.active ? 1 : 0) - L.on) * k;

    u.uTime.value = state.clock.elapsedTime;
    u.uWord.value = intel.word;
    u.uForm.value = intel.form;
    u.uDisp.value = intel.disp;
    u.uConv.value = intel.conv;
    u.uPR.value = state.gl.getPixelRatio();
    u.uMouse.value.set(L.mx, L.my);
    u.uMouseOn.value = L.on;
    const portrait = state.size.width / state.size.height < 0.9;
    u.uWidth.value = portrait ? halfW * 1.85 : Math.min(halfW * 1.75, 17);
    u.uSize.value = state.size.width < 700 ? 3.0 : 2.2;
    u.uOpacity.value = clamp((1 - intel.conv) / 0.12) * clamp(intel.form * 1.5);
  });

  if (!built) return null;
  return <points ref={ref} geometry={built.geo} material={built.mat} frustumCulled={false} visible={false} />;
}
