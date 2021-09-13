import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

import NumberInput from '../NumberInput/NumberInput';

import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  close: () => void;
}

export default function SettingsModal({
  isOpen,
  close,
}: SettingsModalProps): JSX.Element {
  const [settings, dispatch] = useSettings();

  const [state, setState] = useState(() => {
    const res = { timers: {} } as {
      timers: Record<string, string>;
      selectedColor: string;
    };

    settings.timers.forEach(
      ({ label, time }) => (res.timers[label] = (time / 60).toString()),
    );

    const color = settings.colors.find(color => color.checked);
    if (color) {
      res.selectedColor = color.value;
    }
    return res;
  });

  function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({ type: 'updateSettings', payload: state });

    close();
  }

  function handleTimerChange(label: string, value: string) {
    setState({
      ...state,
      timers: {
        ...state.timers,
        [label]: value,
      },
    });
  }

  function handleChangeColor(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    setState({
      ...state,
      selectedColor: e.target.value,
    });
  }

  return (
    <Dialog isOpen={isOpen} onDismiss={close} aria-label="settings">
      <button className={styles.close} onClick={close}>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </button>
      <h2 className={styles.heading}>Settings</h2>
      <h3 className={styles.subHeading}>Time (minutes)</h3>
      <form className={styles.form} onSubmit={handleApply}>
        <div className={styles.time}>
          {Object.entries(state.timers).map(([label, time]) => (
            <NumberInput
              key={label}
              label={label}
              max={90}
              min={1}
              value={time}
              onChange={handleTimerChange}
            />
          ))}
        </div>

        <div className={styles.colors}>
          <h3 className={styles.subHeading}>Color</h3>
          <div className={styles.colorsInputs}>
            {settings.colors.map(({ label, value }) => (
              <label className={styles.radio} key={label}>
                <span className={styles.radioInput}>
                  <input
                    type="radio"
                    name="color"
                    value={value}
                    checked={value === state.selectedColor}
                    onChange={handleChangeColor}
                  />
                  <span
                    className={styles.radioControl}
                    style={{ backgroundColor: value }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-check"
                      width="18"
                      height="16"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="#171931"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <button className={styles.submit} type="submit">
          Apply
        </button>
      </form>
    </Dialog>
  );
}
