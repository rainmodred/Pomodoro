import { useEffect } from 'react';
import Pomodoro from './components/Pomodoro/Pomodoro';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
  return (
    <SettingsProvider>
      <Pomodoro />
    </SettingsProvider>
  );
}
