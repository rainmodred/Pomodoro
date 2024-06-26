import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

import { initialSettings, useSettings } from '../../context/SettingsContext';
import ColorPicker from './ColorPicker/ColorPicker';
import SoundPicker from './SoundPicker/SoundPicker';
import NumberInput from '../ui/NumberInput/NumberInput';
import { Color, Sound } from '../../utils/constants';

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

  const [timers, setTimers] = useState({ ...settings.timers });
  const [selectedColor, setSelectedColor] = useState(settings.selectedColor);

  const [currentSound, setCurrentSound] = useState(settings.sound.name);
  const [volume, setVolume] = useState(settings.sound.volume);

  const [autostart, setAutostart] = useState(settings.autostart);
  const [notification, setNotification] = useState(settings.notification);

  function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({
      type: 'updateTimers',
      payload: timers,
    });

    if (selectedColor.hex !== settings.selectedColor.hex) {
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
    setTimers({ ...timers, [label]: Number(value) });
  }

  function handleColorChange(color: Color) {
    setSelectedColor(color);
  }

  function handleSoundChange(value: string) {
    setCurrentSound(value as Sound);
  }

  function handleVolumeChange(value: number) {
    setVolume(value);
  }

  function handleAutostartChange() {
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

    setTimers({ ...timers });
    setSelectedColor(selectedColor);
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
                <h3 className="subHeading">Time (minutes)</h3>
                <div className={styles.time}>
                  {Object.entries(timers).map(([label, time]) => (
                    <NumberInput
                      key={label}
                      label={label}
                      max={90}
                      min={1}
                      value={time.toString()}
                      onChange={handleTimerChange}
                    />
                  ))}
                </div>
              </li>
              <li className={styles.settingsItem}>
                <ColorPicker
                  selectedColor={selectedColor}
                  onColorChange={handleColorChange}
                />
              </li>
              <li className={styles.settingsItem}>
                <SoundPicker
                  currentSound={currentSound}
                  onSoundChange={handleSoundChange}
                  volume={volume}
                  onVolumeChange={handleVolumeChange}
                />
              </li>
              <li className={styles.settingsItem}>
                <div className={styles.autoStartWrapper}>
                  <label htmlFor="autoStart" className="subHeading">
                    Auto Start
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
                  <label htmlFor="notification" className="subHeading">
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
