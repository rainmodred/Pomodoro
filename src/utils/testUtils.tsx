import { SettingsProvider } from '../context/SettingsContext';

const wrapper: React.FC = ({ children }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

export { wrapper };
