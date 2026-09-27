import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { ChoiceGroup } from "../components/ChoiceGroup";
import { PageHeader } from "../components/PageHeader";
import { SURGERY_IDS, type SurgeryId } from "../data/types";
import { useCopy, useStore } from "../state/store";

export function OnboardingSurgery() {
  const copy = useCopy();
  const store = useStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<SurgeryId | null>(
    store.pendingSurgery ?? store.profile?.surgery ?? null,
  );

  return (
    <div className="stack">
      <PageHeader kicker={copy.surgery.step} title={copy.surgery.title} sub={copy.surgery.helper} />
      <ChoiceGroup
        name="surgery"
        legend={copy.surgery.title}
        value={selected}
        options={SURGERY_IDS.map((id) => ({
          id,
          label: copy.surgery.options[id].label,
          helper: copy.surgery.options[id].helper,
        }))}
        onChange={(id) => {
          const surgery = id as SurgeryId;
          setSelected(surgery);
          store.setPendingSurgery(surgery);
        }}
      />
      <Button
        disabled={!selected}
        onClick={() => {
          if (!selected) return;
          store.setPendingSurgery(selected);
          navigate("/setup/day");
        }}
      >
        {copy.continue}
      </Button>
    </div>
  );
}
