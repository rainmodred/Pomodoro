interface NumberInputProps {
  min: number;
  max: number;
  label: string;
  value: string;
  onChange: (label: string, value: string) => void;
}

export default function NumberInput({
  min,
  max,
  label,
  value,
  onChange,
}: NumberInputProps): JSX.Element {
  return (
    <label>
      {label}
      <input
        min={min}
        max={max}
        type="number"
        value={value}
        onChange={e => onChange(label, e.target.value)}
      />
    </label>
  );
}
