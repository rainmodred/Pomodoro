import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import { useState } from 'react';
import { TimerType } from '../../types.';
import NumberInput from '../NumberInput/NumberInput';

interface SettingsModalProps {
  isOpen: boolean;
  timers: { label: string; time: number }[];
  close: () => void;
  onSubmit: (values: TimerType[]) => void;
}

export default function SettingsModal({
  isOpen,
  timers,
  close,
  onSubmit,
}: SettingsModalProps): JSX.Element {
  const [timeInputs, setTimeInputs] = useState([...timers]);

  function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(timeInputs);
    close();
  }

  function handleChange(label: string, value: string) {
    setTimeInputs(
      timeInputs.map(input =>
        input.label === label ? { ...input, time: Number(value) * 60 } : input,
      ),
    );
  }

  return (
    <Dialog isOpen={isOpen} onDismiss={close} aria-label="settings">
      <button className="close-button" onClick={close}>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </button>
      <h2>Settings</h2>
      <h3>Time (minutes)</h3>
      <form onSubmit={handleApply}>
        {timeInputs.map(({ label, time }) => (
          <NumberInput
            key={label}
            label={label}
            max={90}
            min={1}
            value={(time / 60).toString()}
            onChange={handleChange}
          />
        ))}

        <button type="submit">Apply</button>
      </form>
    </Dialog>
  );
}
