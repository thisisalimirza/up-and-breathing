import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { useCopy, useStore } from "../state/store";

export function Welcome() {
  const copy = useCopy();
  const { profile } = useStore();
  const subtitle = profile
    ? `${copy.day.short[profile.day]} · ${copy.surgery.short[profile.surgery]}`
    : copy.tagline;

  return (
    <div className="stack">
      <PageHeader
        kicker={copy.tagline}
        title={copy.welcome.title}
        sub={profile ? subtitle : undefined}
      />
      <p className="body">{copy.welcome.body}</p>
      {profile ? (
        <>
          <p className="field-hint">{copy.welcome.resumeHint}</p>
          <Button to="/home">{copy.welcome.continue}</Button>
          <Button to="/setup/surgery" variant="secondary">
            {copy.welcome.startOver}
          </Button>
          <p className="field-hint">{copy.welcome.startOverHint}</p>
        </>
      ) : (
        <>
          <Button to="/setup/surgery">{copy.welcome.cta}</Button>
          <Button to="/family" variant="secondary">
            {copy.welcome.family}
          </Button>
        </>
      )}
    </div>
  );
}
