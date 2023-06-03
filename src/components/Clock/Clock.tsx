import { timeToMinSec } from '../../utils/utils';

import styles from './Clock.module.css';

interface ClockProps {
  time: number;
}

export default function Clock({ time }: ClockProps): JSX.Element {
  const { minutes, seconds } = timeToMinSec(time);
  return (
    <div className={styles.clock} data-testid="clock">
      {/* {timeToMinSec(time)} */}
      <>
        {minutes}
        <span className={styles.semicolon}>:</span>
        {seconds}
      </>
    </div>
  );
}
