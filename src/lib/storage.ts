import {
  DAY_IDS,
  SURGERY_IDS,
  type AltId,
  type BreathSession,
  type DayId,
  type JobId,
  type Lang,
  type Profile,
  type SurgeryId,
  type WalkEntry,
  type WalkKind,
} from "../data/types";

export const STORAGE_KEY = "up-and-breathing-v1";

export type Checklist = Record<string, Partial<Record<JobId, boolean>>>;
export type Alternates = Record<string, Partial<Record<AltId, boolean>>>;

export type Persisted = {
  profile: Profile | null;
  pendingSurgery: SurgeryId | null;
  language: Lang;
  largeText: boolean;
  reducedMotion: boolean;
  inhaleSeconds: 3 | 4 | 5;
  holdSeconds: 2 | 3;
  volumeGoalMl: number | null;
  checklist: Checklist;
  alternates: Alternates;
  sessions: BreathSession[];
  walks: WalkEntry[];
  painByDate: Record<string, number>;
};

export function defaultPersisted(): Persisted {
  return {
    profile: null,
    pendingSurgery: null,
    language: "en",
    largeText: false,
    reducedMotion: false,
    inhaleSeconds: 4,
    holdSeconds: 2,
    volumeGoalMl: null,
    checklist: {},
    alternates: {},
    sessions: [],
    walks: [],
    painByDate: {},
  };
}

function isSurgery(value: unknown): value is SurgeryId {
  return typeof value === "string" && SURGERY_IDS.includes(value as SurgeryId);
}

function isDay(value: unknown): value is DayId {
  return typeof value === "string" && DAY_IDS.includes(value as DayId);
}

function isWalkKind(value: unknown): value is WalkKind {
  return value === "short" || value === "medium" || value === "lap";
}

export function loadState(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPersisted();
    return sanitize(JSON.parse(raw));
  } catch {
    return defaultPersisted();
  }
}

export function saveState(state: Persisted): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sanitize(value: unknown): Persisted {
  const base = defaultPersisted();
  if (!value || typeof value !== "object") return base;
  const raw = value as Partial<Persisted>;

  let profile: Profile | null = null;
  if (raw.profile && typeof raw.profile === "object") {
    const surgery = raw.profile.surgery;
    const day = raw.profile.day;
    if (isSurgery(surgery) && isDay(day)) profile = { surgery, day };
  }

  const inhale = raw.inhaleSeconds;
  const hold = raw.holdSeconds;
  const volume = raw.volumeGoalMl;

  return {
    profile,
    pendingSurgery: isSurgery(raw.pendingSurgery) ? raw.pendingSurgery : null,
    language: raw.language === "es" ? "es" : "en",
    largeText: raw.largeText === true,
    reducedMotion: raw.reducedMotion === true,
    inhaleSeconds: inhale === 3 || inhale === 4 || inhale === 5 ? inhale : 4,
    holdSeconds: hold === 2 || hold === 3 ? hold : 2,
    volumeGoalMl:
      typeof volume === "number" && Number.isFinite(volume) && volume > 0 && volume <= 8000
        ? Math.round(volume)
        : null,
    checklist: cleanBoolMap(raw.checklist),
    alternates: cleanBoolMap(raw.alternates),
    sessions: cleanSessions(raw.sessions),
    walks: cleanWalks(raw.walks),
    painByDate: cleanPain(raw.painByDate),
  };
}

function cleanBoolMap<T extends string>(value: unknown): Record<string, Partial<Record<T, boolean>>> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, Partial<Record<T, boolean>>> = {};
  for (const [date, row] of Object.entries(value as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !row || typeof row !== "object") continue;
    const next: Partial<Record<T, boolean>> = {};
    for (const [key, checked] of Object.entries(row)) {
      if (checked === true) next[key as T] = true;
    }
    out[date] = next;
  }
  return out;
}

function cleanSessions(value: unknown): BreathSession[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<BreathSession>;
    if (!isSurgery(row.surgery) || !isDay(row.day)) return [];
    if (typeof row.dateISO !== "string" || typeof row.timestamp !== "number") return [];
    if (row.breaths !== 10) return [];
    return [
      {
        dateISO: row.dateISO,
        timestamp: row.timestamp,
        breaths: 10,
        coughed: row.coughed === true,
        surgery: row.surgery,
        day: row.day,
      },
    ];
  });
}

function cleanWalks(value: unknown): WalkEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<WalkEntry>;
    if (!isSurgery(row.surgery) || !isDay(row.day) || !isWalkKind(row.kind)) return [];
    if (typeof row.dateISO !== "string" || typeof row.timestamp !== "number") return [];
    return [
      {
        dateISO: row.dateISO,
        timestamp: row.timestamp,
        kind: row.kind,
        surgery: row.surgery,
        day: row.day,
      },
    ];
  });
}

function cleanPain(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};
  for (const [date, n] of Object.entries(value as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (typeof n !== "number" || n < 0 || n > 10) continue;
    out[date] = Math.round(n);
  }
  return out;
}
