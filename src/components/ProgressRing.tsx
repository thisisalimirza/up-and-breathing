export function ProgressRing({ value, label }: { value: number; label: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div className="ring-wrap">
      <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ring-track" cx="50" cy="50" r={r} />
        <circle
          className="ring-value"
          cx="50"
          cy="50"
          r={r}
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - clamped)}
        />
      </svg>
      <p className="ring-label">{label}</p>
    </div>
  );
}
