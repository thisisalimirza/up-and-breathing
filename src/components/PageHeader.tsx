import { useEffect } from "react";

export function PageHeader({ title, sub, kicker }: { title: string; sub?: string; kicker?: string }) {
  useEffect(() => {
    document.title = `${title} · Up & Breathing`;
  }, [title]);

  return (
    <header className="page-head">
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h1>{title}</h1>
      {sub ? <p className="sub">{sub}</p> : null}
    </header>
  );
}
