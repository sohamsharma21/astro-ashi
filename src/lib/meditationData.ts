import { Religion } from './faithModules';

export interface MeditationSession {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  duration: number; // minutes
  category: string;
  religion?: Religion | 'general';
  icon: string;
}

export const meditations: MeditationSession[] = [
  {
    id: 'quick-calm',
    title: { en: '5-Minute Calm', hi: '5 मिनट शांति' },
    description: { en: 'A quick reset for your mind. Focus on your breath and let go.', hi: 'अपने मन को शांत करें। सांस पर ध्यान दें।' },
    duration: 5,
    category: 'mindfulness',
    religion: 'general',
    icon: '🧘'
  },
  {
    id: 'deep-focus',
    title: { en: '10-Minute Deep Focus', hi: '10 मिनट गहरा ध्यान' },
    description: { en: 'A deeper meditation for clarity and inner peace.', hi: 'स्पष्टता और आंतरिक शांति के लिए गहरा ध्यान।' },
    duration: 10,
    category: 'mindfulness',
    religion: 'general',
    icon: '🌿'
  },
  {
    id: 'breathing',
    title: { en: 'Breathing Exercise', hi: 'श्वास व्यायाम' },
    description: { en: 'Box breathing technique to reduce stress and anxiety.', hi: 'तनाव और चिंता कम करने की बॉक्स ब्रीदिंग तकनीक।' },
    duration: 5,
    category: 'breathing',
    religion: 'general',
    icon: '🌬️'
  },
  {
    id: 'stress-relief',
    title: { en: 'Stress Relief', hi: 'तनाव मुक्ति' },
    description: { en: 'Release tension from your body and mind with guided relaxation.', hi: 'निर्देशित विश्राम से शरीर और मन का तनाव दूर करें।' },
    duration: 10,
    category: 'stress',
    religion: 'general',
    icon: '☮️'
  },
  {
    id: 'sleep',
    title: { en: 'Sleep Meditation', hi: 'नींद ध्यान' },
    description: { en: 'Drift into peaceful sleep with calming visualization.', hi: 'शांत कल्पना के साथ गहरी नींद में जाएं।' },
    duration: 15,
    category: 'sleep',
    religion: 'general',
    icon: '🌙'
  },
  {
    id: 'hindu-dhyana',
    title: { en: 'Hindu Dhyana Meditation', hi: 'हिंदू ध्यान साधना' },
    description: { en: 'Traditional Vedic meditation with Om chanting visualization.', hi: 'ॐ जप दृश्य के साथ पारंपरिक वैदिक ध्यान।' },
    duration: 10,
    category: 'spiritual',
    religion: 'hindu',
    icon: '🕉️'
  },
  {
    id: 'islamic-reflection',
    title: { en: 'Islamic Reflection (Muraqaba)', hi: 'इस्लामिक चिंतन (मुराक़बा)' },
    description: { en: 'Contemplation and remembrance of Allah through peaceful reflection.', hi: 'शांतिपूर्ण चिंतन के माध्यम से अल्लाह का स्मरण।' },
    duration: 10,
    category: 'spiritual',
    religion: 'muslim',
    icon: '☪️'
  },
  {
    id: 'christian-prayer',
    title: { en: 'Christian Silent Prayer', hi: 'ईसाई मौन प्रार्थना' },
    description: { en: 'Centering prayer — be still and know the presence of God.', hi: 'केंद्रित प्रार्थना — शांत रहें और ईश्वर की उपस्थिति जानें।' },
    duration: 10,
    category: 'spiritual',
    religion: 'christian',
    icon: '✝️'
  },
  {
    id: 'buddhist-mindfulness',
    title: { en: 'Buddhist Mindfulness (Vipassana)', hi: 'बौद्ध सतर्कता (विपश्यना)' },
    description: { en: 'Insight meditation — observe thoughts without attachment.', hi: 'अंतर्दृष्टि ध्यान — बिना आसक्ति के विचार देखें।' },
    duration: 15,
    category: 'spiritual',
    religion: 'buddhist',
    icon: '☸️'
  },
  {
    id: 'sikh-simran',
    title: { en: 'Sikh Simran Meditation', hi: 'सिख सिमरन ध्यान' },
    description: { en: 'Meditative remembrance of Waheguru through Naam Simran.', hi: 'नाम सिमरन के माध्यम से वाहेगुरु का ध्यान।' },
    duration: 10,
    category: 'spiritual',
    religion: 'sikh',
    icon: '🙏'
  },
  {
    id: 'jain-kayotsarga',
    title: { en: 'Jain Kayotsarga', hi: 'जैन कायोत्सर्ग' },
    description: { en: 'Body detachment meditation for spiritual purification.', hi: 'आध्यात्मिक शुद्धि के लिए शरीर वियोग ध्यान।' },
    duration: 10,
    category: 'spiritual',
    religion: 'jain',
    icon: '🪷'
  }
];

export const getRecommendedMeditations = (religion: Religion): MeditationSession[] => {
  const religionSpecific = meditations.filter(m => m.religion === religion);
  const general = meditations.filter(m => m.religion === 'general');
  return [...religionSpecific, ...general];
};
