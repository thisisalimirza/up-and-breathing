import { PageHeader } from "../components/PageHeader";
import { useCopy } from "../state/store";

export function Print() {
  const copy = useCopy();
  const url = window.location.origin;
  return (
    <div className="flyer">
      <PageHeader kicker={copy.print.kicker} title={copy.print.title} sub={copy.print.sub} />
      <p className="flyer-lead">{copy.print.scan}</p>
      <p className="url-label">{copy.print.urlLabel}</p>
      <p className="flyer-url">{url}</p>
      <div className="qr-box">{copy.print.qrLabel}</div>
      <ol className="flyer-list">
        {copy.print.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ol>
      <p className="disclaimer flyer-note">{copy.disclaimer}</p>
      <p className="field-hint">{copy.print.fine}</p>
      <button type="button" className="btn btn-primary no-print" onClick={() => window.print()}>
        {copy.print.printBtn}
      </button>
    </div>
  );
}
