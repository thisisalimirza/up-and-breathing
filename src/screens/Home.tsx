import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Banner } from "../components/Banner";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ChecklistItem } from "../components/ChecklistItem";
import { Modal } from "../components/Modal";
import { PageHeader } from "../components/PageHeader";
import { getPlan } from "../data/protocols";
import { JOB_IDS, type JobId } from "../data/types";
import { fill } from "../lib/i18n";
import { todayISO } from "../lib/time";
import { useCopy, useStore } from "../state/store";

const MORE: Record<JobId, string> = {
  sit: "/learn/why",
  walk: "/learn/why",
  breathe: "/learn/breathe",
  cough: "/learn/cough",
  mouth: "/learn/eat",
};

export function Home() {
  const store = useStore();
  const copy = useCopy();
  const [openJob, setOpenJob] = useState<JobId | null>(null);
  if (!store.profile) return <Navigate to="/" replace />;

  const { surgery, day } = store.profile;
  const plan = getPlan(store.language, surgery, day);
  const date = todayISO();
  const done = JOB_IDS.filter((id) => store.checklist[date]?.[id]).length;
  const pain = store.painByDate[date];
  const early = day === "pacu" || day === "pod0";
  const active = openJob;

  return (
    <div className="stack" data-surgery={surgery} data-day={day}>
      <PageHeader
        title={copy.home.title}
        sub={`${copy.day.short[day]} · ${copy.surgery.short[surgery]}`}
      />
      <p className="goal-prefix">{copy.goalPrefix}</p>
      <div className="strip-block">
        <div
          className="strip"
          role="img"
          aria-label={fill(copy.home.jobsProgress, { done, total: JOB_IDS.length })}
        >
          <span style={{ width: `${(done / JOB_IDS.length) * 100}%` }} />
        </div>
        <p className="strip-label">{fill(copy.home.jobsProgress, { done, total: JOB_IDS.length })}</p>
      </div>
      {early ? <Banner>{copy.home.firstStand}</Banner> : null}
      <ol className="check-list">
        {JOB_IDS.map((id) => (
          <ChecklistItem
            key={id}
            checked={Boolean(store.checklist[date]?.[id])}
            title={copy.home.jobs[id].title}
            detail={plan[id]}
            openLabel={copy.home.howTo}
            toggleLabel={fill(store.checklist[date]?.[id] ? copy.home.markNotDone : copy.home.markDone, {
              job: copy.home.jobs[id].title,
            })}
            onToggle={() => store.toggleJob(id, date)}
            onOpen={() => setOpenJob(id)}
          />
        ))}
      </ol>
      <Button to="/breathe">{copy.home.startBreathing}</Button>
      <Button to="/walk" variant="secondary">
        {copy.home.walkingCoach}
      </Button>
      <Card>
        <h2>{copy.home.alsoToday}</h2>
        <ul className="plain-list">
          {plan.extras.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <p className="field-label" id="pain-label">
          {copy.home.painLabel}
        </p>
        <div className="pain-grid" role="group" aria-labelledby="pain-label">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              type="button"
              aria-pressed={pain === n}
              onClick={() => store.setPain(n, date)}
            >
              {n}
            </button>
          ))}
        </div>
        {pain !== undefined ? (
          <>
            <p className="field-hint">{fill(copy.home.painSaved, { n: pain })}</p>
            <button type="button" className="text-btn" onClick={() => store.clearPain(date)}>
              {copy.home.clearPain}
            </button>
          </>
        ) : null}
        {pain !== undefined && pain >= 7 ? <Banner tone="danger">{copy.home.painHigh}</Banner> : null}
      </Card>
      <Modal
        open={active !== null}
        title={active ? copy.home.jobs[active].title : ""}
        onClose={() => setOpenJob(null)}
      >
        {active ? (
          <div className="stack">
            <p>{plan[active]}</p>
            <ol className="steps">
              {copy.home.jobs[active].howTo.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Link className="text-link" to={MORE[active]} onClick={() => setOpenJob(null)}>
              {copy.home.readMore}
            </Link>
            <Button onClick={() => setOpenJob(null)}>{copy.close}</Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
