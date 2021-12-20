import { useCallback, useEffect, useRef, useState } from 'react';

enum Status {
  Started = 'STARTED',
  Paused = 'PAUSED',
}

export default function useTimer(initialTime: number) {
  const [status, setStatus] = useState(Status.Paused);
  const [currentTime, setCurrentTime] = useState(initialTime);

  const timerId = useRef(0);

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

  function toggle() {
    if (status === Status.Paused && currentTime > 0) {
      setStatus(Status.Started);
    }

    if (status === Status.Started) {
      setStatus(Status.Paused);
    }
  }

  const reset = useCallback(() => {
    window.clearInterval(timerId.current);
    setStatus(Status.Paused);
    setCurrentTime(initialTime);
  }, [initialTime]);

  return {
    status: status === Status.Started ? 'pause' : 'start',
    currentTime,
    toggle,
    reset,
  };
}
