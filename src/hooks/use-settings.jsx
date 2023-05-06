import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import defaultSettings from "const/settings";

const SettingsContext = createContext(defaultSettings);

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const setter = useCallback(
    (s) => setSettings((cur) => ({ ...cur, ...s })),
    []
  );
  const contextValue = useMemo(() => [settings, setter], [setter, settings]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

function useSettings() {
  return useContext(SettingsContext);
}

SettingsProvider.propTypes = {
  children: PropTypes.element,
};

SettingsProvider.defaultProps = {
  children: null,
};

export { SettingsProvider, useSettings };
