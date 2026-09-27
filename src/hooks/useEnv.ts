import { useCallback, useEffect, useState } from "react";
import { detectWebGL, getTier, isCoarse, prefersReduced } from "../lib/device";
import type { Env } from "../context";

export function useEnv() {
  const [reduced, setReduced] = useState(prefersReduced);
  const [tier, setTier] = useState(getTier);
  const [webgl, setWebgl] = useState(() => detectWebGL());
  const coarse = isCoarse();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTier(getTier()));
    };
    window.addEventListener("resize", onResize);
    return () => {
      mq.removeEventListener("change", on);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("reduced", reduced);
  }, [reduced]);

  const failWebgl = useCallback(() => setWebgl(false), []);
  const env: Env = { reduced, tier, coarse, webgl };
  return { env, failWebgl };
}
