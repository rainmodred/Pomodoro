import { useEffect, useState } from 'react';
import Clock from '../Clock/Clock';

enum Mode {
  started = 'STARTED',
  paused = 'PAUSED',
}

const DEFAULT_TIME = 1500;

export default function Pomodoro(): JSX.Element {
  const [started, setStarted] = useState(Mode.paused);

  const [currentTime, setCurrentTime] = useState(DEFAULT_TIME);

  useEffect(() => {
    function tick() {
      setCurrentTime(currentTime => (currentTime === 0 ? 0 : currentTime - 1));
    }

    let id = 0;
    if (started === Mode.started) {
      id = window.setInterval(tick, 1000);
    }

    return () => window.clearInterval(id);
  }, [started]);

  useEffect(() => {
    if (currentTime === 0) {
      setStarted(Mode.paused);
    }
  }, [currentTime]);

  function handleToggleTimer() {
    if (started === Mode.paused) {
      setStarted(Mode.started);
    } else {
      setStarted(Mode.paused);
    }
  }

  function handleReset() {
    setCurrentTime(DEFAULT_TIME);
    setStarted(Mode.paused);
  }

  return (
    <div>
      <h1>Pomodoro</h1>
      <div>
        <button role="tab">pomodoro</button>
        <button role="tab">short break</button>
        <button role="tab">long break</button>
      </div>

      <div>
        <Clock time={currentTime} />

        <button onClick={handleToggleTimer}>
          {started === Mode.started ? 'pause' : 'start'}
        </button>
        <button onClick={handleReset}>reset</button>
      </div>
      <button>settings</button>
    </div>
  );
}
