import { ReactNode } from 'react';
import { SettingsProvider } from '../context/SettingsContext';

const wrapper = ({ children }: { children: ReactNode }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

export { wrapper };
