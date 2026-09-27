import { fill } from "../lib/i18n";
import { useCopy, useStore } from "../state/store";

const INHALES = [3, 4, 5] as const;
const HOLDS = [2, 3] as const;

export function TimingControl() {
  const store = useStore();
  const copy = useCopy();
  return (
    <div className="timing">
      <div>
        <p className="field-label" id="inhale-label">
          {copy.breathe.inhale}
        </p>
        <div className="segment" role="group" aria-labelledby="inhale-label">
          {INHALES.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={store.inhaleSeconds === n}
              onClick={() => store.setTiming(n, store.holdSeconds)}
            >
              {fill(copy.breathe.seconds, { n })}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="field-label" id="hold-label">
          {copy.breathe.hold}
        </p>
        <div className="segment" role="group" aria-labelledby="hold-label">
          {HOLDS.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={store.holdSeconds === n}
              onClick={() => store.setTiming(store.inhaleSeconds, n)}
            >
              {fill(copy.breathe.seconds, { n })}
            </button>
          ))}
        </div>
      </div>
      <p className="field-hint">{copy.breathe.exhaleFixed}</p>
    </div>
  );
}
