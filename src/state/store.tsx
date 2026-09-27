import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AltId,
  BreathSession,
  DayId,
  JobId,
  Lang,
  SurgeryId,
  WalkKind,
} from "../data/types";
import { getCopy, type Copy } from "../lib/i18n";
import {
  defaultPersisted,
  loadState,
  saveState,
  STORAGE_KEY,
  type Persisted,
} from "../lib/storage";
import { todayISO } from "../lib/time";

type StoreValue = Persisted & {
  setLanguage: (language: Lang) => void;
  setLargeText: (largeText: boolean) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setTiming: (inhaleSeconds: 3 | 4 | 5, holdSeconds: 2 | 3) => void;
  setVolumeGoal: (volumeGoalMl: number | null) => void;
  setPendingSurgery: (surgery: SurgeryId) => void;
  setProfile: (surgery: SurgeryId, day: DayId) => void;
  setSurgery: (surgery: SurgeryId) => void;
  setDay: (day: DayId) => void;
  toggleJob: (job: JobId, date?: string) => void;
  toggleAlt: (alt: AltId, date?: string) => void;
  setPain: (value: number, date?: string) => void;
  clearPain: (date?: string) => void;
  logSession: (entry: { coughed: boolean; surgery: SurgeryId; day: DayId }) => void;
  logWalk: (entry: { kind: WalkKind; surgery: SurgeryId; day: DayId }) => void;
  reset: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.lang = state.language === "es" ? "es" : "en";
    document.documentElement.dataset.size = state.largeText ? "lg" : "md";
    document.documentElement.dataset.motion = state.reducedMotion ? "reduce" : "ok";
  }, [state.language, state.largeText, state.reducedMotion]);

  const api = useMemo<StoreValue>(
    () => ({
      ...state,
      setLanguage: (language) => setState((s) => ({ ...s, language })),
      setLargeText: (largeText) => setState((s) => ({ ...s, largeText })),
      setReducedMotion: (reducedMotion) => setState((s) => ({ ...s, reducedMotion })),
      setTiming: (inhaleSeconds, holdSeconds) =>
        setState((s) => ({ ...s, inhaleSeconds, holdSeconds })),
      setVolumeGoal: (volumeGoalMl) => setState((s) => ({ ...s, volumeGoalMl })),
      setPendingSurgery: (pendingSurgery) => setState((s) => ({ ...s, pendingSurgery })),
      setProfile: (surgery, day) =>
        setState((s) => ({ ...s, profile: { surgery, day }, pendingSurgery: null })),
      setSurgery: (surgery) =>
        setState((s) => ({
          ...s,
          profile: s.profile ? { ...s.profile, surgery } : s.profile,
          pendingSurgery: s.profile ? null : surgery,
        })),
      setDay: (day) =>
        setState((s) => {
          const surgery = s.profile?.surgery ?? s.pendingSurgery;
          if (!surgery) return s;
          return { ...s, profile: { surgery, day }, pendingSurgery: null };
        }),
      toggleJob: (job, date = todayISO()) =>
        setState((s) => {
          const row = { ...(s.checklist[date] ?? {}) };
          row[job] = !row[job];
          return { ...s, checklist: { ...s.checklist, [date]: row } };
        }),
      toggleAlt: (alt, date = todayISO()) =>
        setState((s) => {
          const row = { ...(s.alternates[date] ?? {}) };
          row[alt] = !row[alt];
          return { ...s, alternates: { ...s.alternates, [date]: row } };
        }),
      setPain: (value, date = todayISO()) =>
        setState((s) => ({
          ...s,
          painByDate: { ...s.painByDate, [date]: value },
        })),
      clearPain: (date = todayISO()) =>
        setState((s) => {
          const painByDate = { ...s.painByDate };
          delete painByDate[date];
          return { ...s, painByDate };
        }),
      logSession: ({ coughed, surgery, day }) =>
        setState((s) => {
          const session: BreathSession = {
            dateISO: todayISO(),
            timestamp: Date.now(),
            breaths: 10,
            coughed,
            surgery,
            day,
          };
          return { ...s, sessions: [...s.sessions, session] };
        }),
      logWalk: ({ kind, surgery, day }) =>
        setState((s) => ({
          ...s,
          walks: [
            ...s.walks,
            { dateISO: todayISO(), timestamp: Date.now(), kind, surgery, day },
          ],
        })),
      reset: () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(defaultPersisted());
      },
    }),
    [state],
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("Store missing");
  return value;
}

export function useCopy(): Copy {
  const { language } = useStore();
  return getCopy(language);
}
