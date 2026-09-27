import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ChoiceGroup } from "../components/ChoiceGroup";
import { Modal } from "../components/Modal";
import { PageHeader } from "../components/PageHeader";
import { TimingControl } from "../components/TimingControl";
import { VolumeField } from "../components/VolumeField";
import { DAY_IDS, SURGERY_IDS, type DayId, type SurgeryId } from "../data/types";
import { fill } from "../lib/i18n";
import { APP_VERSION } from "../lib/version";
import { useCopy, useStore } from "../state/store";

export function Settings() {
  const store = useStore();
  const copy = useCopy();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);
  const surgery = store.profile?.surgery ?? store.pendingSurgery;
  const day = store.profile?.day ?? null;

  return (
    <div className="stack">
      <PageHeader title={copy.settings.title} />
      {!store.profile ? <p className="field-hint">{copy.settings.needBoth}</p> : null}
      <Card>
        <h2>{copy.settings.surgery}</h2>
        <ChoiceGroup
          name="settings-surgery"
          legend={copy.settings.surgery}
          value={surgery}
          options={SURGERY_IDS.map((id) => ({
            id,
            label: copy.surgery.options[id].label,
            helper: copy.surgery.options[id].helper,
          }))}
          onChange={(id) => store.setSurgery(id as SurgeryId)}
        />
      </Card>
      <Card>
        <h2>{copy.settings.day}</h2>
        <ChoiceGroup
          name="settings-day"
          legend={copy.settings.day}
          value={day}
          options={DAY_IDS.map((id) => ({ id, label: copy.day.options[id] }))}
          onChange={(id) => store.setDay(id as DayId)}
        />
      </Card>
      <Card>
        <h2>{copy.settings.timing}</h2>
        <p className="field-hint">{copy.settings.timingHint}</p>
        <TimingControl />
        <h2>{copy.settings.volume}</h2>
        <VolumeField />
      </Card>
      <Card>
        <div className="switch-row">
          <div>
            <h2>{copy.settings.textSize}</h2>
            <p className="field-hint">{copy.settings.textSizeHint}</p>
          </div>
          <button
            type="button"
            className="switch"
            aria-pressed={store.largeText}
            onClick={() => store.setLargeText(!store.largeText)}
          >
            {store.largeText ? copy.settings.on : copy.settings.off}
          </button>
        </div>
        <div className="switch-row">
          <div>
            <h2>{copy.settings.motion}</h2>
            <p className="field-hint">{copy.settings.motionHint}</p>
          </div>
          <button
            type="button"
            className="switch"
            aria-pressed={store.reducedMotion}
            onClick={() => store.setReducedMotion(!store.reducedMotion)}
          >
            {store.reducedMotion ? copy.settings.on : copy.settings.off}
          </button>
        </div>
      </Card>
      <Card>
        <h2>{copy.settings.about}</h2>
        <p>{fill(copy.settings.version, { version: APP_VERSION })}</p>
        <p>{copy.habits}</p>
        <p>{copy.settings.prototype}</p>
        <p>{copy.disclaimer}</p>
      </Card>
      <Button variant="ghost" onClick={() => setConfirmReset(true)}>
        {copy.settings.reset}
      </Button>
      <Modal open={confirmReset} title={copy.settings.resetTitle} onClose={() => setConfirmReset(false)}>
        <div className="stack">
          <p>{copy.settings.resetBody}</p>
          <Button
            onClick={() => {
              store.reset();
              navigate("/");
            }}
          >
            {copy.settings.resetYes}
          </Button>
          <Button variant="secondary" onClick={() => setConfirmReset(false)}>
            {copy.settings.resetNo}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
