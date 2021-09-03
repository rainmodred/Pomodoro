import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import { useState } from 'react';

import NumberInput from '../NumberInput/NumberInput';

import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  timers: { label: string; time: number }[];
  close: () => void;
  onSubmit: (values: Record<string, string>) => void;
}

export default function SettingsModal({
  isOpen,
  timers,
  close,
  onSubmit,
}: SettingsModalProps): JSX.Element {
  const [state, setState] = useState(() => {
    const res: Record<string, string> = {};
    timers.forEach(({ label, time }) => (res[label] = (time / 60).toString()));
    return res;
  });

  function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(state);
    close();
  }

  function handleChange(label: string, value: string) {
    setState({
      ...state,
      [label]: value,
    });
  }

  return (
    <Dialog isOpen={isOpen} onDismiss={close} aria-label="settings">
      <button className="close-button" onClick={close}>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </button>
      <h2 className={'settings__heading'}>Settings</h2>
      <hr />
      <h3 className={'settings__subHeading'}>Time (minutes)</h3>
      <form className={'settings__form'} onSubmit={handleApply}>
        {Object.entries(state).map(([label, time]) => (
          <NumberInput
            key={label}
            label={label}
            max={90}
            min={1}
            value={time}
            onChange={handleChange}
          />
        ))}

        <button className={'settings__submit'} type="submit">
          Apply
        </button>
      </form>
    </Dialog>
  );
}
