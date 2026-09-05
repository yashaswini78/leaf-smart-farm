import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { initialScans, type ScanRecord } from "./agri-data";

type AgriState = {
  online: boolean;
  toggleOnline: () => void;
  mode: "offline" | "cloud";
  setMode: (m: "offline" | "cloud") => void;
  scans: ScanRecord[];
  addScan: (s: ScanRecord) => void;
  pending: number;
  syncAll: () => void;
  syncing: boolean;
};

const AgriContext = createContext<AgriState | null>(null);

export function AgriProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(false);
  const [mode, setMode] = useState<"offline" | "cloud">("offline");
  const [scans, setScans] = useState<ScanRecord[]>(initialScans);
  const [syncing, setSyncing] = useState(false);

  const addScan = useCallback((s: ScanRecord) => setScans((prev) => [s, ...prev]), []);

  const toggleOnline = useCallback(() => {
    setOnline((prev) => {
      const next = !prev;
      if (!next) setMode("offline");
      return next;
    });
  }, []);

  const syncAll = useCallback(() => {
    setSyncing(true);
    window.setTimeout(() => {
      setScans((prev) => prev.map((s) => ({ ...s, synced: true })));
      setSyncing(false);
    }, 1600);
  }, []);

  const pending = scans.filter((s) => !s.synced).length;

  const value = useMemo(
    () => ({ online, toggleOnline, mode, setMode, scans, addScan, pending, syncAll, syncing }),
    [online, toggleOnline, mode, scans, addScan, pending, syncAll, syncing],
  );

  return <AgriContext.Provider value={value}>{children}</AgriContext.Provider>;
}

export function useAgri() {
  const ctx = useContext(AgriContext);
  if (!ctx) throw new Error("useAgri must be used inside AgriProvider");
  return ctx;
}
