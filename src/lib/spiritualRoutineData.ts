import { Religion } from './faithModules';

export interface RoutineItem {
  key: string;
  label: { en: string; hi: string };
  defaultTime: string;
  religion: Religion;
  icon: string;
  timeBlock: 'morning' | 'afternoon' | 'evening';
}

export const routinesByReligion: Record<string, RoutineItem[]> = {
  muslim: [
    { key: 'fajr', label: { en: 'Fajr Prayer', hi: 'फज्र नमाज़' }, defaultTime: '05:00', religion: 'muslim', icon: '🌅', timeBlock: 'morning' },
    { key: 'quran-morning', label: { en: 'Quran Reading', hi: 'क़ुरान पठन' }, defaultTime: '05:30', religion: 'muslim', icon: '📖', timeBlock: 'morning' },
    { key: 'morning-dhikr', label: { en: 'Morning Dhikr', hi: 'सुबह ज़िक्र' }, defaultTime: '06:00', religion: 'muslim', icon: '📿', timeBlock: 'morning' },
    { key: 'dhuhr', label: { en: 'Dhuhr Prayer', hi: 'ज़ुहर नमाज़' }, defaultTime: '12:30', religion: 'muslim', icon: '☀️', timeBlock: 'afternoon' },
    { key: 'asr', label: { en: 'Asr Prayer', hi: 'अस्र नमाज़' }, defaultTime: '15:30', religion: 'muslim', icon: '🌤️', timeBlock: 'afternoon' },
    { key: 'good-deed-muslim', label: { en: 'Daily Good Deed', hi: 'दैनिक नेक काम' }, defaultTime: '14:00', religion: 'muslim', icon: '💚', timeBlock: 'afternoon' },
    { key: 'maghrib', label: { en: 'Maghrib Prayer', hi: 'मग़रिब नमाज़' }, defaultTime: '18:30', religion: 'muslim', icon: '🌅', timeBlock: 'evening' },
    { key: 'isha', label: { en: 'Isha Prayer', hi: 'इशा नमाज़' }, defaultTime: '20:00', religion: 'muslim', icon: '🌙', timeBlock: 'evening' },
    { key: 'evening-reflection-muslim', label: { en: 'Evening Reflection', hi: 'शाम चिंतन' }, defaultTime: '21:00', religion: 'muslim', icon: '🤲', timeBlock: 'evening' },
  ],
  hindu: [
    { key: 'morning-puja', label: { en: 'Morning Puja', hi: 'सुबह की पूजा' }, defaultTime: '06:00', religion: 'hindu', icon: '🪔', timeBlock: 'morning' },
    { key: 'meditation', label: { en: 'Meditation / Dhyana', hi: 'ध्यान साधना' }, defaultTime: '05:30', religion: 'hindu', icon: '🧘', timeBlock: 'morning' },
    { key: 'mantra-jaap', label: { en: 'Mantra Jaap', hi: 'मंत्र जाप' }, defaultTime: '07:00', religion: 'hindu', icon: '📿', timeBlock: 'morning' },
    { key: 'scripture-reading-hindu', label: { en: 'Scripture Reading', hi: 'ग्रंथ पठन' }, defaultTime: '07:30', religion: 'hindu', icon: '📖', timeBlock: 'morning' },
    { key: 'mindfulness-hindu', label: { en: 'Mindfulness Reminder', hi: 'सतर्कता अनुस्मारक' }, defaultTime: '12:00', religion: 'hindu', icon: '🔔', timeBlock: 'afternoon' },
    { key: 'good-deed-hindu', label: { en: 'Daily Good Deed', hi: 'दैनिक सद्कर्म' }, defaultTime: '14:00', religion: 'hindu', icon: '💚', timeBlock: 'afternoon' },
    { key: 'evening-aarti', label: { en: 'Evening Aarti', hi: 'शाम की आरती' }, defaultTime: '18:30', religion: 'hindu', icon: '🕯️', timeBlock: 'evening' },
    { key: 'gratitude-hindu', label: { en: 'Gratitude Reflection', hi: 'कृतज्ञता चिंतन' }, defaultTime: '21:00', religion: 'hindu', icon: '🙏', timeBlock: 'evening' },
  ],
  christian: [
    { key: 'morning-prayer', label: { en: 'Morning Prayer', hi: 'सुबह की प्रार्थना' }, defaultTime: '06:30', religion: 'christian', icon: '🙏', timeBlock: 'morning' },
    { key: 'bible-reading', label: { en: 'Bible Reading', hi: 'बाइबल पठन' }, defaultTime: '07:00', religion: 'christian', icon: '📖', timeBlock: 'morning' },
    { key: 'daily-inspiration-christian', label: { en: 'Daily Inspiration', hi: 'दैनिक प्रेरणा' }, defaultTime: '08:00', religion: 'christian', icon: '✨', timeBlock: 'morning' },
    { key: 'good-deed-christian', label: { en: 'Act of Kindness', hi: 'दयालुता का कार्य' }, defaultTime: '13:00', religion: 'christian', icon: '💚', timeBlock: 'afternoon' },
    { key: 'mindfulness-christian', label: { en: 'Midday Reflection', hi: 'दोपहर चिंतन' }, defaultTime: '12:00', religion: 'christian', icon: '🕊️', timeBlock: 'afternoon' },
    { key: 'evening-prayer', label: { en: 'Evening Prayer', hi: 'शाम की प्रार्थना' }, defaultTime: '20:00', religion: 'christian', icon: '🕊️', timeBlock: 'evening' },
    { key: 'gratitude-christian', label: { en: 'Gratitude Journal', hi: 'कृतज्ञता डायरी' }, defaultTime: '21:00', religion: 'christian', icon: '📝', timeBlock: 'evening' },
  ],
  buddhist: [
    { key: 'morning-meditation', label: { en: 'Morning Meditation', hi: 'सुबह ध्यान' }, defaultTime: '06:00', religion: 'buddhist', icon: '☸️', timeBlock: 'morning' },
    { key: 'sutra-reading', label: { en: 'Sutra Reading', hi: 'सूत्र पठन' }, defaultTime: '07:00', religion: 'buddhist', icon: '📖', timeBlock: 'morning' },
    { key: 'mindfulness-check', label: { en: 'Mindfulness Reminder', hi: 'सतर्कता अनुस्मारक' }, defaultTime: '12:00', religion: 'buddhist', icon: '🔔', timeBlock: 'afternoon' },
    { key: 'good-deed-buddhist', label: { en: 'Compassionate Act', hi: 'करुणा कार्य' }, defaultTime: '14:00', religion: 'buddhist', icon: '💚', timeBlock: 'afternoon' },
    { key: 'evening-meditation', label: { en: 'Evening Meditation', hi: 'शाम ध्यान' }, defaultTime: '19:00', religion: 'buddhist', icon: '🌿', timeBlock: 'evening' },
    { key: 'gratitude-buddhist', label: { en: 'Gratitude Practice', hi: 'कृतज्ञता अभ्यास' }, defaultTime: '21:00', religion: 'buddhist', icon: '🙏', timeBlock: 'evening' },
  ],
  jain: [
    { key: 'samayik', label: { en: 'Samayik Meditation', hi: 'सामायिक ध्यान' }, defaultTime: '06:00', religion: 'jain', icon: '🧘', timeBlock: 'morning' },
    { key: 'navkar-mantra', label: { en: 'Navkar Mantra', hi: 'णमोकार मंत्र' }, defaultTime: '05:30', religion: 'jain', icon: '📿', timeBlock: 'morning' },
    { key: 'scripture-jain', label: { en: 'Agam Reading', hi: 'आगम पठन' }, defaultTime: '07:00', religion: 'jain', icon: '📖', timeBlock: 'morning' },
    { key: 'mindfulness-jain', label: { en: 'Mindfulness Check', hi: 'सतर्कता जांच' }, defaultTime: '12:00', religion: 'jain', icon: '🔔', timeBlock: 'afternoon' },
    { key: 'pratikraman', label: { en: 'Pratikraman', hi: 'प्रतिक्रमण' }, defaultTime: '18:00', religion: 'jain', icon: '🪷', timeBlock: 'evening' },
    { key: 'gratitude-jain', label: { en: 'Evening Reflection', hi: 'शाम चिंतन' }, defaultTime: '21:00', religion: 'jain', icon: '🙏', timeBlock: 'evening' },
  ],
  sikh: [
    { key: 'japji-sahib', label: { en: 'Japji Sahib', hi: 'जपजी साहिब' }, defaultTime: '05:00', religion: 'sikh', icon: '📖', timeBlock: 'morning' },
    { key: 'morning-ardas', label: { en: 'Morning Ardas', hi: 'सुबह अरदास' }, defaultTime: '06:00', religion: 'sikh', icon: '🙏', timeBlock: 'morning' },
    { key: 'seva-sikh', label: { en: 'Seva (Service)', hi: 'सेवा' }, defaultTime: '13:00', religion: 'sikh', icon: '💚', timeBlock: 'afternoon' },
    { key: 'rehras-sahib', label: { en: 'Rehras Sahib', hi: 'रहरास साहिब' }, defaultTime: '18:00', religion: 'sikh', icon: '🙏', timeBlock: 'evening' },
    { key: 'kirtan-sohila', label: { en: 'Kirtan Sohila', hi: 'कीर्तन सोहिला' }, defaultTime: '21:00', religion: 'sikh', icon: '🌙', timeBlock: 'evening' },
  ],
  other: [
    { key: 'morning-gratitude', label: { en: 'Morning Gratitude', hi: 'सुबह कृतज्ञता' }, defaultTime: '07:00', religion: 'other', icon: '🌅', timeBlock: 'morning' },
    { key: 'morning-meditation-other', label: { en: 'Meditation', hi: 'ध्यान' }, defaultTime: '07:30', religion: 'other', icon: '🧘', timeBlock: 'morning' },
    { key: 'inspiration-reading', label: { en: 'Inspiration Reading', hi: 'प्रेरणा पठन' }, defaultTime: '08:00', religion: 'other', icon: '📖', timeBlock: 'morning' },
    { key: 'midday-mindfulness', label: { en: 'Midday Mindfulness', hi: 'दोपहर सतर्कता' }, defaultTime: '12:00', religion: 'other', icon: '🧘', timeBlock: 'afternoon' },
    { key: 'good-deed-other', label: { en: 'Good Deed', hi: 'सद्कर्म' }, defaultTime: '14:00', religion: 'other', icon: '💚', timeBlock: 'afternoon' },
    { key: 'evening-reflection', label: { en: 'Evening Reflection', hi: 'शाम चिंतन' }, defaultTime: '20:00', religion: 'other', icon: '🌙', timeBlock: 'evening' },
    { key: 'gratitude-other', label: { en: 'Gratitude Journal', hi: 'कृतज्ञता डायरी' }, defaultTime: '21:00', religion: 'other', icon: '📝', timeBlock: 'evening' },
  ],
};

export const getRoutinesForReligion = (religion: Religion): RoutineItem[] => {
  return routinesByReligion[religion] || routinesByReligion.other;
};

export const getRoutinesByTimeBlock = (religion: Religion): Record<string, RoutineItem[]> => {
  const routines = getRoutinesForReligion(religion);
  return {
    morning: routines.filter(r => r.timeBlock === 'morning'),
    afternoon: routines.filter(r => r.timeBlock === 'afternoon'),
    evening: routines.filter(r => r.timeBlock === 'evening'),
  };
};

export const timeBlockLabels = {
  morning: { en: '🌅 Morning', hi: '🌅 सुबह' },
  afternoon: { en: '☀️ Afternoon', hi: '☀️ दोपहर' },
  evening: { en: '🌙 Evening', hi: '🌙 शाम' },
};
