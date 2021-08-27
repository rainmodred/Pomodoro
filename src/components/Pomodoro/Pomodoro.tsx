import Clock from '../Clock/Clock';

interface PomodoroProps {}

export default function Pomodoro(): JSX.Element {
  return (
    <div>
      <h1>Pomodoro</h1>
      <div>
        <button role="tab">pomodoro</button>
        <button role="tab">short break</button>
        <button role="tab">long break</button>
      </div>

      <div>
        <Clock minutes="25" seconds="00" />
        <button>start</button>
      </div>
      <button>settings</button>
    </div>
  );
}
