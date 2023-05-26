import { useEffect, useRef, useState } from 'react';
import Pomodoro from './components/Pomodoro/Pomodoro';
import { SettingsProvider } from './context/SettingsContext';

const initialTimers = {
  pomodoro: 2,
  'short break': 3,
  'long break': 4,
};

interface State {
  timerName: keyof typeof initialTimers;
  status: 'started' | 'paused';
  currentTime: number;
}

function NewPomodoro() {
  const [state, setState] = useState<State>({
    timerName: 'pomodoro',
    status: 'paused',
    currentTime: initialTimers['pomodoro'],
  });

  //TODO: WIP
  const [autoStart, setAutoStart] = useState(false);

  const timerId = useRef(0);
  const usedShortBreaks = useRef(0);

  function startTimer() { }

  function toggleTimer() {
    if (state.currentTime === 0) {
      throw new Error('not implemented');
      return;
    }

    //TODO: refactor
    if (state.status === 'paused') {
      setState(state => ({ ...state, status: 'started' }));
      timerId.current = window.setInterval(() => {
        setState(state => {
          console.log('tick', state);
          if (state.currentTime === 0) {
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
                currentTime: initialTimers['pomodoro'],
              };
            }
            if (state.timerName === 'pomodoro') {
              const nextTimerName =
                usedShortBreaks.current === 1 ? 'long break' : 'short break';
              return {
                status: 'paused',
                timerName: nextTimerName,
                currentTime: initialTimers[nextTimerName],
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
      return;
    }

    if (state.status === 'started') {
      window.clearInterval(timerId.current);
      setState(state => ({ ...state, status: 'paused' }));
      return;
    }
  }

  function handleTabSwitch(timerName: keyof typeof initialTimers) {
    window.clearInterval(timerId.current);
    setState({
      timerName,
      status: 'paused',
      currentTime: initialTimers[timerName],
    });
  }

  useEffect(() => {
    return () => window.clearInterval(timerId.current);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {(Object.keys(initialTimers) as Array<keyof typeof initialTimers>).map(
          timerName => {
            return (
              <button
                onClick={() => handleTabSwitch(timerName)}
                style={{
                  textDecoration: `${timerName === state.timerName ? 'underline' : ''
                    }`,
                }}
              >
                {timerName}
              </button>
            );
          },
        )}
        <input
          type="checkbox"
          checked={autoStart}
          onChange={e => setAutoStart(e.target.checked)}
        />
      </div>
      <p>{state.currentTime}</p>
      <button onClick={toggleTimer}>
        {state.status === 'paused' ? 'start' : 'pause'}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <Pomodoro />
      <NewPomodoro />
    </SettingsProvider>
  );
}
