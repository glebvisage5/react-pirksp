import { createContext, useContext, useState, ReactNode } from "react";

export type GtaViewMode = "owner" | "player";

const STORAGE_KEY = "gta_view_mode";

interface GtaViewModeContextType {
  viewMode: GtaViewMode;
  setViewMode: (mode: GtaViewMode) => void;
}

const GtaViewModeContext = createContext<GtaViewModeContextType | undefined>(undefined);

function readStoredMode(): GtaViewMode {
  return localStorage.getItem(STORAGE_KEY) === "player" ? "player" : "owner";
}

export function GtaViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<GtaViewMode>(readStoredMode);

  const setViewMode = (mode: GtaViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  return (
    <GtaViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </GtaViewModeContext.Provider>
  );
}

export function useGtaViewMode() {
  const context = useContext(GtaViewModeContext);
  if (context === undefined) {
    throw new Error("useGtaViewMode must be used within a GtaViewModeProvider");
  }
  return context;
}
