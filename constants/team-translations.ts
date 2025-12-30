import type { LanguageCode } from '@/constants/i18n';

const teamTranslations: Record<LanguageCode, Record<string, string>> = {
  en: {},
  ku: {
    Arsenal: 'ئارسەنال',
    'Arsenal FC': 'ئارسەنال',
    Chelsea: 'چێلسیا',
    'Chelsea FC': 'چێلسیا',
    Liverpool: 'لیڤەرپول',
    'Liverpool FC': 'لیڤەرپول',
    'Manchester City': 'مانچێستەر سیتی',
    'Manchester City FC': 'مانچێستەر سیتی',
    'Manchester United': 'مانچێستەر یونایتد',
    'Manchester United FC': 'مانچێستەر یونایتد',
    Tottenham: 'تۆتنهام',
    'Tottenham Hotspur': 'تۆتنهام',
    'Tottenham Hotspur FC': 'تۆتنهام',
    Barcelona: 'بارسێلۆنا',
    'FC Barcelona': 'بارسێلۆنا',
    'Real Madrid': 'ڕیاڵ مەدرید',
    'Real Madrid CF': 'ڕیاڵ مەدرید',
    Juventus: 'یوڤەنتوس',
    'Juventus FC': 'یوڤەنتوس',
    'AC Milan': 'ئێسی میلان',
    'AC Milan FC': 'ئێسی میلان',
    PSG: 'پاریس سەنت ژێرمان',
    'Paris Saint-Germain': 'پاریس سەنت ژێرمان',
    'Paris Saint Germain': 'پاریس سەنت ژێرمان',
    'Paris Saint-Germain FC': 'پاریس سەنت ژێرمان',
    'Paris Saint Germain FC': 'پاریس سەنت ژێرمان',
    'Bayern Munich': 'بایەرن میونیخ',
    'Bayern München': 'بایەرن میونیخ',
    'FC Bayern München': 'بایەرن میونیخ',
    'FC Bayern Munich': 'بایەرن میونیخ',
    Burnley: 'بەرنلی',
    'Burnley FC': 'بەرنلی',
    'Newcastle United': 'نیوکاسڵ یونایتد',
    'Newcastle United FC': 'نیوکاسڵ یونایتد',
    Bournemouth: 'بۆرنموث',
    'AFC Bournemouth': 'بۆرنموث',
    'West Ham': 'وێست هەم',
    'West Ham United': 'وێست هەم یونایتد',
    'West Ham United FC': 'وێست هەم یونایتد',
    Brighton: 'برایتن',
    'Brighton & Hove Albion': 'برایتن',
    'Brighton and Hove Albion': 'برایتن',
    'Brighton & Hove Albion FC': 'برایتن',
    Wolverhampton: 'وولڤرهەمپتون',
    'Wolverhampton Wanderers': 'وولڤرهەمپتون',
    'Wolverhampton Wanderers FC': 'وولڤرهەمپتون',
    'Aston Villa': 'ئاستن ڤیلا',
    'Aston Villa FC': 'ئاستن ڤیلا',
    Everton: 'ئێڤەرٹن',
    'Everton FC': 'ئێڤەرٹن',
    'Nottingham Forest': 'ناتینگهام فۆرێست',
    'Nottingham Forest FC': 'ناتینگهام فۆرێست',
  },
};

function normalizeTeamName(name: string) {
  return name
    .replace(/-/g, ' ')
    .replace(/^FC\s+/i, '')
    .replace(/\s+FC$/i, '')
    .replace(/\s+F\.C\.$/i, '')
    .replace(/\s+F\.C$/i, '')
    .replace(/\s+AFC$/i, '')
    .replace(/\s+CF$/i, '')
    .replace(/\s+SC$/i, '')
    .replace(/\s+AC$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function translateTeam(name: string, language: LanguageCode) {
  const table = teamTranslations[language] ?? {};
  const translation = table[name] ?? table[normalizeTeamName(name)];
  return translation ?? name;
}
