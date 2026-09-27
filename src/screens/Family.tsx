import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { PageHeader } from "../components/PageHeader";
import { useCopy } from "../state/store";

export function Family() {
  const copy = useCopy();
  const [sheet, setSheet] = useState<"sit" | "pillow" | null>(null);
  const title = sheet === "sit" ? copy.family.sitTitle : copy.family.pillowTitle;
  const steps = sheet === "sit" ? copy.family.sitSteps : sheet === "pillow" ? copy.family.pillowSteps : [];

  return (
    <div className="stack">
      <PageHeader title={copy.family.title} sub={copy.family.intro} />
      <Button onClick={() => setSheet("sit")}>{copy.family.sit}</Button>
      <Button to="/walk" variant="secondary">
        {copy.family.walk}
      </Button>
      <Button variant="secondary" onClick={() => setSheet("pillow")}>
        {copy.family.pillow}
      </Button>
      <Button to="/breathe" variant="ghost">
        {copy.family.breathe}
      </Button>
      <Button to="/learn/why" variant="ghost">
        {copy.family.why}
      </Button>
      <Card>
        <h2>{copy.family.scriptsTitle}</h2>
        <ul className="script-list">
          {copy.family.scripts.map((line) => (
            <li key={line}>“{line}”</li>
          ))}
        </ul>
      </Card>
      <p className="field-hint">{copy.family.notOrders}</p>
      <Modal open={sheet !== null} title={title} onClose={() => setSheet(null)}>
        <div className="stack">
          <ol className="steps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <Button onClick={() => setSheet(null)}>{copy.close}</Button>
        </div>
      </Modal>
    </div>
  );
}
