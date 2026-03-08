export interface SleepContent {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  type: 'story' | 'nature' | 'guided';
  religion: string;
  duration: string;
  icon: string;
}

export const sleepContent: SleepContent[] = [
  // Guided meditation
  { id: 'g1', titleEn: 'Body Scan Relaxation', titleHi: 'शरीर स्कैन विश्राम', descEn: 'Progressive body relaxation for deep sleep', descHi: 'गहरी नींद के लिए शरीर विश्राम', type: 'guided', religion: 'other', duration: '15 min', icon: '🧘' },
  { id: 'g2', titleEn: 'Breathing into Sleep', titleHi: 'नींद की सांसें', descEn: 'Gentle breathing exercises for restful sleep', descHi: 'आरामदायक नींद के लिए श्वास व्यायाम', type: 'guided', religion: 'other', duration: '10 min', icon: '🌬️' },
  // Nature sounds
  { id: 'n1', titleEn: 'Rain on Leaves', titleHi: 'पत्तों पर बारिश', descEn: 'Gentle rainfall on a forest canopy', descHi: 'जंगल में कोमल बारिश', type: 'nature', religion: 'other', duration: '30 min', icon: '🌧️' },
  { id: 'n2', titleEn: 'Ocean Waves', titleHi: 'समुद्र की लहरें', descEn: 'Rhythmic ocean waves on a moonlit beach', descHi: 'चांदनी रात में समुद्र की लहरें', type: 'nature', religion: 'other', duration: '30 min', icon: '🌊' },
  { id: 'n3', titleEn: 'Mountain Stream', titleHi: 'पहाड़ी नदी', descEn: 'Flowing water through a peaceful valley', descHi: 'शांत घाटी में बहता पानी', type: 'nature', religion: 'other', duration: '30 min', icon: '🏔️' },
  // Spiritual stories
  { id: 's1', titleEn: 'The Peaceful Garden (Buddhist)', titleHi: 'शांत बगीचा (बौद्ध)', descEn: 'A journey through a calm Buddhist garden', descHi: 'शांत बौद्ध बगीचे की यात्रा', type: 'story', religion: 'buddhist', duration: '12 min', icon: '🌸' },
  { id: 's2', titleEn: 'The Good Shepherd (Christian)', titleHi: 'अच्छा चरवाहा (ईसाई)', descEn: 'A peaceful biblical bedtime reading', descHi: 'शांतिपूर्ण बाइबल कहानी', type: 'story', religion: 'christian', duration: '10 min', icon: '✝️' },
  { id: 's3', titleEn: 'Krishna\'s Flute (Hindu)', titleHi: 'कृष्ण की बांसुरी (हिंदू)', descEn: 'A soothing tale of Krishna playing his flute by the river', descHi: 'नदी किनारे कृष्ण की बांसुरी की मधुर कहानी', type: 'story', religion: 'hindu', duration: '12 min', icon: '🪈' },
  { id: 's4', titleEn: 'Sufi Wisdom Tale (Muslim)', titleHi: 'सूफी ज्ञान कथा (मुस्लिम)', descEn: 'A gentle Sufi parable about trust and peace', descHi: 'विश्वास और शांति पर सूफी कहानी', type: 'story', religion: 'muslim', duration: '10 min', icon: '🌙' },
  { id: 's5', titleEn: 'The Guru\'s Garden (Sikh)', titleHi: 'गुरु का बगीचा (सिख)', descEn: 'A calming story from Sikh tradition', descHi: 'सिख परंपरा से शांत कहानी', type: 'story', religion: 'sikh', duration: '10 min', icon: '☬' },
  { id: 's6', titleEn: 'Path of Ahimsa (Jain)', titleHi: 'अहिंसा का मार्ग (जैन)', descEn: 'A peaceful story about compassion and non-violence', descHi: 'करुणा और अहिंसा की शांत कहानी', type: 'story', religion: 'jain', duration: '10 min', icon: '☸️' },
];

export const getSleepContent = (religion: string): SleepContent[] => {
  return sleepContent.filter(c => c.religion === religion || c.religion === 'other');
};

export const typeLabels: Record<string, { en: string; hi: string }> = {
  story: { en: 'Sleep Stories', hi: 'सोने की कहानियां' },
  nature: { en: 'Nature Sounds', hi: 'प्रकृति ध्वनि' },
  guided: { en: 'Guided Sleep', hi: 'निर्देशित नींद' },
};
