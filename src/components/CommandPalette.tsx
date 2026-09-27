import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context";
import { useModal } from "../hooks/useModal";
import { portfolio } from "../data/portfolio";
import { sound } from "../lib/sound";
import styles from "./CommandPalette.module.css";

type Item = { id: string; label: string; hint: string; run: () => void };

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { goTo, openResume, copyEmail, env } = useApp();
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useModal(open, root, onClose);

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => { onClose(); window.setTimeout(() => goTo(id), 250); };
    const list: Item[] = [
      { id: "about", label: "About", hint: "Go to", run: go("about") },
      { id: "philosophy", label: "How I think", hint: "Go to", run: go("philosophy") },
      { id: "experience", label: "Experience", hint: "Go to", run: go("experience") },
      { id: "skills", label: "Skills", hint: "Go to", run: go("skills") },
      { id: "projects", label: "Selected work", hint: "Go to", run: go("projects") },
      { id: "intelligence", label: "How it comes together", hint: "Go to", run: go("intelligence") },
      { id: "contact", label: "Contact", hint: "Go to", run: go("contact") },
      { id: "resume", label: "Open resume", hint: "Action", run: () => { onClose(); openResume(); } }
    ];
    if (portfolio.email) list.push({ id: "email", label: "Copy email address", hint: "Action", run: () => { void copyEmail(); onClose(); } });
    if (!env.coarse) list.push({ id: "sound", label: sound.enabled ? "Turn sound off" : "Turn sound on", hint: "Action", run: () => { sound.setEnabled(!sound.enabled); onClose(); } });
    if (portfolio.github) list.push({ id: "gh", label: "GitHub", hint: "Open", run: () => { window.open(portfolio.github, "_blank", "noreferrer"); onClose(); } });
    if (portfolio.linkedin) list.push({ id: "li", label: "LinkedIn", hint: "Open", run: () => { window.open(portfolio.linkedin, "_blank", "noreferrer"); onClose(); } });
    return list;
  }, [goTo, openResume, copyEmail, onClose, env.coarse]);

  const shown = items.filter((x) => x.label.toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => { if (open) { setQ(""); setI(0); window.setTimeout(() => input.current?.focus(), 30); } }, [open]);
  useEffect(() => setI(0), [q]);

  if (!open) return null;
  return (
    <div ref={root} className={styles.root} role="dialog" aria-modal="true" aria-label="Quick navigation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.box}>
        <input
          ref={input}
          className={styles.input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Jump to a section or run an action"
          aria-label="Search commands"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setI((v) => Math.min(shown.length - 1, v + 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setI((v) => Math.max(0, v - 1)); }
            else if (e.key === "Enter") { e.preventDefault(); shown[i]?.run(); }
          }}
        />
        <ul className={styles.list} role="listbox">
          {shown.map((x, n) => (
            <li key={x.id} role="option" aria-selected={n === i}>
              <button type="button" className={styles.item} data-on={n === i} onMouseEnter={() => setI(n)} onClick={x.run}>
                <span>{x.label}</span><small>{x.hint}</small>
              </button>
            </li>
          ))}
          {!shown.length && <li className={styles.empty}>Nothing matches “{q}”.</li>}
        </ul>
        <p className={styles.foot}>↑ ↓ to move · Enter to run · Esc to close</p>
      </div>
    </div>
  );
}
