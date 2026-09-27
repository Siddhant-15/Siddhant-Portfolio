import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Phone } from "lucide-react";
import { gsap } from "../lib/gsap";
import { bus } from "../lib/bus";
import { useApp } from "../context";
import { useRunway } from "../hooks/useRunway";
import { LEN } from "../lib/layout";
import { portfolio } from "../data/portfolio";
import styles from "./Contact.module.css";

/** Final section — the converged particle point blooms into the contact statement. */
export default function Contact() {
  const { env, copyEmail } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useRunway(ref, LEN.contact, env.reduced, (tl, { el }) => {
    tl.to(bus, { contact: 1, duration: 55, ease: "power2.out" }, 0)
      .fromTo(el.querySelector("[data-glow]"), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 50, ease: "power2.out" }, 5)
      .fromTo(el.querySelectorAll("[data-in]"), { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 44, stagger: 11, ease: "power3.out" }, 40);
  });

  const links = [
    portfolio.github && { label: "GitHub", href: portfolio.github },
    portfolio.linkedin && { label: "LinkedIn", href: portfolio.linkedin },
    portfolio.leetcode && { label: "LeetCode", href: portfolio.leetcode }
  ].filter(Boolean) as { label: string; href: string }[];

  const onCopy = async () => {
    const ok = await copyEmail();
    if (ok) { setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
  };

  return (
    <div ref={ref} className={styles.wrap}>
      <span data-glow className={styles.glow} aria-hidden="true" />
      <p data-in className={styles.kicker}>Have something worth building?</p>
      <h2 data-in className={styles.headline}>
        Let's build the next<br />real-time system.
      </h2>
      <div data-in className={styles.actions}>
        {portfolio.email ? (
          <button type="button" className={styles.email} onClick={onCopy} data-magnetic data-cursor="COPY">
            {portfolio.email}
            {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            <span className="sr-only">{copied ? "Copied" : "Copy email address"}</span>
          </button>
        ) : (
          <p className={styles.note}>Add an email in <code>src/data/portfolio.ts</code> to enable this.</p>
        )}
        {portfolio.phone && (
          <a className={styles.phone} href={`tel:${portfolio.phone.replace(/\s+/g, "")}`} data-magnetic data-cursor="CALL">
            <Phone size={15} aria-hidden="true" /> {portfolio.phone}
          </a>
        )}
      </div>
      {(links.length > 0 || portfolio.location) && (
        <div data-in className={styles.foot}>
          {links.length > 0 && (
            <ul className={styles.links}>
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" data-magnetic data-cursor="OPEN">
                    {l.label} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          {portfolio.location && <span className={styles.loc}>{portfolio.location}</span>}
        </div>
      )}
    </div>
  );
}
