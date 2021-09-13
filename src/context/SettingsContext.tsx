import { createContext, useContext, useEffect, useReducer } from 'react';
import { getFromStrorage, setToStorage } from '../utils';

let root = document.documentElement;

type TimerType = {
  label: string;
  time: number;
};

export type Colors = '#f67174' | '#75f3f7' | '#d880f5';

type Settings = {
  timers: TimerType[];
  selectedColor: Colors;
};

type ACTIONTYPE = {
  type: 'updateSettings';
  payload: {
    timers: Record<string, string>;
    selectedColor: string;
  };
};

const initialState: Settings = {
  timers: [
    { label: 'pomodoro', time: 1500 },
    { label: 'short break', time: 300 },
    { label: 'long break', time: 600 },
  ],
  selectedColor: '#f67174',
};

function getInitialState() {
  return getFromStrorage('settings') || initialState;
}

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'updateSettings':
      const { selectedColor, timers } = action.payload;

      const updatedSetting: Settings = {
        ...state,
        timers: Object.entries(timers).map(([label, value]) => ({
          label,
          time: Number(value) * 60,
        })),
        selectedColor: selectedColor as Colors,
      };
      setToStorage('settings', updatedSetting);

      return updatedSetting;

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

  useEffect(() => {
    root.style.setProperty('--color-main', settings.selectedColor);
  }, [settings.selectedColor]);

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
