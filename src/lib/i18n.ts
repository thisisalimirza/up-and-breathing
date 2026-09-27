import { en } from "../data/copy";
import { es } from "../data/copy.es";
import type { Lang } from "../data/types";

export type Copy = typeof en;

export function getCopy(lang: Lang): Copy {
  return lang === "es" ? es : en;
}

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] === undefined ? "" : String(vars[key]),
  );
}
