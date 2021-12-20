import styles from './Clock.module.css';

interface ClockProps {
  id: string;
  time: number;
}

function timeToMinSec(time: number) {
  const minutesNumber = Math.floor(time / 60);
  const secondsNumber = time % 60;

  const minutes = minutesNumber < 10 ? `0${minutesNumber}` : minutesNumber;
  const seconds = secondsNumber < 10 ? `0${secondsNumber}` : secondsNumber;

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
