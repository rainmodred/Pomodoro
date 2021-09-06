import { SettingsProvider } from './context/SettingsContext';

function getFromStrorage(key: string) {
  const data = window.localStorage.getItem(key);
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

function setToStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

const wrapper = ({ children }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

export { getFromStrorage, setToStorage, wrapper };
