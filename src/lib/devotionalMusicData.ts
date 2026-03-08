export interface MusicTrack {
  id: string;
  titleEn: string;
  titleHi: string;
  artist: string;
  religion: string;
  category: 'meditation' | 'prayer' | 'relaxation' | 'chanting';
  duration: string;
  audioUrl: string;
  ambientId?: string; // maps to ambientSoundEngine preset
}

export const musicTracks: MusicTrack[] = [
  // Hindu — archive.org public domain
  { id: 'h1', titleEn: 'Om Namah Shivaya Mantra', titleHi: 'ॐ नमः शिवाय मंत्र', artist: 'Traditional', religion: 'hindu', category: 'chanting', duration: '71:11',
    audioUrl: 'https://archive.org/download/nvce_om-namah-shivaya-mantra-trance-with-shamanic-drums-powerful-shiv-mantra-meditation-music/OM%20NAMAH%20SHIVAYA%20%20%20Mantra%20Trance%20with%20Shamanic%20Drums%20%20%20Powerful%20Shiv%20Mantra%20Meditation%20Music.mp3' },
  { id: 'h2', titleEn: 'Gayatri Mantra', titleHi: 'गायत्री मंत्र', artist: 'Vedic Chant', religion: 'hindu', category: 'prayer', duration: '4:01',
    audioUrl: 'https://archive.org/download/GayatriMantra_835/Gayatri%20Mantra.mp4' },
  { id: 'h3', titleEn: 'Shiva Prarthana', titleHi: 'शिव प्रार्थना', artist: 'Adi Shankaracharya', religion: 'hindu', category: 'prayer', duration: '2:30',
    audioUrl: 'https://archive.org/download/ShivaStotrasAndMantras/02Shiva%20Prarthana.ogg' },
  { id: 'h4', titleEn: 'Shiva Stuti', titleHi: 'शिव स्तुति', artist: 'Adi Shankaracharya', religion: 'hindu', category: 'chanting', duration: '4:40',
    audioUrl: 'https://archive.org/download/ShivaStotrasAndMantras/04Shiva%20Stuti.ogg' },
  { id: 'h5', titleEn: 'Om Drone Meditation', titleHi: 'ॐ ध्यान ध्वनि', artist: 'AstroAshi', religion: 'hindu', category: 'meditation', duration: '∞',
    audioUrl: '', ambientId: 'om' },
  { id: 'h6', titleEn: 'Temple Bells', titleHi: 'मंदिर की घंटियाँ', artist: 'AstroAshi', religion: 'hindu', category: 'prayer', duration: '∞',
    audioUrl: '', ambientId: 'bells' },

  // Muslim — archive.org public domain
  { id: 'm1', titleEn: 'Surah Al-Fatiha — Abdul Basit', titleHi: 'सूरह अल-फ़ातिहा — अब्दुल बासित', artist: 'Abdul Basit (Mujawwad)', religion: 'muslim', category: 'prayer', duration: '1:39',
    audioUrl: 'https://archive.org/download/001-al-fatiha-surah-quran-by-abdul-basit-mujawwad-128kb-mp-3/001%20%20AlFatiha%20surah%20Quran%20by%20Abdul%20Basit%20%28%20Mujawwad%20%29%20%20128kb%20mp3.mp3' },
  { id: 'm2', titleEn: 'Sufi Meditation Music', titleHi: 'सूफी ध्यान संगीत', artist: 'Sufi Tradition', religion: 'muslim', category: 'meditation', duration: '∞',
    audioUrl: '', ambientId: 'singing-bowl' },

  // Christian — archive.org public domain
  { id: 'c1', titleEn: 'The Lord\'s Prayer — Billy Graham', titleHi: 'प्रभु की प्रार्थना — बिली ग्राहम', artist: 'Billy Graham', religion: 'christian', category: 'prayer', duration: '3:20',
    audioUrl: 'https://archive.org/download/78_the-lords-prayer_billy-graham-greater-london-crusade-choir-albert-hay-malotte-clif_gbia0475704b/The%20Lord%27s%20Prayer%20-%20Billy%20Graham.mp3' },
  { id: 'c2', titleEn: 'Peaceful Psalms Meditation', titleHi: 'शांतिपूर्ण भजन ध्यान', artist: 'Christian Meditation', religion: 'christian', category: 'meditation', duration: '∞',
    audioUrl: '', ambientId: 'singing-bowl' },

  // Buddhist — archive.org
  { id: 'b1', titleEn: 'Tibetan Buddhist Chants', titleHi: 'तिब्बती बौद्ध मंत्र', artist: 'Tibetan Monks', religion: 'buddhist', category: 'chanting', duration: '55:00',
    audioUrl: 'https://archive.org/download/jamendo-019797/01%20-%20Tibetan%20Incantations-The%20Meditative%20Sound%20Of%20Buddhist%20Chants%20-%20Track%2001.ogg' },
  { id: 'b2', titleEn: 'Tibetan Singing Bowls', titleHi: 'तिब्बती गायन कटोरे', artist: 'AstroAshi', religion: 'buddhist', category: 'meditation', duration: '∞',
    audioUrl: '', ambientId: 'singing-bowl' },
  { id: 'b3', titleEn: 'Mantra Meditation Collection', titleHi: 'मंत्र ध्यान संग्रह', artist: 'Meditation Temple', religion: 'buddhist', category: 'chanting', duration: '45:00',
    audioUrl: 'https://archive.org/download/mantrachantingmeditation/01%20Om%20Mani%20Padme%20Hum.mp3' },

  // Sikh — archive.org
  { id: 's1', titleEn: 'Waheguru Simran', titleHi: 'वाहेगुरु सिमरन', artist: 'AstroAshi', religion: 'sikh', category: 'chanting', duration: '∞',
    audioUrl: '', ambientId: 'om' },

  // Jain
  { id: 'j1', titleEn: 'Navkar Mantra Meditation', titleHi: 'णमोकार मंत्र ध्यान', artist: 'AstroAshi', religion: 'jain', category: 'chanting', duration: '∞',
    audioUrl: '', ambientId: 'om' },

  // Universal — ambient engine (works for all religions)
  { id: 'u1', titleEn: 'Deep Rain Relaxation', titleHi: 'गहरी बारिश विश्राम', artist: 'AstroAshi Ambient', religion: 'other', category: 'relaxation', duration: '∞',
    audioUrl: '', ambientId: 'rain' },
  { id: 'u2', titleEn: 'Ocean Waves Meditation', titleHi: 'समुद्री लहरें ध्यान', artist: 'AstroAshi Ambient', religion: 'other', category: 'meditation', duration: '∞',
    audioUrl: '', ambientId: 'ocean' },
  { id: 'u3', titleEn: 'Forest Wind', titleHi: 'वन की हवा', artist: 'AstroAshi Ambient', religion: 'other', category: 'relaxation', duration: '∞',
    audioUrl: '', ambientId: 'wind' },
  { id: 'u4', titleEn: 'Crackling Fire', titleHi: 'जलती आग', artist: 'AstroAshi Ambient', religion: 'other', category: 'relaxation', duration: '∞',
    audioUrl: '', ambientId: 'fire' },
  { id: 'u5', titleEn: 'Night Crickets', titleHi: 'रात के झींगुर', artist: 'AstroAshi Ambient', religion: 'other', category: 'relaxation', duration: '∞',
    audioUrl: '', ambientId: 'crickets' },
  { id: 'u6', titleEn: 'Singing Bowl Meditation', titleHi: 'सिंगिंग बाउल ध्यान', artist: 'AstroAshi Ambient', religion: 'other', category: 'meditation', duration: '∞',
    audioUrl: '', ambientId: 'singing-bowl' },
];

export const getMusicByReligion = (religion: string): MusicTrack[] => {
  return musicTracks.filter(t => t.religion === religion || t.religion === 'other');
};

export const categoryLabels: Record<string, { en: string; hi: string }> = {
  meditation: { en: 'Meditation', hi: 'ध्यान' },
  prayer: { en: 'Prayer', hi: 'प्रार्थना' },
  relaxation: { en: 'Relaxation', hi: 'विश्राम' },
  chanting: { en: 'Chanting', hi: 'जाप' },
};
