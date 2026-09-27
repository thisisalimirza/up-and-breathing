export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(now = new Date()): string {
  return toISODate(now);
}

export function lastNDates(n: number, now = new Date()): string[] {
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(cursor);
    d.setDate(cursor.getDate() - i);
    days.push(toISODate(d));
  }
  return days;
}

export function breathingStreak(dates: string[], now = new Date()): number {
  const set = new Set(dates);
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  if (!set.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let n = 0;
  while (set.has(toISODate(cursor))) {
    n += 1;
    cursor.setDate(cursor.getDate() - 1);
    if (n > 3650) break;
  }
  return n;
}

export function formatWhen(timestamp: number, lang: "en" | "es"): string {
  return new Date(timestamp).toLocaleString(lang === "es" ? "es" : "en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function weekdayShort(dateISO: string, lang: "en" | "es"): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
  return date.toLocaleDateString(lang === "es" ? "es" : "en", { weekday: "short" });
}

export function dayNumber(dateISO: string): string {
  return String(Number(dateISO.slice(8, 10)));
}

export function clock(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
