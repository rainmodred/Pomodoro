interface ClockProps {
  id: string;
  time: number;
}

function timeToMinSec(time: number) {
  return new Date(time * 1000).toISOString().slice(14, 19);
}

export default function Clock({ id, time }: ClockProps): JSX.Element {
  return <div data-testid={`${id}-clock`}>{timeToMinSec(time)}</div>;
}
