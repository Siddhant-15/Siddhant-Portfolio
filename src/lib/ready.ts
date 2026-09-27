/** Real readiness tracking for the loader — no fake timers. */
const tasks = new Map<string, boolean>();

export const ready = {
  add(name: string) {
    if (!tasks.has(name)) tasks.set(name, false);
  },
  done(name: string) {
    tasks.set(name, true);
  },
  progress() {
    if (!tasks.size) return 0;
    let d = 0;
    tasks.forEach((v) => v && d++);
    return d / tasks.size;
  }
};
