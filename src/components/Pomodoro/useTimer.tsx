import { useCallback, useEffect, useRef, useState } from 'react';

enum Status {
  Started = 'STARTED',
  Paused = 'PAUSED',
}

export type StatusText = 'pause' | 'start';

interface UseTimerReturnType {
  statusText: StatusText;
  currentTime: number;
  toggle: () => void;
  reset: () => void;
}

export default function useTimer(
  initialTime: number,
  autoplay: boolean,
  autostart: boolean,
  onTimeEnd: () => void,
): UseTimerReturnType {
  const [status, setStatus] = useState(Status.Paused);
  const [currentTime, setCurrentTime] = useState(initialTime);

  const startTime = useRef(0);
  const lastTime = useRef(0);

  const timerId = useRef(0);

  useEffect(() => {
    setCurrentTime(initialTime);
    if (autoplay && autostart) {
      setStatus(Status.Started);
    } else {
      setStatus(Status.Paused);
    }
  }, [initialTime, autoplay, autostart]);

  useEffect(() => {
    if (status === Status.Started) {
      timerId.current = window.setInterval(() => {
        const elapsedTime = Date.now() - startTime.current;
        const timeInSeconds = Math.round(elapsedTime / 1000);
        if (timeInSeconds !== lastTime.current) {
          lastTime.current = timeInSeconds;
          setCurrentTime(currentTime => currentTime - 1);
        }
      }, 100);
    }

    if (status === Status.Paused) {
      window.clearInterval(timerId.current);
    }

    if (status === Status.Started && currentTime === 0) {
      setStatus(Status.Paused);
      onTimeEnd();
    }

    return () => {
      window.clearInterval(timerId.current);
    };
  }, [status, currentTime, onTimeEnd]);

  const toggle = useCallback(() => {
    if (currentTime < 1) {
      return;
    }
    if (status === Status.Paused) {
      setStatus(Status.Started);
      startTime.current = Date.now();
    } else {
      setStatus(Status.Paused);
    }
  }, [status, currentTime]);

  const reset = useCallback(() => {
    window.clearInterval(timerId.current);
    setStatus(Status.Paused);
    setCurrentTime(initialTime);
  }, [initialTime]);

  return {
    statusText: status === Status.Started ? 'pause' : 'start',
    currentTime,
    toggle,
    reset,
  };
}
