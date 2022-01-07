import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

import Clock from '../Clock/Clock';
import { StatusText } from '../Pomodoro/useTimer';
import ProgressRing from '../ProgressRing/ProgressRing';

import styles from './Timer.module.css';

interface TimerProps {
  statusText: StatusText;
  initialTime: number;
  currentTime: number;
  toggle: () => void;
  reset: () => void;
}

export default function Timer({
  statusText,
  currentTime,
  initialTime,
  toggle,
  reset,
}: TimerProps): JSX.Element {
  const [progress, setProgress] = useState(100);
  const [{ selectedColor }] = useSettings();

  useEffect(() => {
    setProgress(Math.floor((currentTime / initialTime) * 100));
  }, [currentTime, initialTime]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button
          onClick={toggle}
          // data-testid={`${id}-start`}
          disabled={currentTime === 0}
          className={styles.timer}
        >
          <ProgressRing
            progress={progress}
            radius={140}
            stroke={8}
            color={selectedColor}
          />
          <Clock time={currentTime} />
          <p className={styles.status}>{statusText}</p>
        </button>
        <button
          className={styles.reset}
          onClick={reset}
          // data-testid={`${id}-reset`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-refresh"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#75f3f7"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
