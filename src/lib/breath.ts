export type BreathPhase = "inhale" | "hold" | "exhale";

export function phaseSeconds(phase: BreathPhase, inhale: number, hold: number): number {
  if (phase === "inhale") return inhale;
  if (phase === "hold") return hold;
  return 4;
}

export function nextStep(
  breath: number,
  phase: BreathPhase,
): { kind: "phase"; breath: number; phase: BreathPhase } | { kind: "cough" } {
  if (phase === "inhale") return { kind: "phase", breath, phase: "hold" };
  if (phase === "hold") return { kind: "phase", breath, phase: "exhale" };
  if (breath >= 10) return { kind: "cough" };
  return { kind: "phase", breath: breath + 1, phase: "inhale" };
}

export function pulse(): void {
  try {
    navigator.vibrate?.(15);
  } catch {
    /* vibrate is optional */
  }
}
