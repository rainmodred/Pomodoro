import { useState } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';

import '@reach/dialog/styles.css';
import '@reach/tabs/styles.css';

import Timer from '../Timer/Timer';
import SettingsModal from '../SettingsModal/SettingsModal';

import styles from './Pomodoro.module.css';
import { useSettings } from '../../context/SettingsContext';

export default function Pomodoro(): JSX.Element {
  const [{ timers }] = useSettings();

  const [tabIndex, setTabIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  function handleTabsChange(index: number) {
    setTabIndex(index);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Pomodoro</h1>
      <Tabs tabIndex={tabIndex} onChange={handleTabsChange}>
        <TabList>
          {timers.map(({ label }) => (
            <Tab key={label}>{label}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {timers.map(({ label, time }, index) => (
            <TabPanel key={index}>
              <Timer id={label} time={time} tabIndex={tabIndex} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

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
      <SettingsModal isOpen={showDialog} close={close} />
    </div>
  );
}
