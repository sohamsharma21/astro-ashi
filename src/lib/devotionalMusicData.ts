export interface MusicTrack {
  id: string;
  titleEn: string;
  titleHi: string;
  artist: string;
  religion: string;
  category: 'meditation' | 'prayer' | 'relaxation' | 'chanting' | 'bhajan' | 'nasheed';
  duration: string;
  audioUrl: string;
  ambientId?: string;
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
  { id: 'h7', titleEn: 'Hanuman Chalisa', titleHi: 'हनुमान चालीसा', artist: 'Traditional', religion: 'hindu', category: 'bhajan', duration: '9:30',
    audioUrl: 'https://archive.org/download/hanuman-chalisa-super-fast/Hanuman%20Chalisa%20Super%20Fast.mp3' },
  { id: 'h8', titleEn: 'Mahamrityunjaya Mantra', titleHi: 'महामृत्युंजय मंत्र', artist: 'Vedic Chant', religion: 'hindu', category: 'chanting', duration: '11:00',
    audioUrl: 'https://archive.org/download/mahamrityunjayamantra108times/Mahamrityunjaya%20Mantra%20108%20Times.mp3' },
  { id: 'h9', titleEn: 'Vishnu Sahasranamam', titleHi: 'विष्णु सहस्रनाम', artist: 'Traditional', religion: 'hindu', category: 'prayer', duration: '25:00',
    audioUrl: 'https://archive.org/download/VishnuSahasranama/Vishnu%20Sahasranama.mp3' },
  { id: 'h10', titleEn: 'Aarti Collection', titleHi: 'आरती संग्रह', artist: 'Traditional', religion: 'hindu', category: 'bhajan', duration: '15:00',
    audioUrl: 'https://archive.org/download/om-jai-jagdish-hare-aarti/Om%20Jai%20Jagdish%20Hare%20Aarti.mp3' },
  { id: 'h11', titleEn: 'Rudram Chamakam', titleHi: 'रुद्रम चमकम', artist: 'Vedic Chant', religion: 'hindu', category: 'chanting', duration: '30:00',
    audioUrl: 'https://archive.org/download/ShriRudram/Sri%20Rudram%20-%20Namakam%20%26%20Chamakam.mp3' },
  { id: 'h12', titleEn: 'Krishna Flute Music', titleHi: 'कृष्ण बांसुरी संगीत', artist: 'AstroAshi', religion: 'hindu', category: 'relaxation', duration: '∞',
    audioUrl: '', ambientId: 'flute' },

  // Muslim — archive.org public domain
  { id: 'm1', titleEn: 'Surah Al-Fatiha — Abdul Basit', titleHi: 'सूरह अल-फ़ातिहा — अब्दुल बासित', artist: 'Abdul Basit (Mujawwad)', religion: 'muslim', category: 'prayer', duration: '1:39',
    audioUrl: 'https://archive.org/download/001-al-fatiha-surah-quran-by-abdul-basit-mujawwad-128kb-mp-3/001%20%20AlFatiha%20surah%20Quran%20by%20Abdul%20Basit%20%28%20Mujawwad%20%29%20%20128kb%20mp3.mp3' },
  { id: 'm2', titleEn: 'Sufi Meditation Music', titleHi: 'सूफी ध्यान संगीत', artist: 'Sufi Tradition', religion: 'muslim', category: 'meditation', duration: '∞',
    audioUrl: '', ambientId: 'singing-bowl' },
  { id: 'm3', titleEn: 'Surah Yasin', titleHi: 'सूरह यासीन', artist: 'Abdul Basit', religion: 'muslim', category: 'prayer', duration: '23:00',
    audioUrl: 'https://archive.org/download/036-yasin-surah-quran-by-abdul-basit-mujawwad-128kb-mp-3/036%20%20Yasin%20surah%20Quran%20by%20Abdul%20Basit%20%28%20Mujawwad%20%29%20%20128kb%20mp3.mp3' },
  { id: 'm4', titleEn: 'Surah Rahman', titleHi: 'सूरह रहमान', artist: 'Abdul Basit', religion: 'muslim', category: 'prayer', duration: '12:00',
    audioUrl: 'https://archive.org/download/055-ar-rahman-surah-quran-by-abdul-basit-mujawwad-128kb-mp-3/055%20%20ArRahman%20surah%20Quran%20by%20Abdul%20Basit%20%28%20Mujawwad%20%29%20%20128kb%20mp3.mp3' },
  { id: 'm5', titleEn: 'Asma ul Husna (99 Names)', titleHi: 'अस्मा उल हुस्ना (99 नाम)', artist: 'Traditional', religion: 'muslim', category: 'nasheed', duration: '8:00',
    audioUrl: 'https://archive.org/download/99-names-of-allah/99%20Names%20of%20Allah.mp3' },
  { id: 'm6', titleEn: 'Surah Mulk', titleHi: 'सूरह मुल्क', artist: 'Abdul Basit', religion: 'muslim', category: 'prayer', duration: '7:00',
    audioUrl: 'https://archive.org/download/067-al-mulk-surah-quran-by-abdul-basit-mujawwad-128kb-mp-3/067%20%20AlMulk%20surah%20Quran%20by%20Abdul%20Basit%20%28%20Mujawwad%20%29%20%20128kb%20mp3.mp3' },

  // Christian — archive.org public domain
  { id: 'c1', titleEn: 'The Lord\'s Prayer — Billy Graham', titleHi: 'प्रभु की प्रार्थना — बिली ग्राहम', artist: 'Billy Graham', religion: 'christian', category: 'prayer', duration: '3:20',
    audioUrl: 'https://archive.org/download/78_the-lords-prayer_billy-graham-greater-london-crusade-choir-albert-hay-malotte-clif_gbia0475704b/The%20Lord%27s%20Prayer%20-%20Billy%20Graham.mp3' },
  { id: 'c2', titleEn: 'Peaceful Psalms Meditation', titleHi: 'शांतिपूर्ण भजन ध्यान', artist: 'Christian Meditation', religion: 'christian', category: 'meditation', duration: '∞',
    audioUrl: '', ambientId: 'singing-bowl' },
  { id: 'c3', titleEn: 'Amazing Grace', titleHi: 'अमेज़िंग ग्रेस', artist: 'Traditional Hymn', religion: 'christian', category: 'bhajan', duration: '5:00',
    audioUrl: 'https://archive.org/download/amazing-grace_202001/Amazing%20Grace.mp3' },
  { id: 'c4', titleEn: 'Ave Maria', titleHi: 'एवे मारिया', artist: 'Schubert', religion: 'christian', category: 'prayer', duration: '5:30',
    audioUrl: 'https://archive.org/download/ave-maria-schubert/Ave%20Maria%20-%20Schubert.mp3' },
  { id: 'c5', titleEn: 'How Great Thou Art', titleHi: 'हाउ ग्रेट दाउ आर्ट', artist: 'Traditional Hymn', religion: 'christian', category: 'bhajan', duration: '4:30',
    audioUrl: 'https://archive.org/download/how-great-thou-art/How%20Great%20Thou%20Art.mp3' },

  // Buddhist — archive.org
  { id: 'b1', titleEn: 'Tibetan Buddhist Chants', titleHi: 'तिब्बती बौद्ध मंत्र', artist: 'Tibetan Monks', religion: 'buddhist', category: 'chanting', duration: '55:00',
    audioUrl: 'https://archive.org/download/jamendo-019797/01%20-%20Tibetan%20Incantations-The%20Meditative%20Sound%20Of%20Buddhist%20Chants%20-%20Track%2001.ogg' },
  { id: 'b2', titleEn: 'Tibetan Singing Bowls', titleHi: 'तिब्बती गायन कटोरे', artist: 'AstroAshi', religion: 'buddhist', category: 'meditation', duration: '∞',
    audioUrl: '', ambientId: 'singing-bowl' },
  { id: 'b3', titleEn: 'Om Mani Padme Hum', titleHi: 'ॐ मणि पद्मे हूँ', artist: 'Meditation Temple', religion: 'buddhist', category: 'chanting', duration: '45:00',
    audioUrl: 'https://archive.org/download/mantrachantingmeditation/01%20Om%20Mani%20Padme%20Hum.mp3' },
  { id: 'b4', titleEn: 'Heart Sutra Chanting', titleHi: 'हृदय सूत्र जाप', artist: 'Buddhist Monks', religion: 'buddhist', category: 'chanting', duration: '20:00',
    audioUrl: 'https://archive.org/download/heart-sutra-chanting/Heart%20Sutra.mp3' },

  // Sikh
  { id: 's1', titleEn: 'Waheguru Simran', titleHi: 'वाहेगुरु सिमरन', artist: 'AstroAshi', religion: 'sikh', category: 'chanting', duration: '∞',
    audioUrl: '', ambientId: 'om' },
  { id: 's2', titleEn: 'Japji Sahib', titleHi: 'जपजी साहिब', artist: 'Traditional', religion: 'sikh', category: 'prayer', duration: '22:00',
    audioUrl: 'https://archive.org/download/japji-sahib-path/Japji%20Sahib.mp3' },
  { id: 's3', titleEn: 'Rehras Sahib', titleHi: 'रहरास साहिब', artist: 'Traditional', religion: 'sikh', category: 'prayer', duration: '18:00',
    audioUrl: 'https://archive.org/download/rehras-sahib/Rehras%20Sahib.mp3' },

  // Jain
  { id: 'j1', titleEn: 'Navkar Mantra Meditation', titleHi: 'णमोकार मंत्र ध्यान', artist: 'AstroAshi', religion: 'jain', category: 'chanting', duration: '∞',
    audioUrl: '', ambientId: 'om' },
  { id: 'j2', titleEn: 'Navkar Mantra Chanting', titleHi: 'णमोकार मंत्र जाप', artist: 'Traditional', religion: 'jain', category: 'chanting', duration: '15:00',
    audioUrl: 'https://archive.org/download/navkar-mantra/Navkar%20Mantra.mp3' },

  // Universal — ambient engine
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
  { id: 'u7', titleEn: 'Bamboo Flute', titleHi: 'बांसुरी ध्वनि', artist: 'AstroAshi Ambient', religion: 'other', category: 'relaxation', duration: '∞',
    audioUrl: '', ambientId: 'flute' },
  { id: 'u8', titleEn: 'Thunderstorm', titleHi: 'तूफान', artist: 'AstroAshi Ambient', religion: 'other', category: 'relaxation', duration: '∞',
    audioUrl: '', ambientId: 'thunder' },
  { id: 'u9', titleEn: 'River Stream', titleHi: 'नदी की धारा', artist: 'AstroAshi Ambient', religion: 'other', category: 'relaxation', duration: '∞',
    audioUrl: '', ambientId: 'river' },
  { id: 'u10', titleEn: 'Birds at Dawn', titleHi: 'सुबह की चिड़ियाँ', artist: 'AstroAshi Ambient', religion: 'other', category: 'relaxation', duration: '∞',
    audioUrl: '', ambientId: 'birds' },
];

export const getMusicByReligion = (religion: string): MusicTrack[] => {
  return musicTracks.filter(t => t.religion === religion || t.religion === 'other');
};

export const categoryLabels: Record<string, { en: string; hi: string }> = {
  meditation: { en: 'Meditation', hi: 'ध्यान' },
  prayer: { en: 'Prayer', hi: 'प्रार्थना' },
  relaxation: { en: 'Relaxation', hi: 'विश्राम' },
  chanting: { en: 'Chanting', hi: 'जाप' },
  bhajan: { en: 'Bhajans & Hymns', hi: 'भजन और स्तुति' },
  nasheed: { en: 'Nasheed', hi: 'नशीद' },
};
