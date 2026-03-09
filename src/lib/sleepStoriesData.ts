export interface SleepContent {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  type: 'story' | 'nature' | 'guided' | 'asmr';
  religion: string;
  duration: string;
  icon: string;
  ambientId?: string;
  audioUrl?: string;
}

export const sleepContent: SleepContent[] = [
  // Guided meditation — ambient engine
  { id: 'g1', titleEn: 'Om Drone Deep Sleep', titleHi: 'ॐ ध्वनि गहरी नींद', descEn: 'Continuous Om vibration for deep relaxation', descHi: 'गहरी नींद के लिए ॐ ध्वनि', type: 'guided', religion: 'other', duration: '∞', icon: '🕉️', ambientId: 'om' },
  { id: 'g2', titleEn: 'Singing Bowl Sleep', titleHi: 'सिंगिंग बाउल नींद', descEn: 'Tibetan singing bowl tones for restful sleep', descHi: 'आरामदायक नींद के लिए सिंगिंग बाउल', type: 'guided', religion: 'other', duration: '∞', icon: '🥣', ambientId: 'singing-bowl' },
  { id: 'g3', titleEn: 'Temple Bells Lullaby', titleHi: 'मंदिर घंटी लोरी', descEn: 'Gentle temple bell chimes for peaceful sleep', descHi: 'शांत नींद के लिए मंदिर घंटी', type: 'guided', religion: 'other', duration: '∞', icon: '🔔', ambientId: 'bells' },
  { id: 'g4', titleEn: 'Flute Sleep Meditation', titleHi: 'बांसुरी नींद ध्यान', descEn: 'Soothing bamboo flute for deep sleep', descHi: 'गहरी नींद के लिए बांसुरी की धुन', type: 'guided', religion: 'other', duration: '∞', icon: '🎵', ambientId: 'flute' },

  // Nature sounds — ambient engine
  { id: 'n1', titleEn: 'Rain on Leaves', titleHi: 'पत्तों पर बारिश', descEn: 'Gentle rainfall on a forest canopy', descHi: 'जंगल में कोमल बारिश', type: 'nature', religion: 'other', duration: '∞', icon: '🌧️', ambientId: 'rain' },
  { id: 'n2', titleEn: 'Ocean Waves', titleHi: 'समुद्र की लहरें', descEn: 'Rhythmic ocean waves on a moonlit beach', descHi: 'चांदनी रात में समुद्र की लहरें', type: 'nature', religion: 'other', duration: '∞', icon: '🌊', ambientId: 'ocean' },
  { id: 'n3', titleEn: 'Forest Wind', titleHi: 'वन की हवा', descEn: 'Whispering wind through tall trees', descHi: 'ऊँचे पेड़ों से गुज़रती हवा', type: 'nature', religion: 'other', duration: '∞', icon: '🌿', ambientId: 'wind' },
  { id: 'n4', titleEn: 'Crackling Campfire', titleHi: 'जलती लकड़ी', descEn: 'Warm crackling fire for cozy nights', descHi: 'आरामदायक रातों के लिए जलती आग', type: 'nature', religion: 'other', duration: '∞', icon: '🔥', ambientId: 'fire' },
  { id: 'n5', titleEn: 'Night Crickets', titleHi: 'रात के झींगुर', descEn: 'Peaceful night cricket chorus', descHi: 'शांत रात के झींगुर', type: 'nature', religion: 'other', duration: '∞', icon: '🦗', ambientId: 'crickets' },
  { id: 'n6', titleEn: 'Thunderstorm Night', titleHi: 'तूफानी रात', descEn: 'Distant thunder with rain for deep sleep', descHi: 'गहरी नींद के लिए दूर की गरज और बारिश', type: 'nature', religion: 'other', duration: '∞', icon: '⛈️', ambientId: 'thunder' },
  { id: 'n7', titleEn: 'River Stream', titleHi: 'नदी की धारा', descEn: 'Gentle flowing river water sounds', descHi: 'बहती नदी की कोमल ध्वनि', type: 'nature', religion: 'other', duration: '∞', icon: '🏞️', ambientId: 'river' },
  { id: 'n8', titleEn: 'Birds at Dawn', titleHi: 'सुबह की चिड़ियाँ', descEn: 'Early morning birdsong chorus', descHi: 'सुबह की चिड़ियों का कलरव', type: 'nature', religion: 'other', duration: '∞', icon: '🐦', ambientId: 'birds' },

  // ASMR / Relaxation
  { id: 'a1', titleEn: 'Gentle Rain + Fire', titleHi: 'बारिश + आग', descEn: 'Cozy rain with crackling fire sounds', descHi: 'बारिश और जलती आग का मिश्रण', type: 'asmr', religion: 'other', duration: '∞', icon: '🏡', ambientId: 'rain' },
  { id: 'a2', titleEn: 'Night Garden', titleHi: 'रात का बगीचा', descEn: 'Crickets, wind and distant water', descHi: 'झींगुर, हवा और दूर का पानी', type: 'asmr', religion: 'other', duration: '∞', icon: '🌺', ambientId: 'crickets' },

  // Spiritual stories — archive.org audio
  { id: 's1', titleEn: 'Tibetan Buddhist Chants', titleHi: 'तिब्बती बौद्ध मंत्र', descEn: 'Meditative sound of Buddhist chants for deep sleep', descHi: 'गहरी नींद के लिए बौद्ध मंत्र', type: 'story', religion: 'buddhist', duration: '55:00', icon: '🌸',
    audioUrl: 'https://archive.org/download/jamendo-019797/01%20-%20Tibetan%20Incantations-The%20Meditative%20Sound%20Of%20Buddhist%20Chants%20-%20Track%2001.ogg' },
  { id: 's2', titleEn: 'The Lord\'s Prayer', titleHi: 'प्रभु की प्रार्थना', descEn: 'Billy Graham\'s peaceful bedtime prayer', descHi: 'बिली ग्राहम की शांतिपूर्ण प्रार्थना', type: 'story', religion: 'christian', duration: '3:20', icon: '✝️',
    audioUrl: 'https://archive.org/download/78_the-lords-prayer_billy-graham-greater-london-crusade-choir-albert-hay-malotte-clif_gbia0475704b/The%20Lord%27s%20Prayer%20-%20Billy%20Graham.mp3' },
  { id: 's3', titleEn: 'Om Namah Shivaya Trance', titleHi: 'ॐ नमः शिवाय ट्रान्स', descEn: 'Soothing Shiva mantra with shamanic drums for sleep', descHi: 'नींद के लिए शिव मंत्र', type: 'story', religion: 'hindu', duration: '71:11', icon: '🪈',
    audioUrl: 'https://archive.org/download/nvce_om-namah-shivaya-mantra-trance-with-shamanic-drums-powerful-shiv-mantra-meditation-music/OM%20NAMAH%20SHIVAYA%20%20%20Mantra%20Trance%20with%20Shamanic%20Drums%20%20%20Powerful%20Shiv%20Mantra%20Meditation%20Music.mp3' },
  { id: 's4', titleEn: 'Surah Al-Fatiha Recitation', titleHi: 'सूरह अल-फ़ातिहा पाठ', descEn: 'Peaceful Quran recitation by Abdul Basit', descHi: 'अब्दुल बासित द्वारा शांत कुरान पाठ', type: 'story', religion: 'muslim', duration: '1:39', icon: '🌙',
    audioUrl: 'https://archive.org/download/001-al-fatiha-surah-quran-by-abdul-basit-mujawwad-128kb-mp-3/001%20%20AlFatiha%20surah%20Quran%20by%20Abdul%20Basit%20%28%20Mujawwad%20%29%20%20128kb%20mp3.mp3' },
  { id: 's5', titleEn: 'Shiva Stuti Chanting', titleHi: 'शिव स्तुति जाप', descEn: 'Ancient Shiva stuti for spiritual sleep', descHi: 'आध्यात्मिक नींद के लिए शिव स्तुति', type: 'story', religion: 'hindu', duration: '4:40', icon: '🔱',
    audioUrl: 'https://archive.org/download/ShivaStotrasAndMantras/04Shiva%20Stuti.ogg' },
  { id: 's6', titleEn: 'Om Mani Padme Hum', titleHi: 'ॐ मणि पद्मे हूँ', descEn: 'Buddhist mantra chanting for peaceful sleep', descHi: 'शांत नींद के लिए बौद्ध मंत्र', type: 'story', religion: 'buddhist', duration: '45:00', icon: '☸️',
    audioUrl: 'https://archive.org/download/mantrachantingmeditation/01%20Om%20Mani%20Padme%20Hum.mp3' },
  { id: 's7', titleEn: 'Waheguru Meditation', titleHi: 'वाहेगुरु ध्यान', descEn: 'Calming Waheguru vibration for sleep', descHi: 'नींद के लिए शांत वाहेगुरु ध्वनि', type: 'story', religion: 'sikh', duration: '∞', icon: '☬', ambientId: 'om' },
  { id: 's8', titleEn: 'Navkar Mantra Drone', titleHi: 'णमोकार मंत्र ध्वनि', descEn: 'Meditative Om drone inspired by Jain tradition', descHi: 'जैन परंपरा से प्रेरित ॐ ध्वनि', type: 'story', religion: 'jain', duration: '∞', icon: '🙏', ambientId: 'om' },
  { id: 's9', titleEn: 'Surah Rahman for Sleep', titleHi: 'सूरह रहमान (नींद)', descEn: 'Soothing Quran recitation for peaceful sleep', descHi: 'शांत नींद के लिए कुरान पाठ', type: 'story', religion: 'muslim', duration: '12:00', icon: '☪️',
    audioUrl: 'https://archive.org/download/055-ar-rahman-surah-quran-by-abdul-basit-mujawwad-128kb-mp-3/055%20%20ArRahman%20surah%20Quran%20by%20Abdul%20Basit%20%28%20Mujawwad%20%29%20%20128kb%20mp3.mp3' },
  { id: 's10', titleEn: 'Gayatri Mantra for Sleep', titleHi: 'गायत्री मंत्र (नींद)', descEn: 'Gentle Gayatri Mantra chanting for rest', descHi: 'आराम के लिए गायत्री मंत्र', type: 'story', religion: 'hindu', duration: '4:01', icon: '🙏',
    audioUrl: 'https://archive.org/download/GayatriMantra_835/Gayatri%20Mantra.mp4' },
];

export const getSleepContent = (religion: string): SleepContent[] => {
  return sleepContent.filter(c => c.religion === religion || c.religion === 'other');
};

export const typeLabels: Record<string, { en: string; hi: string }> = {
  story: { en: 'Sleep Stories', hi: 'सोने की कहानियां' },
  nature: { en: 'Nature Sounds', hi: 'प्रकृति ध्वनि' },
  guided: { en: 'Guided Sleep', hi: 'निर्देशित नींद' },
  asmr: { en: 'ASMR & Ambient', hi: 'ASMR और एम्बिएंट' },
};
