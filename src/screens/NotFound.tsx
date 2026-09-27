import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";
import { useCopy } from "../state/store";

export function NotFound() {
  const copy = useCopy();
  return (
    <div className="stack">
      <PageHeader title={copy.notFound.title} sub={copy.notFound.body} />
      <Button to="/">{copy.notFound.cta}</Button>
    </div>
  );
}
