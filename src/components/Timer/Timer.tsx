import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

import Clock from '../Clock/Clock';
import ProgressRing from '../ProgressRing/ProgressRing';

import styles from './Timer.module.css';
import useTimer from './useTimer';

interface TimerProps {
  id: string;
  time: number;
  tabIndex: number;
}

export default function Timer({ id, time, tabIndex }: TimerProps): JSX.Element {
  const { status, currentTime, toggle, reset } = useTimer(time);

  const [progress, setProgress] = useState(100);
  const [{ colors }] = useSettings();

  const selectedColor = colors.find(color => color.checked)?.value as string;

  useEffect(() => {
    setProgress(100);
    reset();
  }, [tabIndex, reset]);

  useEffect(() => {
    setProgress(Math.floor((currentTime / time) * 100));
  }, [currentTime, time]);

  function handleReset() {
    setProgress(100);
    reset();
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button
          onClick={toggle}
          data-testid={`${id}-start`}
          disabled={currentTime === 0}
          className={styles.timer}
        >
          <ProgressRing
            progress={progress}
            radius={140}
            stroke={8}
            color={selectedColor}
          />
          <Clock time={currentTime} id={id} />
          <p className={styles.status}>{status}</p>
        </button>
        <button
          className={styles.reset}
          onClick={handleReset}
          data-testid={`${id}-reset`}
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
