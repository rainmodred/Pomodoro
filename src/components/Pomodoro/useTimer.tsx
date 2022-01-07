import { useCallback, useEffect, useRef, useState } from 'react';

enum Status {
  Started = 'STARTED',
  Paused = 'PAUSED',
}

export type StatusText = 'pause' | 'start';

interface UseTimerType {
  statusText: StatusText;
  currentTime: number;
  toggle: () => void;
  reset: () => void;
}

export default function useTimer(initialTime: number): UseTimerType {
  const [status, setStatus] = useState(Status.Paused);
  const [currentTime, setCurrentTime] = useState(initialTime);

  const timerId = useRef(0);

  useEffect(() => {
    setCurrentTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (status === Status.Started) {
      timerId.current = window.setInterval(
        () => setCurrentTime(currentTime => currentTime - 1),
        1000,
      );
    }

    if (status === Status.Paused) {
      window.clearInterval(timerId.current);
    }

    if (currentTime === 0) {
      setStatus(Status.Paused);
    }

    return () => {
      window.clearInterval(timerId.current);
    };
  }, [status, currentTime]);

  const toggle = useCallback(() => {
    if (currentTime < 1) {
      return;
    }
    if (status === Status.Paused) {
      setStatus(Status.Started);
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
