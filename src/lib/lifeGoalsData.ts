import { Religion } from './faithModules';

export interface GoalSuggestion {
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  category: string;
  milestones: { en: string; hi: string }[];
}

export const goalCategories = [
  { key: 'patience', label: { en: 'Patience', hi: 'धैर्य' }, icon: '🕊️' },
  { key: 'community', label: { en: 'Community', hi: 'समुदाय' }, icon: '🤝' },
  { key: 'prayer', label: { en: 'Prayer', hi: 'प्रार्थना' }, icon: '🙏' },
  { key: 'peace', label: { en: 'Inner Peace', hi: 'आंतरिक शांति' }, icon: '☮️' },
  { key: 'discipline', label: { en: 'Discipline', hi: 'अनुशासन' }, icon: '⏰' },
  { key: 'compassion', label: { en: 'Compassion', hi: 'करुणा' }, icon: '❤️' },
];

export const suggestedGoals: Record<string, GoalSuggestion[]> = {
  hindu: [
    { title: { en: 'Practice Daily Dharma', hi: 'दैनिक धर्म का पालन' }, description: { en: 'Follow righteous conduct daily', hi: 'प्रतिदिन धार्मिक आचरण करें' }, category: 'discipline', milestones: [{ en: 'Morning prayer for 7 days', hi: '7 दिन सुबह प्रार्थना' }, { en: 'Read Gita verse daily', hi: 'प्रतिदिन गीता श्लोक पढ़ें' }, { en: 'Practice Ahimsa', hi: 'अहिंसा का अभ्यास' }] },
    { title: { en: 'Develop Inner Peace', hi: 'आंतरिक शांति विकसित करें' }, description: { en: 'Through meditation and yoga', hi: 'ध्यान और योग के माध्यम से' }, category: 'peace', milestones: [{ en: 'Meditate 10 min daily', hi: '10 मिनट दैनिक ध्यान' }, { en: 'Practice Pranayama', hi: 'प्राणायाम करें' }, { en: 'Maintain equanimity', hi: 'समभाव बनाए रखें' }] },
  ],
  muslim: [
    { title: { en: 'Strengthen Character (Akhlaq)', hi: 'चरित्र मजबूत करें (अख़लाक़)' }, description: { en: 'Develop noble character traits', hi: 'उत्तम चरित्र विकसित करें' }, category: 'discipline', milestones: [{ en: 'Pray 5 times daily', hi: '5 वक़्त नमाज़ पढ़ें' }, { en: 'Practice patience (Sabr)', hi: 'सब्र का अभ्यास' }, { en: 'Give charity weekly', hi: 'साप्ताहिक दान' }] },
    { title: { en: 'Increase Taqwa', hi: 'तक़वा बढ़ाएं' }, description: { en: 'God-consciousness in daily life', hi: 'दैनिक जीवन में ईश्वर-चेतना' }, category: 'prayer', milestones: [{ en: 'Recite Quran daily', hi: 'दैनिक क़ुरान पाठ' }, { en: 'Morning Dhikr', hi: 'सुबह ज़िक्र' }, { en: 'Night prayer (Tahajjud)', hi: 'तहज्जुद नमाज़' }] },
  ],
  christian: [
    { title: { en: 'Walk with Christ', hi: 'मसीह के साथ चलें' }, description: { en: 'Deepen your relationship with Jesus', hi: 'यीशु के साथ संबंध गहरा करें' }, category: 'prayer', milestones: [{ en: 'Daily Bible reading', hi: 'दैनिक बाइबल पठन' }, { en: 'Morning prayer', hi: 'सुबह प्रार्थना' }, { en: 'Serve others weekly', hi: 'साप्ताहिक सेवा' }] },
    { title: { en: 'Grow in Love', hi: 'प्रेम में बढ़ें' }, description: { en: 'Practice agape love daily', hi: 'दैनिक निस्वार्थ प्रेम' }, category: 'compassion', milestones: [{ en: 'Forgive someone', hi: 'किसी को क्षमा करें' }, { en: 'Help a neighbor', hi: 'पड़ोसी की मदद' }, { en: 'Practice gratitude', hi: 'कृतज्ञता अभ्यास' }] },
  ],
  buddhist: [
    { title: { en: 'Cultivate Mindfulness', hi: 'सतर्कता विकसित करें' }, description: { en: 'Practice present-moment awareness', hi: 'वर्तमान क्षण जागरूकता' }, category: 'peace', milestones: [{ en: 'Sit meditation 20 min', hi: '20 मिनट ध्यान' }, { en: 'Mindful eating', hi: 'सतर्क भोजन' }, { en: 'Walking meditation', hi: 'चलन ध्यान' }] },
  ],
  jain: [
    { title: { en: 'Practice Non-Violence', hi: 'अहिंसा का अभ्यास' }, description: { en: 'Ahimsa in thought, word and deed', hi: 'विचार, वाणी और कर्म में अहिंसा' }, category: 'compassion', milestones: [{ en: 'Vegetarian commitment', hi: 'शाकाहार प्रतिबद्धता' }, { en: 'Speak kindly always', hi: 'सदैव मृदु वाणी' }, { en: 'Daily Pratikraman', hi: 'दैनिक प्रतिक्रमण' }] },
  ],
  sikh: [
    { title: { en: 'Seva & Simran', hi: 'सेवा और सिमरन' }, description: { en: 'Service to humanity and remembrance of God', hi: 'मानवता की सेवा और ईश्वर स्मरण' }, category: 'community', milestones: [{ en: 'Recite Japji Sahib daily', hi: 'दैनिक जपजी साहिब' }, { en: 'Volunteer at Gurudwara', hi: 'गुरुद्वारा में सेवा' }, { en: 'Practice Langar seva', hi: 'लंगर सेवा' }] },
  ],
  other: [
    { title: { en: 'Build Daily Mindfulness', hi: 'दैनिक सतर्कता बनाएं' }, description: { en: 'Develop awareness and inner peace', hi: 'जागरूकता और शांति विकसित करें' }, category: 'peace', milestones: [{ en: 'Morning meditation', hi: 'सुबह ध्यान' }, { en: 'Gratitude practice', hi: 'कृतज्ञता अभ्यास' }, { en: 'Evening reflection', hi: 'शाम चिंतन' }] },
  ],
};

export const getSuggestedGoals = (religion: Religion): GoalSuggestion[] => {
  return suggestedGoals[religion] || suggestedGoals.other;
};
