import { useCopy, useStore } from "../state/store";

export function LanguageToggle() {
  const { language, setLanguage } = useStore();
  const copy = useCopy();
  return (
    <div className="lang-toggle" role="group" aria-label={copy.languageGroup}>
      <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>
        {copy.english}
      </button>
      <button type="button" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>
        {copy.spanish}
      </button>
    </div>
  );
}
