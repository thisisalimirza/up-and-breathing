import { useEffect, useRef, useState } from "react";
import { Banner } from "../components/Banner";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ChecklistItem } from "../components/ChecklistItem";
import { PageHeader } from "../components/PageHeader";
import { getPlan } from "../data/protocols";
import { ALT_IDS, type AltId, type DayId, type SurgeryId, type WalkKind } from "../data/types";
import { pulse } from "../lib/breath";
import { clock } from "../lib/time";
import { todayISO } from "../lib/time";
import { useCopy, useStore } from "../state/store";

const PRESETS = [120, 300, 600] as const;

export function Walk() {
  const store = useStore();
  const copy = useCopy();
  const surgery: SurgeryId = store.profile?.surgery ?? "other";
  const day: DayId = store.profile?.day ?? "pod0";
  const plan = getPlan(store.language, surgery, day);
  const date = todayISO();
  const [bell, setBell] = useState(false);
  const [socks, setSocks] = useState(false);
  const [lines, setLines] = useState(false);
  const [someone, setSomeone] = useState(false);
  const [dizzy, setDizzy] = useState(false);
  const [picked, setPicked] = useState<(typeof PRESETS)[number]>(120);
  const [left, setLeft] = useState(120);
  const [running, setRunning] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [saved, setSaved] = useState(false);
  const leftRef = useRef(left);
  leftRef.current = left;

  useEffect(() => {
    if (!running) return;
    const endAt = Date.now() + leftRef.current * 1000;
    const id = window.setInterval(() => {
      const seconds = Math.ceil((endAt - Date.now()) / 1000);
      if (seconds <= 0) {
        setLeft(0);
        setRunning(false);
        setTimeUp(true);
        pulse();
        return;
      }
      setLeft(seconds);
    }, 200);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (dizzy && running) setRunning(false);
  }, [dizzy, running]);

  const presetLabel = {
    120: copy.walk.min2,
    300: copy.walk.min5,
    600: copy.walk.min10,
  } as const;

  const checks: { key: string; label: string; checked: boolean; set: (v: boolean) => void; warn?: boolean }[] = [
    { key: "bell", label: copy.walk.checks.bell, checked: bell, set: setBell },
    { key: "socks", label: copy.walk.checks.socks, checked: socks, set: setSocks },
    { key: "lines", label: copy.walk.checks.lines, checked: lines, set: setLines },
    { key: "someone", label: copy.walk.checks.someone, checked: someone, set: setSomeone },
    { key: "dizzy", label: copy.walk.checks.dizzy, checked: dizzy, set: setDizzy, warn: true },
  ];

  function log(kind: WalkKind) {
    if (dizzy) return;
    store.logWalk({ kind, surgery, day });
    setSaved(true);
  }

  return (
    <div className="stack">
      <PageHeader title={copy.walk.title} sub={`${copy.day.short[day]} · ${copy.surgery.short[surgery]}`} />
      {!store.profile ? <Banner tone="info">{copy.walk.generalNote}</Banner> : null}
      <Banner>{copy.walk.askFirst}</Banner>
      {(day === "pacu" || day === "pod0") && store.profile ? <Banner>{copy.home.firstStand}</Banner> : null}

      <Card>
        <h2>{copy.walk.beforeTitle}</h2>
        <p className="field-hint">{copy.walk.checksNotSaved}</p>
        <ul className="check-list">
          {checks.map((item) => (
            <ChecklistItem
              key={item.key}
              checked={item.checked}
              title={item.label}
              tone={item.warn ? "warn" : "default"}
              toggleLabel={item.label}
              onToggle={() => item.set(!item.checked)}
            />
          ))}
        </ul>
        {dizzy ? <Banner tone="danger">{copy.walk.dizzyStop}</Banner> : null}
      </Card>

      <Card>
        <h2>{copy.walk.goalTitle}</h2>
        <p className="goal-prefix">{copy.goalPrefix}</p>
        <p>{plan.walkGoal}</p>
        <p>{plan.walk}</p>
      </Card>

      <Card>
        <h2>{copy.walk.timerTitle}</h2>
        <p className="field-hint">{copy.walk.timerHint}</p>
        <div className="segment" role="group" aria-label={copy.walk.timerTitle}>
          {PRESETS.map((sec) => (
            <button
              key={sec}
              type="button"
              aria-pressed={picked === sec}
              disabled={running}
              onClick={() => {
                setPicked(sec);
                setLeft(sec);
                setTimeUp(false);
              }}
            >
              {presetLabel[sec]}
            </button>
          ))}
        </div>
        <p className="count-num" aria-live="polite">
          {clock(left)}
        </p>
        {timeUp ? <p>{copy.walk.timeUp}</p> : null}
        <div className="stack tight">
          {running ? (
            <Button onClick={() => setRunning(false)}>{copy.walk.stopTimer}</Button>
          ) : (
            <Button
              disabled={dizzy}
              onClick={() => {
                if (left <= 0) setLeft(picked);
                setTimeUp(false);
                setRunning(true);
              }}
            >
              {copy.walk.startTimer}
            </Button>
          )}
          <Button
            variant="ghost"
            disabled={running}
            onClick={() => {
              setLeft(picked);
              setTimeUp(false);
            }}
          >
            {copy.walk.resetTimer}
          </Button>
        </div>
      </Card>

      <Card>
        <h2>{copy.walk.logTitle}</h2>
        <div className="stack tight">
          <Button disabled={dizzy} onClick={() => log("short")}>
            {copy.walk.short}
          </Button>
          <Button disabled={dizzy} variant="secondary" onClick={() => log("medium")}>
            {copy.walk.medium}
          </Button>
          <Button disabled={dizzy} variant="ghost" onClick={() => log("lap")}>
            {copy.walk.lap}
          </Button>
        </div>
        {saved ? <p className="field-hint">{copy.walk.logged}</p> : null}
      </Card>

      <Card>
        <h2>{copy.walk.cantTitle}</h2>
        <p>{copy.walk.cantIntro}</p>
        <p>{copy.walk.chairQuote}</p>
        <ul className="check-list">
          {ALT_IDS.map((id: AltId) => {
            const on = Boolean(store.alternates[date]?.[id]);
            return (
              <ChecklistItem
                key={id}
                checked={on}
                title={copy.walk.alternates[id]}
                toggleLabel={on ? copy.walk.undo : copy.walk.didIt}
                onToggle={() => store.toggleAlt(id, date)}
              />
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
