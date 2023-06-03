import { useState, useRef, useEffect } from 'react';

import { Timers, useSettings } from '../../context/SettingsContext';
import {
  convertToSeconds,
  getSoundSrc,
  sendNotification,
  timeToMinSec,
} from '../../utils/utils';
import useSound from './useSound';

interface TimerState {
  timerName: keyof Timers;
  status: 'started' | 'paused';
  currentTime: number;
}

export default function useTimer() {
  const [{ timers, sound, autostart }] = useSettings();

  const [timerState, setTimerState] = useState<TimerState>({
    timerName: 'pomodoro',
    status: 'paused',
    currentTime: convertToSeconds(timers['pomodoro']),
  });

  const soundSrc = getSoundSrc(sound.name);
  const { play } = useSound(soundSrc, {
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
    startTime.current = Date.now();
    lastTime.current = 0;
    setTimerState(state => ({ ...state, status: 'started' }));
    timerId.current = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime.current;
      const timeInSeconds = Math.round(elapsedTime / 1000);

      if (timeInSeconds !== lastTime.current) {
        lastTime.current = timeInSeconds;
        setTimerState(state => {
          if (state.currentTime === 0) {
            play();
            sendNotification();
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
                currentTime: convertToSeconds(timers['pomodoro']),
              };
            }
            if (state.timerName === 'pomodoro') {
              const nextTimerName =
                usedShortBreaks.current === 1 ? 'long break' : 'short break';
              return {
                status: 'paused',
                timerName: nextTimerName,
                currentTime: convertToSeconds(timers[nextTimerName]),
              };
            }
            throw new Error('send help');
          }

          const { minutes, seconds } = timeToMinSec(state.currentTime - 1);
          document.title = `${minutes}:${seconds}`;

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
    if (timerState.currentTime === 0) {
      return;
    }

    if (timerState.status === 'paused') {
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
