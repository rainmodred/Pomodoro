import { useState } from 'react';
import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import { Listbox, ListboxList, ListboxOption } from '@reach/listbox';
import '@reach/listbox/styles.css';

import { useSettings } from '../../context/SettingsContext';
import NumberInput from '../NumberInput/NumberInput';
import VolumeSlider from '../VolumeSlider';
import useSound from '../Pomodoro/useSound';
import { sounds, colors as colorsList, Colors, Sounds } from '../../constants';

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
  const { selectedSound } = settings;

  const [timers, setTimers] = useState(
    settings.timers.reduce<Record<string, string>>((prev, curr) => {
      prev[curr.label] = (curr.time / 60).toString();
      return prev;
    }, {}),
  );

  const [colors, setColors] = useState(
    [...colorsList].map(color =>
      color.value === settings.selectedColor
        ? { ...color, checked: true }
        : { ...color, checked: false },
    ),
  );

  const soundsList = Object.keys(sounds);
  const [currentSound, setCurrentSound] = useState<Sounds>(selectedSound);
  const [volume, setVolume] = useState(settings.volume);
  const soundSrc = `${sounds[currentSound]}`;
  const { play } = useSound(soundSrc, { volume, duration: 500 });

  function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const selectedColor = colors.find(color => color.checked)?.value as Colors;
    if (selectedColor !== settings.selectedColor) {
      dispatch({
        type: 'updateColor',
        payload: selectedColor,
      });
    }

    if (selectedSound !== settings.selectedSound) {
      dispatch({
        type: 'updateSound',
        payload: selectedSound,
      });
    }

    if (volume !== settings.volume) {
      dispatch({
        type: 'updateVolume',
        payload: volume,
      });
    }

    close();
  }

  function handleTimerChange(label: string, value: string) {
    setTimers({ ...timers, [label]: value });
  }

  function handleChangeColor(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedColor = e.target.value;
    setColors(
      colors.map(color =>
        color.value === selectedColor
          ? { ...color, checked: true }
          : { ...color, checked: false },
      ),
    );
  }

  function handleSoundChange(value: string) {
    setCurrentSound(value as Sounds);
    play();
  }

  function handleVolumeChange(value: number) {
    setVolume(value);
    play();
  }

  return (
    <Dialog isOpen={isOpen} onDismiss={close} aria-label="settings">
      <div className={styles.header}>
        <h2 className={styles.heading}>Settings</h2>
        <button className={styles.close} onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
      </div>
      <hr className={styles.breakLine} />
      <form className={styles.form} onSubmit={handleApply}>
        <ul>
          <li className={styles.settingsItem}>
            <span className={styles.subHeading}>Time (minutes)</span>
            <div className={styles.time}>
              {Object.entries(timers).map(([label, time]) => (
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
          </li>
          <li className={styles.settingsItem}>
            <div className={styles.colors}>
              <span className={styles.subHeading}>Color</span>
              <div className={styles.colorsInputs} role="radiogroup">
                {colors.map(({ name, value, checked }) => (
                  <label
                    className={styles.radio}
                    key={name}
                    data-testid={value}
                  >
                    <span className={styles.radioInput}>
                      <input
                        type="radio"
                        name="color"
                        value={value}
                        checked={checked}
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
          </li>
          <li className={styles.settingsItem}>
            <div className={styles.sound}>
              <span className={styles.subHeading}>Alarm Sound</span>
              <div>
                <div className={styles.soundItem}>
                  <span className={styles.soundSubheading}>Sound</span>
                  <Listbox
                    aria-labelledby="select sound"
                    value={currentSound}
                    onChange={value => handleSoundChange(value)}
                    portal={false}
                    as="span"
                  >
                    <ListboxList style={{ zIndex: 100 }}>
                      {soundsList.map(value => (
                        <ListboxOption key={value} value={value}>
                          {value}
                        </ListboxOption>
                      ))}
                    </ListboxList>
                  </Listbox>
                </div>
                <div className={styles.soundItem}>
                  <span className={styles.soundSubheading}>Volume</span>
                  <VolumeSlider onChange={handleVolumeChange} volume={volume} />
                </div>
              </div>
            </div>
          </li>
        </ul>

        <button className={styles.submit} type="submit">
          Apply
        </button>
      </form>
    </Dialog>
  );
}
