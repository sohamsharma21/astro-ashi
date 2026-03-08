export interface MusicTrack {
  id: string;
  titleEn: string;
  titleHi: string;
  artist: string;
  religion: string;
  category: 'meditation' | 'prayer' | 'relaxation' | 'chanting';
  duration: string;
  audioUrl: string; // placeholder — will use actual URLs later
}

export const musicTracks: MusicTrack[] = [
  // Hindu
  { id: 'h1', titleEn: 'Om Namah Shivaya', titleHi: 'ॐ नमः शिवाय', artist: 'Traditional', religion: 'hindu', category: 'chanting', duration: '5:30', audioUrl: '' },
  { id: 'h2', titleEn: 'Gayatri Mantra', titleHi: 'गायत्री मंत्र', artist: 'Vedic Chant', religion: 'hindu', category: 'prayer', duration: '4:15', audioUrl: '' },
  { id: 'h3', titleEn: 'Aarti - Om Jai Jagdish', titleHi: 'आरती - ॐ जय जगदीश', artist: 'Traditional', religion: 'hindu', category: 'prayer', duration: '6:00', audioUrl: '' },
  { id: 'h4', titleEn: 'Krishna Bhajan', titleHi: 'कृष्ण भजन', artist: 'Devotional', religion: 'hindu', category: 'prayer', duration: '5:00', audioUrl: '' },
  // Muslim
  { id: 'm1', titleEn: 'Quran Recitation - Al-Fatiha', titleHi: 'क़ुरान पाठ - अल-फ़ातिहा', artist: 'Qari', religion: 'muslim', category: 'prayer', duration: '3:00', audioUrl: '' },
  { id: 'm2', titleEn: 'Nasheed - Peace Be Upon You', titleHi: 'नशीद - सलाम', artist: 'Nasheed Artist', religion: 'muslim', category: 'chanting', duration: '4:30', audioUrl: '' },
  { id: 'm3', titleEn: 'Sufi Meditation', titleHi: 'सूफी ध्यान', artist: 'Sufi Tradition', religion: 'muslim', category: 'meditation', duration: '7:00', audioUrl: '' },
  // Christian
  { id: 'c1', titleEn: 'Amazing Grace', titleHi: 'अमेज़िंग ग्रेस', artist: 'Church Choir', religion: 'christian', category: 'prayer', duration: '4:00', audioUrl: '' },
  { id: 'c2', titleEn: 'Hallelujah Chorus', titleHi: 'हेलेलूया', artist: 'Gospel', religion: 'christian', category: 'chanting', duration: '5:45', audioUrl: '' },
  { id: 'c3', titleEn: 'Peaceful Psalms', titleHi: 'शांतिपूर्ण भजन', artist: 'Christian Meditation', religion: 'christian', category: 'meditation', duration: '8:00', audioUrl: '' },
  // Buddhist
  { id: 'b1', titleEn: 'Om Mani Padme Hum', titleHi: 'ॐ मणि पद्मे हूँ', artist: 'Buddhist Monks', religion: 'buddhist', category: 'chanting', duration: '6:00', audioUrl: '' },
  { id: 'b2', titleEn: 'Tibetan Singing Bowls', titleHi: 'तिब्बती गायन कटोरे', artist: 'Meditation', religion: 'buddhist', category: 'meditation', duration: '10:00', audioUrl: '' },
  // Sikh
  { id: 's1', titleEn: 'Waheguru Simran', titleHi: 'वाहेगुरु सिमरन', artist: 'Gurbani', religion: 'sikh', category: 'chanting', duration: '5:00', audioUrl: '' },
  { id: 's2', titleEn: 'Japji Sahib', titleHi: 'जपजी साहिब', artist: 'Gurbani Kirtan', religion: 'sikh', category: 'prayer', duration: '15:00', audioUrl: '' },
  // Jain
  { id: 'j1', titleEn: 'Navkar Mantra', titleHi: 'णमोकार मंत्र', artist: 'Jain Tradition', religion: 'jain', category: 'chanting', duration: '3:30', audioUrl: '' },
  // Universal
  { id: 'u1', titleEn: 'Deep Relaxation', titleHi: 'गहरा विश्राम', artist: 'Ambient', religion: 'other', category: 'relaxation', duration: '12:00', audioUrl: '' },
  { id: 'u2', titleEn: 'Inner Peace Meditation', titleHi: 'आंतरिक शांति ध्यान', artist: 'Ambient', religion: 'other', category: 'meditation', duration: '10:00', audioUrl: '' },
  { id: 'u3', titleEn: 'Nature & Spirit', titleHi: 'प्रकृति और आत्मा', artist: 'Ambient', religion: 'other', category: 'relaxation', duration: '8:00', audioUrl: '' },
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
