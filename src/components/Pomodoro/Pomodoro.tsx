import { useEffect, useRef, useState } from 'react';

import { Timers, useSettings } from '../../context/SettingsContext';
import SettingsModal from '../SettingsModal/SettingsModal';
import useSound from './useSound';
import Timer from '../Timer/Timer';
import { sounds } from '../../constants';
import { timeToMinSec } from '../../utils/utils';

import styles from './Pomodoro.module.css';

interface TimerState {
  timerName: keyof Timers;
  status: 'started' | 'paused';
  currentTime: number;
}

function convertToSeconds(time: number) {
  return time * 60;
}

function useTimer() {
  const [{ timers, sound, autostart }] = useSettings();

  const [timerState, setTimerState] = useState<TimerState>({
    timerName: 'pomodoro',
    status: 'paused',
    currentTime: convertToSeconds(timers['pomodoro']),
  });

  const { play } = useSound({
    volume: sound.volume,
    duration: 2000,
  });

  const timerId = useRef(0);
  const usedShortBreaks = useRef(0);

  useEffect(() => {
    resetTimer(timerState.timerName);
  }, [timers]);

  useEffect(() => {
    if (autostart) {
      startTimer();
    }
  }, [timerState.timerName]);

  const startTime = useRef(0);
  const lastTime = useRef(0);

  function startTimer() {
    console.log('started', Date.now());
    timerId.current = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime.current;
      const timeInSeconds = Math.round(elapsedTime / 1000);

      if (timeInSeconds !== lastTime.current) {
        lastTime.current = timeInSeconds;
        setTimerState(state => {
          const { minutes, seconds } = timeToMinSec(state.currentTime - 1);
          document.title = `${minutes}:${seconds} ${state.currentTime} ${lastTime.current} ${timeInSeconds}`;

          if (state.currentTime === 0) {
            play();
            window.clearInterval(timerId.current);
            if (
              state.timerName === 'short break' ||
              state.timerName === 'long break'
            ) {
              usedShortBreaks.current =
                state.timerName === 'short break' ? 1 : 0;
              return {
                status: 'paused',
                timerName: 'pomodoro',
                currentTime: timers['pomodoro'],
              };
            }
            if (state.timerName === 'pomodoro') {
              const nextTimerName =
                usedShortBreaks.current === 1 ? 'long break' : 'short break';
              return {
                status: 'paused',
                timerName: nextTimerName,
                currentTime: timers[nextTimerName],
              };
            }
            throw new Error('wat');
          }

          return {
            ...state,
            currentTime: state.currentTime - 1,
          };
        });
      }
    }, 100);
  }

  function resetTimer(timerName: keyof Timers = 'pomodoro') {
    window.clearInterval(timerId.current);
    setTimerState({
      timerName,
      status: 'paused',
      currentTime: convertToSeconds(timers[timerName]),
    });
  }

  function toggleTimer() {
    console.log('toggle', Date.now());
    if (timerState.currentTime === 0) {
      return;
    }

    if (timerState.status === 'paused') {
      startTime.current = Date.now();
      setTimerState(state => ({ ...state, status: 'started' }));
      startTimer();
      return;
    }

    if (timerState.status === 'started') {
      window.clearInterval(timerId.current);
      setTimerState(state => ({ ...state, status: 'paused' }));
      return;
    }
  }

  useEffect(() => {
    return () => window.clearInterval(timerId.current);
  }, []);

  return { timerState, toggleTimer, resetTimer };
}

export default function Pomodoro(): JSX.Element {
  const [{ timers }] = useSettings();
  const { timerState, toggleTimer, resetTimer } = useTimer();

  function handleTabSwitch(timerName: keyof typeof timers) {
    resetTimer(timerName);
  }

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  const initialTime = convertToSeconds(timers[timerState.timerName]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Pomodoro</h1>
      <div>
        <div className={styles.tabList}>
          {(Object.keys(timers) as Array<keyof typeof timers>).map(
            timerName => {
              return (
                <button
                  className={`${styles.tab} ${
                    timerName === timerState.timerName ? styles.selectedTab : ''
                  }`}
                  key={timerName}
                  onClick={() => handleTabSwitch(timerName)}
                >
                  {timerName}
                </button>
              );
            },
          )}
        </div>
        <div className={styles.tabPanel}>
          {' '}
          <Timer
            initialTime={initialTime}
            statusText={timerState.status === 'paused' ? 'start' : 'pause'}
            currentTime={timerState.currentTime}
            toggle={toggleTimer}
            reset={() => resetTimer('pomodoro')}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button onClick={open} data-testid="settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-settings"
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
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
      <SettingsModal isOpen={showDialog} close={close} />
    </div>
  );
}
