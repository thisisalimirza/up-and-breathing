type Option = { id: string; label: string; helper?: string };

export function ChoiceGroup({
  name,
  legend,
  value,
  options,
  onChange,
}: {
  name: string;
  legend: string;
  value: string | null;
  options: Option[];
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className="choices">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label key={option.id} className="choice">
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
          />
          <span>
            <span className="choice-label">{option.label}</span>
            {option.helper ? <span className="choice-help">{option.helper}</span> : null}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
