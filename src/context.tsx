import { createContext, useContext } from "react";
import type { Tier } from "./lib/device";
import type { Project } from "./types";

export type Env = { reduced: boolean; tier: Tier; coarse: boolean; webgl: boolean };

export type AppApi = {
  env: Env;
  entered: boolean;
  openResume: () => void;
  openProject: (p: Project, rect: DOMRect | null) => void;
  copyEmail: () => Promise<boolean>;
  goTo: (id: string) => void;
  openPalette: () => void;
};

export const AppContext = createContext<AppApi | null>(null);

export function useApp() {
  const v = useContext(AppContext);
  if (!v) throw new Error("useApp must be used inside <AppContext.Provider>");
  return v;
}
