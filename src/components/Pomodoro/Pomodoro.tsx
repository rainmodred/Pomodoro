import { useCallback, useEffect, useRef, useState } from 'react';

import { DefaultTimers, useSettings } from '../../context/SettingsContext';
import SettingsModal from '../SettingsModal/SettingsModal';
import useTimer from './useTimer';
import useSound from './useSound';
import Timer from '../Timer/Timer';
import { sounds } from '../../constants';
import { timeToMinSec } from '../../utils/utils';

import styles from './Pomodoro.module.css';

interface TimerState {
  timerName: keyof DefaultTimers;
  status: 'started' | 'paused';
  currentTime: number;
}

export default function Pomodoro(): JSX.Element {
  const [{ timers, sound, autostart }] = useSettings();

  const [timerState, setTimerState] = useState<TimerState>({
    timerName: 'pomodoro',
    status: 'paused',
    currentTime: timers['pomodoro'],
  });

  const [autoStart, setAutoStart] = useState(false);

  const timerId = useRef(0);
  const usedShortBreaks = useRef(0);

  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
  }, [timerState.timerName]);

  function startTimer() {
    console.log('started');
    timerId.current = window.setInterval(() => {
      console.log('tick');
      setTimerState(state => {
        if (state.currentTime === 0) {
          window.clearInterval(timerId.current);
          if (
            state.timerName === 'short break' ||
            state.timerName === 'long break'
          ) {
            usedShortBreaks.current = state.timerName === 'short break' ? 1 : 0;
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
    }, 1000);
  }

  function resetTimer() {
    window.clearInterval(timerId.current);
    setTimerState({
      timerName: 'pomodoro',
      status: 'paused',
      currentTime: timers['pomodoro'],
    });
  }

  function toggleTimer() {
    if (timerState.currentTime === 0) {
      throw new Error('not implemented');
    }

    if (timerState.status === 'paused') {
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

  function handleTabSwitch(timerName: keyof typeof timers) {
    window.clearInterval(timerId.current);
    setTimerState({
      timerName,
      status: 'paused',
      currentTime: timers[timerName],
    });
  }

  useEffect(() => {
    return () => window.clearInterval(timerId.current);
  }, []);

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

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
            initialTime={timers[timerState.timerName]}
            statusText={timerState.status === 'paused' ? 'start' : 'pause'}
            currentTime={timerState.currentTime}
            toggle={toggleTimer}
            reset={resetTimer}
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
