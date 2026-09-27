import { useApp } from "../context";
import { portfolio } from "../data/portfolio";
import styles from "./Footer.module.css";

export default function Footer() {
  const { goTo } = useApp();
  const [first, ...rest] = portfolio.name.split(" ");
  return (
    <footer className={styles.footer}>
      {/* <div className={styles.name} aria-hidden="true">
        <span>{first.toUpperCase()}</span>
        <span>{rest.join(" ").toUpperCase()}</span>
      </div> */}
      <div className={styles.row}>
        <span>© {new Date().getFullYear()} {portfolio.name}</span>
        <span>Built with React, Three.js and GSAP</span>
        <button type="button" data-magnetic data-cursor="TOP ↑" onClick={() => goTo("hero")}>Back to top ↑</button>
      </div>
    </footer>
  );
}
