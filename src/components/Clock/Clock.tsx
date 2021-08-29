interface ClockProps {
  time: number;
}

function timeToMinSec(time: number) {
  return new Date(time * 1000).toISOString().slice(14, 19);
}

export default function Clock({ time }: ClockProps): JSX.Element {
  return <div>{timeToMinSec(time)}</div>;
}
