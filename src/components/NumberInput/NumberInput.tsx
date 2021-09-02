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
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    onChange(name, value);
  }

  return (
    <label>
      {label}
      <input
        name={label}
        min={min}
        max={max}
        type="number"
        value={value}
        onChange={handleChange}
      />
    </label>
  );
}
