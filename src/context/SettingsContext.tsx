import { createContext, useContext, useEffect, useReducer } from 'react';
import { getFromStrorage, setToStorage } from '../utils/utils';
import { Colors, Sounds } from '../constants';

let root = document.documentElement;

type TimerType = {
  label: string;
  time: number;
};

type Settings = {
  timers: TimerType[];
  selectedColor: Colors;
  volume: number;
  selectedSound: Sounds;
  autostart: boolean;
  notification: boolean;
};

type ACTIONTYPE =
  | { type: 'updateSound'; payload: Sounds }
  | { type: 'updateVolume'; payload: number }
  | {
      type: 'updateColor';
      payload: Colors;
    }
  | {
      type: 'updateTimers';
      payload: TimerType[];
    }
  | {
      type: 'updateAutostart';
      payload: boolean;
    }
  | {
      type: 'updateNotification';
      payload: boolean;
    };

export const initialSettings: Settings = {
  timers: [
    { label: 'pomodoro', time: 1500 },
    { label: 'short break', time: 300 },
    { label: 'long break', time: 600 },
  ],
  selectedColor: '#f67174',
  volume: 50,
  selectedSound: 'Analog Alarm',
  autostart: true,
  notification: true,
};

function getInitialState() {
  return getFromStrorage('settings') || initialSettings;
}

function reducer(state: typeof initialSettings, action: ACTIONTYPE) {
  let updatedSettings: Settings | null = null;

  switch (action.type) {
    case 'updateTimers':
      const timers = action.payload;
      updatedSettings = {
        ...state,
        timers,
      };
      setToStorage('settings', updatedSettings);
      return updatedSettings;
    case 'updateColor':
      const color = action.payload;
      updatedSettings = {
        ...state,
        selectedColor: color,
      };
      setToStorage('settings', updatedSettings);

      return updatedSettings;

    case 'updateSound':
      const sound = action.payload;
      updatedSettings = {
        ...state,
        selectedSound: sound,
      };
      setToStorage('settings', updatedSettings);

      return updatedSettings;
    case 'updateVolume':
      const volume = action.payload;
      updatedSettings = {
        ...state,
        volume,
      };
      setToStorage('settings', updatedSettings);

      return updatedSettings;
    case 'updateAutostart':
      const autostart = action.payload;
      updatedSettings = {
        ...state,
        autostart,
      };
      setToStorage('settings', updatedSettings);

      return updatedSettings;
    case 'updateNotification':
      const notification = action.payload;
      updatedSettings = {
        ...state,
        notification,
      };

      setToStorage('settings', updatedSettings);

      return updatedSettings;

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
    Notification.requestPermission().then(permission => {
      if (permission === 'denied') {
        dispatch({ type: 'updateNotification', payload: false });
      }
    });
  }, []);

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
