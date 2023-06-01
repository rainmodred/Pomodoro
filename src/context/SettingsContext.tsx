import { createContext, useContext, useEffect, useReducer } from 'react';
import { getFromStorage, setToStorage } from '../utils/utils';
import { Sound, defaultColors } from '../constants';

let root = document.documentElement;

const defaultTimers = {
  pomodoro: 1500,
  'short break': 300,
  'long break': 600,
};

export type DefaultTimers = typeof defaultTimers;

type Settings = {
  timers: DefaultTimers;
  selectedColor: typeof defaultColors[number];
  sound: {
    name: Sound;
    volume: number;
  };
  autostart: boolean;
  notification: boolean;
};

type ACTIONTYPE =
  | {
      type: 'updateSound';
      payload: {
        name: Sound;
        volume: number;
      };
    }
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
  timers: defaultTimers,
  selectedColor: defaultColors[0],
  sound: {
    name: 'Analog Alarm',
    volume: 50,
  },
  autostart: true,
  notification: false,
};

function getInitialState() {
  return getFromStorage('settings') || initialSettings;
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
      const { name, volume } = action.payload;
      updatedSettings = {
        ...state,
        sound: {
          name,
          volume,
        },
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
      let notification = action.payload;
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
    root.style.setProperty('--color-main', settings.selectedColor.hex);
  }, [settings.selectedColor.hex]);

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
