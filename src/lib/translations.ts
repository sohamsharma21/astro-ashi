
import { ZodiacSign } from './constants';

type TranslationKey = 'zodiacSigns' | 'navItems' | 'errorMessages' | 'formLabels';

const translations: Record<TranslationKey, Record<string, { en: string; hi: string }>> = {
  zodiacSigns: {
    aries: { en: 'Aries', hi: 'मेष' },
    taurus: { en: 'Taurus', hi: 'वृषभ' },
    gemini: { en: 'Gemini', hi: 'मिथुन' },
    cancer: { en: 'Cancer', hi: 'कर्क' },
    leo: { en: 'Leo', hi: 'सिंह' },
    virgo: { en: 'Virgo', hi: 'कन्या' },
    libra: { en: 'Libra', hi: 'तुला' },
    scorpio: { en: 'Scorpio', hi: 'वृश्चिक' },
    sagittarius: { en: 'Sagittarius', hi: 'धनु' },
    capricorn: { en: 'Capricorn', hi: 'मकर' },
    aquarius: { en: 'Aquarius', hi: 'कुंभ' },
    pisces: { en: 'Pisces', hi: 'मीन' }
  },
  navItems: {
    home: { en: 'Home', hi: 'होम' },
    dailyHoroscope: { en: 'Daily Horoscope', hi: 'दैनिक राशिफल' },
    kundli: { en: 'Kundli', hi: 'कुंडली' },
    compatibility: { en: 'Compatibility', hi: 'संगतता' },
    
    journal: { en: 'Journal', hi: 'जर्नल' },
    history: { en: 'History', hi: 'इतिहास' },
    profile: { en: 'Profile', hi: 'प्रोफाइल' },
    about: { en: 'About', hi: 'हमारे बारे में' },
    contact: { en: 'Contact', hi: 'संपर्क करें' },
    signin: { en: 'Sign In', hi: 'साइन इन' },
    signout: { en: 'Sign Out', hi: 'साइन आउट' },
    consultations: { en: 'Consultations', hi: 'परामर्श' }
  },
  errorMessages: {
    loginFailed: { en: 'Login failed. Please check your credentials.', hi: 'लॉगिन विफल। कृपया अपने प्रमाण पत्र जांचें।' },
    networkError: { en: 'Network error. Please try again.', hi: 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।' },
    dataLoadFailed: { en: 'Failed to load data.', hi: 'डेटा लोड करने में विफल।' },
    required: { en: 'This field is required.', hi: 'यह फ़ील्ड आवश्यक है।' },
    invalidEmail: { en: 'Invalid email address.', hi: 'अमान्य ईमेल पता।' },
    invalidDate: { en: 'Invalid date.', hi: 'अमान्य तिथि।' },
    passwordMismatch: { en: 'Passwords do not match.', hi: 'पासवर्ड मेल नहीं खाते।' },
    serverError: { en: 'Server error. Please try again later.', hi: 'सर्वर त्रुटि। कृपया बाद में पुन: प्रयास करें।' }
  },
  formLabels: {
    name: { en: 'Name', hi: 'नाम' },
    email: { en: 'Email', hi: 'ईमेल' },
    phone: { en: 'Phone', hi: 'फोन' },
    birthDate: { en: 'Birth Date', hi: 'जन्म तिथि' },
    birthTime: { en: 'Birth Time', hi: 'जन्म समय' },
    birthPlace: { en: 'Birth Place', hi: 'जन्म स्थान' },
    password: { en: 'Password', hi: 'पासवर्ड' },
    confirmPassword: { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि करें' },
    submit: { en: 'Submit', hi: 'सबमिट करें' },
    cancel: { en: 'Cancel', hi: 'रद्द करें' },
    save: { en: 'Save', hi: 'सहेजें' },
    loading: { en: 'Loading...', hi: 'लोड हो रहा है...' },
    search: { en: 'Search', hi: 'खोज' }
  }
};

export const getTranslation = (
  category: TranslationKey,
  key: string,
  language: 'en' | 'hi'
): string => {
  if (translations[category] && translations[category][key]) {
    return translations[category][key][language];
  }
  return key; // Fallback to key if translation not found
};

export const getZodiacSignName = (sign: ZodiacSign, language: 'en' | 'hi'): string => {
  return getTranslation('zodiacSigns', sign, language);
};
