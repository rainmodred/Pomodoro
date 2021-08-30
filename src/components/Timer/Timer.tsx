import { useCallback, useEffect, useState } from 'react';
import Clock from '../Clock/Clock';

enum Status {
  started = 'STARTED',
  paused = 'PAUSED',
}
interface TimerProps {
  id: string;
  time: number;
  tabIndex: number;
}

export default function Timer({ id, time, tabIndex }: TimerProps): JSX.Element {
  const [status, setStatus] = useState(Status.paused);
  const [currentTime, setCurrentTime] = useState(time);

  const reset = useCallback(() => {
    setCurrentTime(time);
    setStatus(Status.paused);
  }, [time]);

  useEffect(() => {
    reset();
  }, [tabIndex, reset]);

  useEffect(() => {
    function tick() {
      setCurrentTime(currentTime => (currentTime === 0 ? 0 : currentTime - 1));
    }

    let id = 0;
    if (status === Status.started) {
      id = window.setInterval(tick, 1000);
    }

    return () => {
      window.clearInterval(id);
    };
  }, [status]);

  useEffect(() => {
    if (currentTime === 0) {
      setStatus(Status.paused);
    }
  }, [currentTime]);

  function handleToggleTimer() {
    if (status === Status.paused) {
      setStatus(Status.started);
    } else {
      setStatus(Status.paused);
    }
  }

  function handleReset() {
    reset();
  }

  return (
    <div>
      <Clock time={currentTime} id={id} />
      <button onClick={handleToggleTimer} data-testid={`${id}-start`}>
        {status === Status.started ? 'pause' : 'start'}
      </button>
      <button onClick={handleReset} data-testid={`${id}-reset`}>
        reset
      </button>
    </div>
  );
}
