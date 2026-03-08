import { Religion } from './faithModules';

export interface BadgeDefinition {
  key: string;
  icon: string;
  label: { en: string; hi: string };
  description: { en: string; hi: string };
  category: 'meditation' | 'prayer' | 'gratitude' | 'karma' | 'scripture' | 'routine';
  threshold: number;
  thresholdType: 'streak' | 'total';
}

export const badgeDefinitions: BadgeDefinition[] = [
  // Meditation streaks
  { key: 'meditation-7', icon: '🧘', label: { en: '7-Day Meditation', hi: '7-दिन ध्यान' }, description: { en: '7 day meditation streak', hi: '7 दिन लगातार ध्यान' }, category: 'meditation', threshold: 7, thresholdType: 'streak' },
  { key: 'meditation-15', icon: '🧘‍♀️', label: { en: '15-Day Meditation', hi: '15-दिन ध्यान' }, description: { en: '15 day meditation streak', hi: '15 दिन लगातार ध्यान' }, category: 'meditation', threshold: 15, thresholdType: 'streak' },
  { key: 'meditation-30', icon: '🏅', label: { en: '30-Day Meditation', hi: '30-दिन ध्यान' }, description: { en: '30 day meditation streak', hi: '30 दिन लगातार ध्यान' }, category: 'meditation', threshold: 30, thresholdType: 'streak' },
  { key: 'meditation-45', icon: '🌟', label: { en: '45-Day Meditation', hi: '45-दिन ध्यान' }, description: { en: '45 day meditation streak', hi: '45 दिन लगातार ध्यान' }, category: 'meditation', threshold: 45, thresholdType: 'streak' },
  { key: 'meditation-90', icon: '👑', label: { en: '90-Day Meditation', hi: '90-दिन ध्यान' }, description: { en: '90 day meditation streak', hi: '90 दिन लगातार ध्यान' }, category: 'meditation', threshold: 90, thresholdType: 'streak' },

  // Prayer streaks
  { key: 'prayer-7', icon: '🙏', label: { en: '7-Day Prayer', hi: '7-दिन प्रार्थना' }, description: { en: '7 day prayer streak', hi: '7 दिन लगातार प्रार्थना' }, category: 'prayer', threshold: 7, thresholdType: 'streak' },
  { key: 'prayer-30', icon: '🕊️', label: { en: '30-Day Prayer', hi: '30-दिन प्रार्थना' }, description: { en: '30 day prayer streak', hi: '30 दिन लगातार प्रार्थना' }, category: 'prayer', threshold: 30, thresholdType: 'streak' },

  // Gratitude
  { key: 'gratitude-7', icon: '📝', label: { en: '7-Day Gratitude', hi: '7-दिन कृतज्ञता' }, description: { en: '7 gratitude entries', hi: '7 कृतज्ञता प्रविष्टियां' }, category: 'gratitude', threshold: 7, thresholdType: 'total' },
  { key: 'gratitude-30', icon: '💎', label: { en: 'Gratitude Master', hi: 'कृतज्ञता मास्टर' }, description: { en: '30 gratitude entries', hi: '30 कृतज्ञता प्रविष्टियां' }, category: 'gratitude', threshold: 30, thresholdType: 'total' },

  // Karma / good deeds
  { key: 'karma-25', icon: '💚', label: { en: 'Kind Heart', hi: 'दयालु हृदय' }, description: { en: '25 good deeds', hi: '25 सद्कर्म' }, category: 'karma', threshold: 25, thresholdType: 'total' },
  { key: 'karma-50', icon: '🏆', label: { en: 'Kindness Champion', hi: 'दयालुता चैंपियन' }, description: { en: '50 good deeds', hi: '50 सद्कर्म' }, category: 'karma', threshold: 50, thresholdType: 'total' },
  { key: 'karma-100', icon: '🌈', label: { en: 'Karma Legend', hi: 'कर्म लीजेंड' }, description: { en: '100 good deeds', hi: '100 सद्कर्म' }, category: 'karma', threshold: 100, thresholdType: 'total' },

  // Scripture reading
  { key: 'scripture-7', icon: '📖', label: { en: '7-Day Reader', hi: '7-दिन पाठक' }, description: { en: '7 days of reading', hi: '7 दिन पठन' }, category: 'scripture', threshold: 7, thresholdType: 'total' },
  { key: 'scripture-30', icon: '📚', label: { en: 'Scholar', hi: 'विद्वान' }, description: { en: '30 days of reading', hi: '30 दिन पठन' }, category: 'scripture', threshold: 30, thresholdType: 'total' },

  // Routine
  { key: 'routine-7', icon: '✅', label: { en: '7-Day Routine', hi: '7-दिन दिनचर्या' }, description: { en: '7 day routine streak', hi: '7 दिन लगातार दिनचर्या' }, category: 'routine', threshold: 7, thresholdType: 'streak' },
  { key: 'routine-30', icon: '🔥', label: { en: '30-Day Routine', hi: '30-दिन दिनचर्या' }, description: { en: '30 day routine streak', hi: '30 दिन लगातार दिनचर्या' }, category: 'routine', threshold: 30, thresholdType: 'streak' },
];
