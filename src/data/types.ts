export type SurgeryId =
  | "upper_open"
  | "upper_lap"
  | "thoracic"
  | "cardiac"
  | "ortho_lower"
  | "csection_gyn"
  | "other";

export type DayId = "pacu" | "pod0" | "pod1" | "pod2";

export type Lang = "en" | "es";

export type JobId = "sit" | "walk" | "breathe" | "cough" | "mouth";

export type AltId = "ankle" | "march" | "edge" | "chair";

export type WalkKind = "short" | "medium" | "lap";

export type ArticleSlug =
  | "why"
  | "breathe"
  | "cough"
  | "spirometer"
  | "pain"
  | "eat"
  | "family"
  | "safety";

export type Plan = {
  sit: string;
  walk: string;
  breathe: string;
  cough: string;
  mouth: string;
  extras: string[];
  walkGoal: string;
};

export type Profile = {
  surgery: SurgeryId;
  day: DayId;
};

export type BreathSession = {
  dateISO: string;
  timestamp: number;
  breaths: number;
  coughed: boolean;
  surgery: SurgeryId;
  day: DayId;
};

export type WalkEntry = {
  dateISO: string;
  timestamp: number;
  kind: WalkKind;
  surgery: SurgeryId;
  day: DayId;
};

export const SURGERY_IDS: SurgeryId[] = [
  "upper_open",
  "upper_lap",
  "thoracic",
  "cardiac",
  "ortho_lower",
  "csection_gyn",
  "other",
];

export const DAY_IDS: DayId[] = ["pacu", "pod0", "pod1", "pod2"];

export const JOB_IDS: JobId[] = ["sit", "walk", "breathe", "cough", "mouth"];

export const ALT_IDS: AltId[] = ["ankle", "march", "edge", "chair"];

export const ARTICLE_SLUGS: ArticleSlug[] = [
  "why",
  "breathe",
  "cough",
  "spirometer",
  "pain",
  "eat",
  "family",
  "safety",
];
