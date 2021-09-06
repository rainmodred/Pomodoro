import { createContext, useContext, useReducer, useState } from 'react';
import { getFromStrorage, setToStorage } from '../utils';

type TimerType = {
  label: string;
  time: number;
};

type Settings = {
  timers: TimerType[];
};

type ACTIONTYPE = {
  type: 'updateTimer';
  payload: Record<string, string>;
};

const initialState = {
  timers: [
    { label: 'pomodoro', time: 1500 },
    { label: 'short break', time: 300 },
    { label: 'long break', time: 600 },
  ],
};

function getInitialState() {
  return getFromStrorage('settings') || initialState;
}

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'updateTimer':
      const updatedTimers = {
        ...state,
        timers: Object.entries(action.payload).map(([label, value]) => ({
          label,
          time: Number(value) * 60,
        })),
      };
      setToStorage('settings', updatedTimers);
      return updatedTimers;

    default:
      throw new Error();
  }
}

type SettingsContextType = [Settings, React.Dispatch<ACTIONTYPE>];
const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: React.ReactNode;
}

function SettingsProvider({ children }: SettingsProviderProps): JSX.Element {
  const [settings, dispatch] = useReducer(reducer, getInitialState());

  return (
    <SettingsContext.Provider value={[settings, dispatch]}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}

export { useSettings, SettingsProvider };
