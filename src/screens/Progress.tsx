import { Banner } from "../components/Banner";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { ProgressRing } from "../components/ProgressRing";
import { ALT_IDS, JOB_IDS } from "../data/types";
import { fill } from "../lib/i18n";
import { breathingStreak, dayNumber, formatWhen, lastNDates, todayISO, weekdayShort } from "../lib/time";
import { useCopy, useStore } from "../state/store";

export function Progress() {
  const store = useStore();
  const copy = useCopy();
  const today = todayISO();
  const days = lastNDates(7);
  const jobTotal = Object.values(store.checklist).reduce(
    (sum, row) => sum + JOB_IDS.filter((id) => row?.[id]).length,
    0,
  );
  const todayJobs = JOB_IDS.filter((id) => store.checklist[today]?.[id]).length;
  const streak = breathingStreak(store.sessions.map((session) => session.dateISO));
  const empty = store.sessions.length === 0 && store.walks.length === 0 && jobTotal === 0;
  const recent = [
    ...store.sessions.map((session) => ({
      at: session.timestamp,
      text: fill(copy.progress.sessionLine, {
        when: formatWhen(session.timestamp, store.language),
        cough: session.coughed ? copy.progress.withCough : copy.progress.withoutCough,
      }),
    })),
    ...store.walks.map((walk) => ({
      at: walk.timestamp,
      text: fill(copy.progress.walkLine, {
        when: formatWhen(walk.timestamp, store.language),
        kind: copy.progress.kinds[walk.kind],
      }),
    })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 8);

  function exportLog() {
    const lines: string[] = [
      copy.progress.exportTitle,
      copy.progress.exportNote,
      "",
      copy.progress.exportSessions,
    ];
    if (store.sessions.length === 0) lines.push(copy.progress.exportNone);
    store.sessions.forEach((session) => {
      lines.push(
        `${session.dateISO}  ${formatWhen(session.timestamp, store.language)}  ${session.breaths}  ${
          session.coughed ? copy.progress.withCough : copy.progress.withoutCough
        }  ${copy.surgery.short[session.surgery]}  ${copy.day.short[session.day]}`,
      );
    });
    lines.push("", copy.progress.exportWalks);
    if (store.walks.length === 0) lines.push(copy.progress.exportNone);
    store.walks.forEach((walk) => {
      lines.push(
        `${walk.dateISO}  ${formatWhen(walk.timestamp, store.language)}  ${copy.progress.kinds[walk.kind]}  ${
          copy.surgery.short[walk.surgery]
        }  ${copy.day.short[walk.day]}`,
      );
    });
    lines.push("", copy.progress.exportJobs);
    const jobDates = Object.keys(store.checklist).sort();
    if (jobDates.length === 0) lines.push(copy.progress.exportNone);
    jobDates.forEach((date) => {
      const names = JOB_IDS.filter((id) => store.checklist[date]?.[id]).map((id) => copy.home.jobs[id].title);
      if (names.length) lines.push(`${date}  ${names.join(", ")}`);
    });
    lines.push("", copy.progress.exportAlts);
    const altDates = Object.keys(store.alternates).sort();
    if (altDates.length === 0) lines.push(copy.progress.exportNone);
    altDates.forEach((date) => {
      const names = ALT_IDS.filter((id) => store.alternates[date]?.[id]).map((id) => copy.progress.altNames[id]);
      if (names.length) lines.push(`${date}  ${names.join(", ")}`);
    });
    lines.push("", copy.progress.exportPain);
    const painDates = Object.keys(store.painByDate).sort();
    if (painDates.length === 0) lines.push(copy.progress.exportNone);
    painDates.forEach((date) => lines.push(`${date}  ${store.painByDate[date]}`));
    lines.push("", copy.disclaimer);
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "up-and-breathing-log.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="stack">
      <PageHeader title={copy.progress.title} sub={copy.progress.privacy} />
      {empty ? <Banner tone="info">{copy.progress.empty}</Banner> : null}
      <ProgressRing
        value={todayJobs / JOB_IDS.length}
        label={fill(copy.home.jobsProgress, { done: todayJobs, total: JOB_IDS.length })}
      />
      <div className="stat-grid">
        <Card>
          <p className="stat-num">{store.sessions.length}</p>
          <p>{copy.progress.sessions}</p>
        </Card>
        <Card>
          <p className="stat-num">{store.walks.length}</p>
          <p>{copy.progress.walks}</p>
        </Card>
        <Card>
          <p className="stat-num">{jobTotal}</p>
          <p>{copy.progress.jobs}</p>
        </Card>
      </div>
      <p>{streak > 0 ? fill(copy.progress.streak, { n: streak }) : copy.progress.streakNone}</p>
      <Card>
        <h2>{copy.progress.calendarLabel}</h2>
        <ol className="calendar">
          {days.map((date) => {
            const breath = store.sessions.some((session) => session.dateISO === date);
            const walked = store.walks.some((walk) => walk.dateISO === date);
            const jobs = JOB_IDS.some((id) => store.checklist[date]?.[id]);
            return (
              <li key={date} className={date === today ? "is-today" : undefined}>
                <span className="cal-week">{weekdayShort(date, store.language)}</span>
                <span className="cal-num">{dayNumber(date)}</span>
                <span className="cal-marks">
                  {breath ? <span>{copy.progress.legendBreath.slice(0, 1)}</span> : null}
                  {walked ? <span>{copy.progress.legendWalk.slice(0, 1)}</span> : null}
                  {jobs ? <span>{copy.progress.legendJobs.slice(0, 1)}</span> : null}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="legend">
          <span>{copy.progress.legendBreath}</span>
          <span>{copy.progress.legendWalk}</span>
          <span>{copy.progress.legendJobs}</span>
        </p>
      </Card>
      {recent.length > 0 ? (
        <Card>
          <h2>{copy.progress.recent}</h2>
          <ul className="plain-list">
            {recent.map((item) => (
              <li key={`${item.at}-${item.text}`}>{item.text}</li>
            ))}
          </ul>
        </Card>
      ) : null}
      <Button onClick={exportLog}>{copy.progress.exportBtn}</Button>
      {empty ? (
        <Button to="/breathe" variant="secondary">
          {copy.home.startBreathing}
        </Button>
      ) : null}
    </div>
  );
}
