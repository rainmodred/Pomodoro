import { useCallback, useEffect, useState } from 'react';
import Clock from '../Clock/Clock';

enum Status {
  Started = 'STARTED',
  Paused = 'PAUSED',
}
interface TimerProps {
  id: string;
  time: number;
  tabIndex: number;
}

export default function Timer({ id, time, tabIndex }: TimerProps): JSX.Element {
  const [status, setStatus] = useState(Status.Paused);
  const [currentTime, setCurrentTime] = useState(time);

  const reset = useCallback(() => {
    setCurrentTime(time);
    setStatus(Status.Paused);
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
    <div>
      <Clock time={currentTime} id={id} />
      <button onClick={handleToggleTimer} data-testid={`${id}-start`}>
        {status === Status.Started ? 'pause' : 'start'}
      </button>
      <button onClick={handleReset} data-testid={`${id}-reset`}>
        reset
      </button>
    </div>
  );
}
