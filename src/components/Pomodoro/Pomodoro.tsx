import { useReducer, useState } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';

import '@reach/dialog/styles.css';
import '@reach/tabs/styles.css';

import Timer from '../Timer/Timer';
import SettingsModal from '../SettingsModal/SettingsModal';
import { TimerType } from '../../types.';

type ACTIONTYPE = {
  type: 'updateTimer';
  payload: { label: string; time: number }[];
};

const initialState = {
  timers: [
    { label: 'pomodoro', time: 1500 },
    { label: 'short break', time: 300 },
    { label: 'long break', time: 600 },
  ],
};

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'updateTimer':
      return {
        ...state,
        timers: action.payload,
      };

    default:
      throw new Error();
  }
}

export default function Pomodoro(): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { timers } = state;

  function handleTabsChange(index: number) {
    setTabIndex(index);
  }

  function handleApplySettings(updatedTimers: TimerType[]) {
    dispatch({ type: 'updateTimer', payload: updatedTimers });
  }

  return (
    <div>
      <h1>Pomodoro</h1>
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

      <button onClick={open}>settings</button>
      <SettingsModal
        isOpen={showDialog}
        close={close}
        timers={timers}
        onSubmit={handleApplySettings}
      />
    </div>
  );
}
