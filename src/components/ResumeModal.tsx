import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { gsap } from "../lib/gsap";
import { sound } from "../lib/sound";
import { portfolio } from "../data/portfolio";
import { useModal } from "../hooks/useModal";
import { usePresence } from "../hooks/usePresence";
import styles from "./ResumeModal.module.css";

type Props = { open: boolean; reduced: boolean; onClose: () => void };
type Status = "checking" | "pdf" | "missing";

export default function ResumeModal({ open, reduced, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("checking");

  const mounted = usePresence(open, root, (el, dir) => {
    const panel = el.querySelector("[data-panel]");
    const d = reduced ? 0.01 : 1;
    if (dir === "in") {
      sound.play("open");
      return gsap.timeline()
        .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 * d })
        .fromTo(panel, { clipPath: "inset(10% 10% 10% 10% round 28px)", y: 60 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", y: 0, duration: 0.9 * d, ease: "expo.out" }, 0);
    }
    sound.play("close");
    return gsap.timeline()
      .to(panel, { clipPath: "inset(10% 10% 10% 10% round 28px)", y: 40, duration: 0.55 * d, ease: "expo.in" })
      .to(el, { autoAlpha: 0, duration: 0.3 * d }, 0.25 * d);
  });

  useModal(open && mounted, root, onClose);

  // A dev server (or SPA host) returns index.html for a missing file — verify it really is a PDF.
  useEffect(() => {
    if (!open) return;
    setStatus("checking");
    if (!portfolio.resume) { setStatus("missing"); return; }
    let alive = true;
    fetch(portfolio.resume, { method: "HEAD" })
      .then((r) => alive && setStatus(r.ok && (r.headers.get("content-type") ?? "").includes("pdf") ? "pdf" : "missing"))
      .catch(() => alive && setStatus("missing"));
    return () => { alive = false; };
  }, [open]);

  if (!mounted) return null;
  return (
    <div ref={root} className={styles.root} role="dialog" aria-modal="true" aria-labelledby="resume-title" style={{ visibility: "hidden" }}>
      <div data-panel className={styles.panel}>
        <div className={styles.head}>
          <h2 id="resume-title">{portfolio.name}, Resume</h2>
          <div className={styles.actions}>
            {status === "pdf" && (
              <a className={styles.download} href={portfolio.resume} download data-magnetic>
                <Download size={15} aria-hidden="true" /> Download
              </a>
            )}
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close resume" data-magnetic>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className={styles.body}>
          {status === "pdf" && (
            <iframe title="Resume PDF" src={`${portfolio.resume}#toolbar=0&navpanes=0&view=FitH`} className={styles.frame} />
          )}
          {status === "checking" && <p className={styles.note}>Loading resume…</p>}
          {status === "missing" && (
            <div className={styles.note}>
              <p>No resume found yet.</p>
              <p>Add your PDF at <code>public/resume.pdf</code> (or change <code>resume</code> in <code>src/data/portfolio.ts</code>) and it will open here.</p>
            </div>
          )}
        </div>
        {status === "pdf" && (
          <p className={styles.foot}>
            Viewer not showing on your device? <a href={portfolio.resume} download>Download the PDF</a>.
          </p>
        )}
      </div>
    </div>
  );
}
