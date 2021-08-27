interface ClockProps {
  minutes: string;
  seconds: string;
}

export default function Clock({ minutes, seconds }: ClockProps): JSX.Element {
  return (
    <div>
      {minutes}:{seconds}
    </div>
  );
}
