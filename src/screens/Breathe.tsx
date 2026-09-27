import { useEffect, useRef, useState } from "react";
import { Banner } from "../components/Banner";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { PageHeader } from "../components/PageHeader";
import { TimingControl } from "../components/TimingControl";
import { VolumeField } from "../components/VolumeField";
import { getPlan } from "../data/protocols";
import type { DayId, SurgeryId } from "../data/types";
import { nextStep, phaseSeconds, pulse, type BreathPhase } from "../lib/breath";
import { fill } from "../lib/i18n";
import { useCopy, useStore } from "../state/store";

type Mode = "ready" | "run" | "pause" | "cough" | "done" | "quitAsk";

export function Breathe() {
  const store = useStore();
  const copy = useCopy();
  const surgery: SurgeryId = store.profile?.surgery ?? "other";
  const day: DayId = store.profile?.day ?? "pod0";
  const plan = getPlan(store.language, surgery, day);
  const [setupOpen, setSetupOpen] = useState(store.sessions.length === 0);
  const [mode, setMode] = useState<Mode>("ready");
  const [breath, setBreath] = useState(1);
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [remainingMs, setRemainingMs] = useState(
    phaseSeconds("inhale", store.inhaleSeconds, store.holdSeconds) * 1000,
  );
  const [displayMs, setDisplayMs] = useState(remainingMs);
  const [tipIndex, setTipIndex] = useState(0);
  const [token, setToken] = useState(0);
  const [announce, setAnnounce] = useState("");
  const displayRef = useRef(displayMs);
  const inhaleRef = useRef(store.inhaleSeconds);
  const holdRef = useRef(store.holdSeconds);
  const copyRef = useRef(copy);
  displayRef.current = displayMs;
  inhaleRef.current = store.inhaleSeconds;
  holdRef.current = store.holdSeconds;
  copyRef.current = copy;

  function arm(nextBreath: number, nextPhase: BreathPhase) {
    const ms = phaseSeconds(nextPhase, inhaleRef.current, holdRef.current) * 1000;
    setBreath(nextBreath);
    setPhase(nextPhase);
    setRemainingMs(ms);
    setDisplayMs(ms);
    setAnnounce(
      fill(copy.breathe.announce, {
        breath: nextBreath,
        total: 10,
        phase: copy.breathe.phases[nextPhase].word,
        seconds: ms / 1000,
      }),
    );
  }

  function start() {
    setTipIndex(0);
    setToken((n) => n + 1);
    setMode("run");
    arm(1, "inhale");
    pulse();
  }

  useEffect(() => {
    if (mode !== "run") return;
    const endAt = Date.now() + remainingMs;
    const tick = window.setInterval(() => {
      setDisplayMs(Math.max(0, endAt - Date.now()));
    }, 100);
    const done = window.setTimeout(() => {
      const next = nextStep(breath, phase);
      if (next.kind === "cough") {
        setMode("cough");
        setAnnounce(copyRef.current.breathe.coughAnnounce);
        pulse();
        return;
      }
      if (next.phase === "inhale") setTipIndex((n) => n + 1);
      const ms = phaseSeconds(next.phase, inhaleRef.current, holdRef.current) * 1000;
      setBreath(next.breath);
      setPhase(next.phase);
      setRemainingMs(ms);
      setDisplayMs(ms);
      setAnnounce(
        fill(copyRef.current.breathe.announce, {
          breath: next.breath,
          total: 10,
          phase: copyRef.current.breathe.phases[next.phase].word,
          seconds: ms / 1000,
        }),
      );
      pulse();
    }, remainingMs);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [mode, breath, phase, remainingMs, token]);

  function snapshotAnd(next: Mode) {
    setRemainingMs(Math.max(200, displayRef.current));
    setMode(next);
  }

  const secondsLeft = Math.max(1, Math.ceil(displayMs / 1000));
  const phaseCopy = copy.breathe.phases[phase];
  const tip = copy.breathe.tips[tipIndex % copy.breathe.tips.length];
  const homeTo = store.profile ? "/home" : "/";

  return (
    <div className="stack">
      <PageHeader title={copy.breathe.title} />
      {!store.profile ? <Banner tone="info">{copy.breathe.generalNote}</Banner> : null}
      <p className="goal-prefix">{copy.goalPrefix}</p>
      <p>{plan.breathe}</p>

      {mode === "ready" || mode === "done" ? (
        <Card>
          <button
            type="button"
            className="text-btn setup-toggle"
            aria-expanded={setupOpen}
            onClick={() => setSetupOpen((open) => !open)}
          >
            {setupOpen ? copy.breathe.hideSetup : copy.breathe.setupSummary}
          </button>
          {setupOpen ? (
            <div className="stack tight">
              <p>
                <strong>{copy.breathe.positionLabel}. </strong>
                {copy.breathe.position}
              </p>
              <p>
                <strong>{copy.breathe.splintLabel}. </strong>
                {copy.breathe.splint}
              </p>
              <p>
                <strong>{copy.breathe.deviceLabel}. </strong>
                {copy.breathe.device}
              </p>
              <VolumeField />
              <TimingControl />
            </div>
          ) : null}
        </Card>
      ) : null}

      {mode === "ready" ? <Button onClick={start}>{copy.breathe.start}</Button> : null}

      {mode === "run" || mode === "pause" || mode === "quitAsk" ? (
        <div className="coach">
          <p className="breath-count">{fill(copy.breathe.breathOf, { breath, total: 10 })}</p>
          <div className="orb-wrap">
            <div
              className={`orb ${phase}${mode === "pause" ? " is-paused" : ""}`}
              style={{ transitionDuration: phase === "inhale" ? `${store.inhaleSeconds}s` : "4s" }}
              aria-hidden="true"
            />
          </div>
          <h2 className="phase-word">{phaseCopy.word}</h2>
          <p className="phase-detail">{phaseCopy.detail}</p>
          <p className="count-num" aria-hidden="true">
            {secondsLeft}
          </p>
          <p className="tip">{tip}</p>
          {store.volumeGoalMl ? (
            <p className="field-hint">{fill(copy.breathe.volumeOnFile, { n: store.volumeGoalMl })}</p>
          ) : null}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {announce}
          </div>
          <div className="row-actions">
            {mode === "pause" || mode === "quitAsk" ? (
              <Button onClick={() => setMode("run")}>{copy.breathe.resume}</Button>
            ) : (
              <Button onClick={() => snapshotAnd("pause")}>{copy.breathe.pause}</Button>
            )}
            <Button variant="secondary" onClick={start}>
              {copy.breathe.restart}
            </Button>
            <Button variant="ghost" onClick={() => snapshotAnd("quitAsk")}>
              {copy.breathe.quit}
            </Button>
          </div>
        </div>
      ) : null}

      {mode === "cough" ? (
        <Card>
          <h2>{copy.breathe.coughTitle}</h2>
          <p>{copy.breathe.coughBody}</p>
          <div className="sr-only" aria-live="polite">
            {announce}
          </div>
          <div className="stack tight">
            <Button onClick={() => {
              store.logSession({ coughed: true, surgery, day });
              setSetupOpen(false);
              setMode("done");
              setAnnounce(copy.breathe.doneTitle);
            }}
            >
              {copy.done}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                store.logSession({ coughed: false, surgery, day });
                setSetupOpen(false);
                setMode("done");
                setAnnounce(copy.breathe.doneTitle);
              }}
            >
              {copy.breathe.skipCough}
            </Button>
          </div>
        </Card>
      ) : null}

      {mode === "done" ? (
        <Card>
          <p className="kicker">{copy.breathe.doneKicker}</p>
          <h2>{copy.breathe.doneTitle}</h2>
          <p>{copy.breathe.doneSuggest}</p>
          <div className="sr-only" aria-live="polite">
            {announce}
          </div>
          <div className="stack tight">
            <Button to={homeTo}>{copy.breathe.backHome}</Button>
            <Button variant="secondary" onClick={start}>
              {copy.breathe.another}
            </Button>
            <Button to="/walk" variant="ghost">
              {copy.breathe.walking}
            </Button>
          </div>
        </Card>
      ) : null}

      <Modal open={mode === "quitAsk"} title={copy.breathe.quitTitle} onClose={() => setMode("run")}>
        <div className="stack">
          <p>{copy.breathe.quitBody}</p>
          <Button
            onClick={() => {
              setMode("ready");
              setAnnounce("");
            }}
          >
            {copy.breathe.quitYes}
          </Button>
          <Button variant="secondary" onClick={() => setMode("run")}>
            {copy.breathe.quitNo}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
