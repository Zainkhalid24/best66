import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { translations, type LanguageCode } from '@/constants/i18n';
import { translateTeam } from '@/constants/team-translations';

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
  tTeam: (name: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'best6:language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!isMounted || !value) {
          return;
        }
        if (value === 'en' || value === 'ku') {
          setLanguageState(value);
        }
      })
      .catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = (value: LanguageCode) => {
    setLanguageState(value);
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => undefined);
  };

  const t = (key: string) => translations[language]?.[key] ?? key;
  const tTeam = (name: string) => translateTeam(name, language);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      tTeam,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
