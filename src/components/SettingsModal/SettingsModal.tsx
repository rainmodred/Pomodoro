import { useState } from 'react';
// import { Dialog } from '@reach/dialog';
// import VisuallyHidden from '@reach/visually-hidden';
// import { Listbox, ListboxList, ListboxOption } from '@reach/listbox';
// import '@reach/listbox/styles.css';
import { Select, SelectItem } from '../Select/Select';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDownIcon, Cross2Icon } from '@radix-ui/react-icons';

import { initialSettings, useSettings } from '../../context/SettingsContext';
import NumberInput from '../NumberInput/NumberInput';
import VolumeSlider from '../VolumeSlider/VolumeSlider';
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
  const [currentSound, setCurrentSound] = useState<Sounds>(settings.sound.name);
  const [volume, setVolume] = useState(settings.sound.volume);
  const soundSrc = `${sounds[currentSound]}`;
  const { play } = useSound(soundSrc, { volume, duration: 500 });

  const [autostart, setAutostart] = useState(settings.autostart);
  const [notification, setNotification] = useState(settings.notification);

  function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({
      type: 'updateTimers',
      payload: Object.entries(timers).map(([label, value]) => ({
        label,
        time: Number(value) * 60,
      })),
    });

    const selectedColor = colors.find(color => color.checked)?.value as Colors;
    if (selectedColor !== settings.selectedColor) {
      dispatch({
        type: 'updateColor',
        payload: selectedColor,
      });
    }

    if (
      currentSound !== settings.sound.name ||
      volume !== settings.sound.volume
    ) {
      dispatch({
        type: 'updateSound',
        payload: {
          name: currentSound,
          volume,
        },
      });
    }

    if (autostart !== settings.autostart) {
      dispatch({
        type: 'updateAutostart',
        payload: autostart,
      });
    }

    if (notification !== settings.notification) {
      dispatch({
        type: 'updateNotification',
        payload: notification,
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

  function handleAutostartChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAutostart(!autostart);
  }

  function handleNotificationChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked && Notification.permission === 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'denied') {
          alert('Notifications is disabled');
          setNotification(false);
        }
      });
    }
    setNotification(!notification);
  }

  function handleResetSettings() {
    const { timers, selectedColor, sound, autostart, notification } =
      initialSettings;

    setTimers(
      timers.reduce<Record<string, string>>((prev, curr) => {
        prev[curr.label] = (curr.time / 60).toString();
        return prev;
      }, {}),
    );
    setColors(
      [...colorsList].map(color =>
        color.value === selectedColor
          ? { ...color, checked: true }
          : { ...color, checked: false },
      ),
    );

    setCurrentSound(sound.name);
    setVolume(sound.volume);
    setAutostart(autostart);
    setNotification(notification);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={close} aria-label="settings">
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Close asChild>
            <button className={styles.iconButton} aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>

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
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
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
                  <div>
                    <div className={styles.soundItem}>
                      <span className={styles.subHeading}>Sound</span>
                      <Select
                        value={currentSound}
                        onValueChange={value => handleSoundChange(value)}
                      >
                        {soundsList.map(value => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className={styles.soundItem}>
                      <span className={styles.subHeading}>Volume</span>
                      <VolumeSlider
                        onChange={handleVolumeChange}
                        volume={volume}
                      />
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.settingsItem}>
                <div className={styles.autoStartWrapper}>
                  <label htmlFor="autoStart" className={styles.subHeading}>
                    Auto Switch
                  </label>
                  <input
                    id="autoStart"
                    type="checkbox"
                    checked={autostart}
                    onChange={handleAutostartChange}
                  />
                </div>
              </li>
              <li className={styles.settingsItem}>
                <div className={styles.autoStartWrapper}>
                  <label htmlFor="notification" className={styles.subHeading}>
                    Notification
                  </label>
                  <input
                    id="notification"
                    type="checkbox"
                    checked={notification}
                    onChange={handleNotificationChange}
                  />
                </div>
              </li>
            </ul>

            <div className={styles.buttonsWrapper}>
              <button
                className={`${styles.button} ${styles.submit}`}
                type="submit"
              >
                Apply
              </button>
              <button
                className={`${styles.button} ${styles.reset}`}
                type="button"
                onClick={handleResetSettings}
              >
                Reset
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
