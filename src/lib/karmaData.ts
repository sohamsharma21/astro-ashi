export interface KarmaDeed {
  key: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  points: number;
  category: 'kindness' | 'charity' | 'prayer' | 'service' | 'mindfulness';
  icon: string;
  religions: string[]; // empty = universal
}

export const karmaDeeds: KarmaDeed[] = [
  { key: 'help_someone', titleEn: 'Help Someone', titleHi: 'किसी की मदद करें', descEn: 'Assist someone in need today', descHi: 'आज किसी ज़रूरतमंद की मदद करें', points: 10, category: 'kindness', icon: '🤝', religions: [] },
  { key: 'donate', titleEn: 'Donate to Charity', titleHi: 'दान करें', descEn: 'Give to a charitable cause', descHi: 'किसी अच्छे काम के लिए दान दें', points: 20, category: 'charity', icon: '💝', religions: [] },
  { key: 'feed_animals', titleEn: 'Feed Animals', titleHi: 'जानवरों को खिलाएं', descEn: 'Feed stray animals or birds', descHi: 'आवारा जानवरों या पक्षियों को खिलाएं', points: 15, category: 'kindness', icon: '🐾', religions: [] },
  { key: 'pray_others', titleEn: 'Pray for Others', titleHi: 'दूसरों के लिए प्रार्थना', descEn: 'Pray or send good wishes for someone', descHi: 'किसी के लिए प्रार्थना या शुभकामनाएं भेजें', points: 10, category: 'prayer', icon: '🙏', religions: [] },
  { key: 'volunteer', titleEn: 'Volunteer Work', titleHi: 'सेवा कार्य', descEn: 'Spend time in community service', descHi: 'समाज सेवा में समय दें', points: 25, category: 'service', icon: '🌟', religions: [] },
  { key: 'kind_words', titleEn: 'Kind Words', titleHi: 'मीठे बोल', descEn: 'Say something kind to someone', descHi: 'किसी से प्यार भरी बात कहें', points: 5, category: 'kindness', icon: '💬', religions: [] },
  { key: 'forgive', titleEn: 'Forgive Someone', titleHi: 'किसी को माफ़ करें', descEn: 'Let go of anger and forgive', descHi: 'गुस्सा छोड़ें और माफ़ करें', points: 15, category: 'mindfulness', icon: '☮️', religions: [] },
  { key: 'plant_tree', titleEn: 'Plant or Water a Tree', titleHi: 'पेड़ लगाएं या पानी दें', descEn: 'Care for nature and the environment', descHi: 'प्रकृति की देखभाल करें', points: 20, category: 'service', icon: '🌱', religions: [] },
  { key: 'teach', titleEn: 'Teach Someone', titleHi: 'किसी को सिखाएं', descEn: 'Share knowledge with someone', descHi: 'किसी के साथ ज्ञान साझा करें', points: 15, category: 'service', icon: '📚', religions: [] },
  { key: 'meditate', titleEn: 'Meditate for Peace', titleHi: 'शांति के लिए ध्यान', descEn: 'Spend 10 minutes in meditation', descHi: '10 मिनट ध्यान करें', points: 10, category: 'mindfulness', icon: '🧘', religions: [] },
  { key: 'seva', titleEn: 'Selfless Seva', titleHi: 'निःस्वार्थ सेवा', descEn: 'Serve at a temple, gurdwara or community kitchen', descHi: 'मंदिर, गुरुद्वारे या लंगर में सेवा करें', points: 25, category: 'service', icon: '🙌', religions: ['hindu', 'sikh'] },
  { key: 'zakat', titleEn: 'Give Sadaqah/Zakat', titleHi: 'सदक़ा/ज़कात दें', descEn: 'Give charity as an act of worship', descHi: 'इबादत के रूप में दान दें', points: 25, category: 'charity', icon: '🌙', religions: ['muslim'] },
];

export const getDailyDeeds = (religion: string): KarmaDeed[] => {
  const universal = karmaDeeds.filter(d => d.religions.length === 0);
  const specific = karmaDeeds.filter(d => d.religions.includes(religion));
  const all = [...specific, ...universal];
  // Return 5 deeds for the day, rotating by day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const shuffled = all.sort((a, b) => {
    const ha = (a.key.charCodeAt(0) * 31 + dayOfYear) % 100;
    const hb = (b.key.charCodeAt(0) * 31 + dayOfYear) % 100;
    return ha - hb;
  });
  return shuffled.slice(0, 5);
};

export const categoryLabels: Record<string, { en: string; hi: string }> = {
  kindness: { en: 'Kindness', hi: 'दया' },
  charity: { en: 'Charity', hi: 'दान' },
  prayer: { en: 'Prayer', hi: 'प्रार्थना' },
  service: { en: 'Service', hi: 'सेवा' },
  mindfulness: { en: 'Mindfulness', hi: 'सचेतनता' },
};
