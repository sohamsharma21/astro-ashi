import { Religion } from './faithModules';

export interface RoutineItem {
  key: string;
  label: { en: string; hi: string };
  defaultTime: string;
  religion: Religion;
  icon: string;
}

export const routinesByReligion: Record<string, RoutineItem[]> = {
  muslim: [
    { key: 'fajr', label: { en: 'Fajr Prayer', hi: 'फज्र नमाज़' }, defaultTime: '05:00', religion: 'muslim', icon: '🌅' },
    { key: 'dhuhr', label: { en: 'Dhuhr Prayer', hi: 'ज़ुहर नमाज़' }, defaultTime: '12:30', religion: 'muslim', icon: '☀️' },
    { key: 'asr', label: { en: 'Asr Prayer', hi: 'अस्र नमाज़' }, defaultTime: '15:30', religion: 'muslim', icon: '🌤️' },
    { key: 'maghrib', label: { en: 'Maghrib Prayer', hi: 'मग़रिब नमाज़' }, defaultTime: '18:30', religion: 'muslim', icon: '🌅' },
    { key: 'isha', label: { en: 'Isha Prayer', hi: 'इशा नमाज़' }, defaultTime: '20:00', religion: 'muslim', icon: '🌙' },
  ],
  hindu: [
    { key: 'morning-puja', label: { en: 'Morning Puja', hi: 'सुबह की पूजा' }, defaultTime: '06:00', religion: 'hindu', icon: '🪔' },
    { key: 'evening-aarti', label: { en: 'Evening Aarti', hi: 'शाम की आरती' }, defaultTime: '18:30', religion: 'hindu', icon: '🕯️' },
    { key: 'meditation', label: { en: 'Meditation / Dhyana', hi: 'ध्यान साधना' }, defaultTime: '05:30', religion: 'hindu', icon: '🧘' },
    { key: 'mantra-jaap', label: { en: 'Mantra Jaap', hi: 'मंत्र जाप' }, defaultTime: '07:00', religion: 'hindu', icon: '📿' },
  ],
  christian: [
    { key: 'morning-prayer', label: { en: 'Morning Prayer', hi: 'सुबह की प्रार्थना' }, defaultTime: '06:30', religion: 'christian', icon: '🙏' },
    { key: 'evening-prayer', label: { en: 'Evening Prayer', hi: 'शाम की प्रार्थना' }, defaultTime: '20:00', religion: 'christian', icon: '🕊️' },
    { key: 'bible-reading', label: { en: 'Bible Reading', hi: 'बाइबल पठन' }, defaultTime: '07:00', religion: 'christian', icon: '📖' },
  ],
  buddhist: [
    { key: 'morning-meditation', label: { en: 'Morning Meditation', hi: 'सुबह ध्यान' }, defaultTime: '06:00', religion: 'buddhist', icon: '☸️' },
    { key: 'mindfulness-check', label: { en: 'Mindfulness Reminder', hi: 'सतर्कता अनुस्मारक' }, defaultTime: '12:00', religion: 'buddhist', icon: '🔔' },
    { key: 'evening-meditation', label: { en: 'Evening Meditation', hi: 'शाम ध्यान' }, defaultTime: '19:00', religion: 'buddhist', icon: '🌿' },
  ],
  jain: [
    { key: 'pratikraman', label: { en: 'Pratikraman', hi: 'प्रतिक्रमण' }, defaultTime: '18:00', religion: 'jain', icon: '🪷' },
    { key: 'samayik', label: { en: 'Samayik Meditation', hi: 'सामायिक ध्यान' }, defaultTime: '06:00', religion: 'jain', icon: '🧘' },
    { key: 'navkar-mantra', label: { en: 'Navkar Mantra', hi: 'णमोकार मंत्र' }, defaultTime: '05:30', religion: 'jain', icon: '📿' },
  ],
  sikh: [
    { key: 'japji-sahib', label: { en: 'Japji Sahib', hi: 'जपजी साहिब' }, defaultTime: '05:00', religion: 'sikh', icon: '📖' },
    { key: 'rehras-sahib', label: { en: 'Rehras Sahib', hi: 'रहरास साहिब' }, defaultTime: '18:00', religion: 'sikh', icon: '🙏' },
    { key: 'kirtan-sohila', label: { en: 'Kirtan Sohila', hi: 'कीर्तन सोहिला' }, defaultTime: '21:00', religion: 'sikh', icon: '🌙' },
  ],
  other: [
    { key: 'morning-gratitude', label: { en: 'Morning Gratitude', hi: 'सुबह कृतज्ञता' }, defaultTime: '07:00', religion: 'other', icon: '🌅' },
    { key: 'midday-mindfulness', label: { en: 'Midday Mindfulness', hi: 'दोपहर सतर्कता' }, defaultTime: '12:00', religion: 'other', icon: '🧘' },
    { key: 'evening-reflection', label: { en: 'Evening Reflection', hi: 'शाम चिंतन' }, defaultTime: '20:00', religion: 'other', icon: '🌙' },
  ],
};

export const getRoutinesForReligion = (religion: Religion): RoutineItem[] => {
  return routinesByReligion[religion] || routinesByReligion.other;
};
