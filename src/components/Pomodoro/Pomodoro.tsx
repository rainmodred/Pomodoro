import { useState } from 'react';

import Timer from '../Timer/Timer';
import { useSettings } from '../../context/SettingsContext';
import SettingsModal from '../SettingsModal/SettingsModal';
import useTimer from './useTimer';
import { convertToSeconds } from '../../utils/utils';

import styles from './Pomodoro.module.css';

export default function Pomodoro(): JSX.Element {
  const [{ timers }] = useSettings();
  const { timerState, toggleTimer, resetTimer } = useTimer();

  function handleTabSwitch(timerName: keyof typeof timers) {
    resetTimer(timerName);
  }

  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  const initialTime = convertToSeconds(timers[timerState.timerName]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Pomodoro</h1>
      <div>
        <div className={styles.tabList}>
          {(Object.keys(timers) as Array<keyof typeof timers>).map(
            timerName => {
              return (
                <button
                  className={`${styles.tab} ${
                    timerName === timerState.timerName ? styles.selectedTab : ''
                  }`}
                  key={timerName}
                  onClick={() => handleTabSwitch(timerName)}
                >
                  {timerName}
                </button>
              );
            },
          )}
        </div>
        <div className={styles.tabPanel}>
          {' '}
          <Timer
            initialTime={initialTime}
            statusText={timerState.status === 'paused' ? 'start' : 'pause'}
            currentTime={timerState.currentTime}
            toggle={toggleTimer}
            reset={() => resetTimer(timerState.timerName)}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button onClick={open} data-testid="settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-settings"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#75f3f7"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
      <SettingsModal isOpen={showDialog} close={close} />
    </div>
  );
}
