import { useEffect, type RefObject } from "react";
import { startScroll, stopScroll } from "../lib/scroll";

const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,iframe,[tabindex]:not([tabindex="-1"])';

/** Scroll lock + focus trap + Escape + focus restore for full-screen layers. */
export function useModal(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    stopScroll();
    const el = ref.current;
    const items = () => (el ? Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null) : []);
    const t = window.setTimeout(() => (items()[0] ?? el)?.focus({ preventScroll: true }), 60);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "Tab") {
        const f = items();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", key, true);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", key, true);
      startScroll();
      prev?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
