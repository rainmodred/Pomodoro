import { useState, useRef, useEffect } from 'react';

import { useSettings } from '../../context/SettingsContext';
import {
  convertToSeconds,
  getSoundSrc,
  sendNotification,
  updateDocumentTitle,
} from '../../utils/utils';
import useSound from './useSound';
import useWorker from './useWorker';
import { Timers } from '../../utils/constants';

type TimerStatus = 'started' | 'paused';

interface TimerState {
  timerName: keyof Timers;
  status: TimerStatus;
  currentTime: number;
  usedShortBreaks: number;
}

export default function useTimer() {
  const [{ timers, sound, autostart }] = useSettings();
  const { postMessage } = useWorker(onTick);

  const [timerState, setTimerState] = useState<TimerState>({
    timerName: 'pomodoro',
    status: 'paused',
    currentTime: convertToSeconds(timers['pomodoro']),
    usedShortBreaks: 0,
  });

  const soundSrc = getSoundSrc(sound.name);
  const { play } = useSound(soundSrc, {
    volume: sound.volume,
    duration: 2000,
  });

  function onTick() {
    setTimerState(state => {
      const nextTime = state.currentTime - 1;
      updateDocumentTitle(nextTime);
      if (nextTime > 0) {
        return {
          ...state,
          currentTime: nextTime,
        };
      }
      play();
      sendNotification();
      let nextTimerStatus: TimerStatus = autostart ? 'started' : 'paused';
      postMessage(nextTimerStatus);
      //CYCLE: pomodoro => short break => pomodoro => long break

      if (state.timerName === 'pomodoro') {
        let nextTimerName: keyof Timers = 'short break';
        if (state.usedShortBreaks + 1 > 1) {
          nextTimerName = 'long break';
        }

        return {
          status: nextTimerStatus,
          timerName: nextTimerName,
          currentTime: convertToSeconds(timers[nextTimerName]),
          usedShortBreaks: nextTimerName === 'long break' ? 0 : 1,
        };
      } else if (state.timerName === 'long break') {
        postMessage('paused');
        return {
          status: 'paused', //Stop cycling after long break
          timerName: 'pomodoro',
          currentTime: convertToSeconds(timers['pomodoro']),
          usedShortBreaks: 0,
        };
      } else if (state.timerName === 'short break') {
        return {
          status: nextTimerStatus,
          timerName: 'pomodoro',
          currentTime: convertToSeconds(timers['pomodoro']),
          usedShortBreaks: state.usedShortBreaks + 1,
        };
      }
      return { ...state };
    });
  }

  useEffect(() => {
    resetTimer(timerState.timerName);
  }, [timers]);

  function resetTimer(timerName: keyof Timers = 'pomodoro') {
    postMessage('paused');
    setTimerState({
      timerName,
      status: 'paused',
      currentTime: convertToSeconds(timers[timerName]),
      usedShortBreaks: 0,
    });
  }

  function toggleTimer() {
    if (timerState.currentTime === 0) {
      return;
    }

    if (timerState.status === 'paused') {
      postMessage('started');
      setTimerState(state => ({ ...state, status: 'started' }));
      return;
    }

    if (timerState.status === 'started') {
      postMessage('paused');
      setTimerState(state => ({ ...state, status: 'paused' }));
      return;
    }
  }

  return { timerState, toggleTimer, resetTimer };
}
