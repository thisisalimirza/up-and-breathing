type Props = {
  checked: boolean;
  title: string;
  detail?: string;
  onToggle: () => void;
  onOpen?: () => void;
  toggleLabel: string;
  openLabel?: string;
  tone?: "default" | "warn";
};

export function ChecklistItem({
  checked,
  title,
  detail,
  onToggle,
  onOpen,
  toggleLabel,
  openLabel,
  tone = "default",
}: Props) {
  const body = (
    <>
      <span className="check-title">{title}</span>
      {detail ? <span className="check-detail">{detail}</span> : null}
      {openLabel ? <span className="check-open">{openLabel}</span> : null}
    </>
  );

  if (!onOpen) {
    return (
      <li className={`check-row${checked ? " is-on" : ""}${tone === "warn" ? " is-warn" : ""}`}>
        <label className="check-whole">
          <input type="checkbox" checked={checked} onChange={onToggle} />
          <span className="sr-only">{toggleLabel}</span>
          <span className="check-main">{body}</span>
        </label>
      </li>
    );
  }

  return (
    <li className={`check-row${checked ? " is-on" : ""}${tone === "warn" ? " is-warn" : ""}`}>
      <label className="check-toggle">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span className="sr-only">{toggleLabel}</span>
      </label>
      <button type="button" className="check-main" onClick={onOpen}>
        {body}
      </button>
    </li>
  );
}
