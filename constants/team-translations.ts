import type { LanguageCode } from '@/constants/i18n';

const teamTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {},
  ku: {
    Arsenal: 'Arsenal',
    Chelsea: 'Chelsea',
    Liverpool: 'Liverpool',
    'Manchester City': 'Man City',
    'Manchester United': 'Man United',
    Tottenham: 'Tottenham',
    Barcelona: 'Barcelona',
    'Real Madrid': 'Real Madrid',
    Juventus: 'Juventus',
    'AC Milan': 'AC Milan',
    PSG: 'PSG',
    'Bayern Munich': 'Bayern',
  },
};

export function translateTeam(name: string, language: LanguageCode) {
  const translation = teamTranslations[language]?.[name];
  return translation ?? name;
}
