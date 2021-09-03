import styles from './Clock.module.css';

interface ClockProps {
  id: string;
  time: number;
}

function timeToMinSec(time: number) {
  const [minutes, seconds] = new Date(time * 1000)
    .toISOString()
    .slice(14, 19)
    .split(':');

  return (
    <>
      {minutes}
      <span className={styles.semicolon}>:</span>
      {seconds}
    </>
  );
}

export default function Clock({ id, time }: ClockProps): JSX.Element {
  return (
    <div className={styles.clock} data-testid={`${id}-clock`}>
      {timeToMinSec(time)}
    </div>
  );
}
