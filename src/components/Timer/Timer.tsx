import { useCallback, useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

import Clock from '../Clock/Clock';
import ProgressRing from '../ProgressRing/ProgressRing';

import styles from './Timer.module.css';

enum Status {
  Idle = 'IDLE',
  Started = 'STARTED',
  Paused = 'PAUSED',
}
interface TimerProps {
  id: string;
  time: number;
  tabIndex: number;
}

export default function Timer({ id, time, tabIndex }: TimerProps): JSX.Element {
  const [status, setStatus] = useState(Status.Idle);
  const [currentTime, setCurrentTime] = useState(time);
  const [progress, setProgress] = useState(100);
  const [{ colors }] = useSettings();

  const selectedColor = colors.find(color => color.checked)?.value as string;

  const reset = useCallback(() => {
    setCurrentTime(time);
    setStatus(Status.Paused);
    setProgress(100);
  }, [time]);

  useEffect(() => {
    reset();
  }, [tabIndex, reset]);

  useEffect(() => {
    function tick() {
      setCurrentTime(currentTime => (currentTime === 0 ? 0 : currentTime - 1));
    }

    let id = 0;
    if (status === Status.Started) {
      id = window.setInterval(tick, 1000);
    }

    return () => {
      window.clearInterval(id);
    };
  }, [status]);

  useEffect(() => {
    if (currentTime === 0) {
      setStatus(Status.Paused);
    }

    if (status !== Status.Idle) {
      document.title = new Date(currentTime * 1000).toISOString().slice(14, 19);
    }

    setProgress(Math.floor((currentTime / time) * 100));
  }, [currentTime]);

  function handleToggleTimer() {
    if (status === Status.Paused) {
      setStatus(Status.Started);
    } else {
      setStatus(Status.Paused);
    }
  }

  function handleReset() {
    reset();
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button
          onClick={handleToggleTimer}
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
          <p className={styles.status}>
            {status === Status.Started ? 'pause' : 'start'}
          </p>
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
