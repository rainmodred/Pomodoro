import { useState } from 'react';

interface NumberInputProps {
  min: number;
  max: number;
  label: string;
  defaultValue: string;
}

export default function NumberInput({
  min,
  max,
  label,
  defaultValue,
}: NumberInputProps): JSX.Element {
  const [value, setValue] = useState(defaultValue);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <label>
      {label}
      <input
        min={min}
        max={max}
        type="number"
        value={value}
        onChange={handleOnChange}
      />
    </label>
  );
}
