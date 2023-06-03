import styles from './NumberInput.module.css';

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
    <div className={styles.container}>
      <label className={styles.label} htmlFor={label}>
        {label}
      </label>
      <input
        className={styles.input}
        id={label}
        name={label}
        min={min}
        max={max}
        type="number"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
