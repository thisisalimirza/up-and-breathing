import { useState } from "react";
import { useCopy, useStore } from "../state/store";

export function VolumeField() {
  const store = useStore();
  const copy = useCopy();
  const [text, setText] = useState(store.volumeGoalMl ? String(store.volumeGoalMl) : "");

  return (
    <label className="field">
      <span className="field-label">{copy.breathe.volumeLabel}</span>
      <span className="volume-row">
        <input
          inputMode="numeric"
          autoComplete="off"
          placeholder={copy.breathe.volumePlaceholder}
          value={text}
          onChange={(event) => {
            const next = event.target.value.replace(/[^\d]/g, "").slice(0, 4);
            setText(next);
            if (next === "") {
              store.setVolumeGoal(null);
              return;
            }
            const n = Number(next);
            if (n > 0 && n <= 8000) store.setVolumeGoal(n);
          }}
        />
        <span>{copy.breathe.volumeSuffix}</span>
      </span>
      <span className="field-hint">{copy.breathe.volumeHint}</span>
    </label>
  );
}
