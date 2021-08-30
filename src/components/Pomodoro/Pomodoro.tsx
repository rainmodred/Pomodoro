import { useEffect, useState } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';

import Timer from '../Timer/Timer';

const Timers = [
  { label: 'pomodoro', time: 1500 },
  { label: 'short break', time: 300 },
  { label: 'long break', time: 600 },
];

export default function Pomodoro(): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0);

  function handleTabsChange(index: number) {
    setTabIndex(index);
  }

  return (
    <div>
      <h1>Pomodoro</h1>
      <Tabs tabIndex={tabIndex} onChange={handleTabsChange}>
        <TabList>
          {Timers.map(({ label }) => (
            <Tab key={label}>{label}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {Timers.map(({ label, time }, index) => (
            <TabPanel key={index}>
              <Timer id={label} time={time} tabIndex={tabIndex} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
}
