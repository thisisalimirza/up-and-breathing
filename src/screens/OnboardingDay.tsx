import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { ChoiceGroup } from "../components/ChoiceGroup";
import { PageHeader } from "../components/PageHeader";
import { DAY_IDS, type DayId } from "../data/types";
import { useCopy, useStore } from "../state/store";

export function OnboardingDay() {
  const copy = useCopy();
  const store = useStore();
  const navigate = useNavigate();
  const surgery = store.pendingSurgery ?? store.profile?.surgery ?? null;
  const [selected, setSelected] = useState<DayId | null>(store.profile?.day ?? null);

  if (!surgery) return <Navigate to="/setup/surgery" replace />;

  return (
    <div className="stack">
      <PageHeader kicker={copy.day.step} title={copy.day.title} sub={copy.day.helper} />
      <p className="plan-kicker">{copy.surgery.short[surgery]}</p>
      <ChoiceGroup
        name="day"
        legend={copy.day.title}
        value={selected}
        options={DAY_IDS.map((id) => ({ id, label: copy.day.options[id] }))}
        onChange={(id) => setSelected(id as DayId)}
      />
      <Button to="/setup/surgery" variant="ghost">
        {copy.back}
      </Button>
      <Button
        disabled={!selected}
        onClick={() => {
          if (!selected) return;
          store.setProfile(surgery, selected);
          navigate("/home");
        }}
      >
        {copy.continue}
      </Button>
    </div>
  );
}
