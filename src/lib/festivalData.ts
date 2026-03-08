import { Religion } from './faithModules';

export interface Festival {
  id: string;
  name: { en: string; hi: string };
  date: string; // MM-DD approximate
  religion: Religion;
  description: { en: string; hi: string };
  practices: { en: string[]; hi: string[] };
}

export const festivals: Festival[] = [
  // Hindu
  { id: 'diwali', name: { en: 'Diwali', hi: 'दीपावली' }, date: '10-20', religion: 'hindu', description: { en: 'Festival of lights celebrating the victory of good over evil and light over darkness.', hi: 'अंधकार पर प्रकाश और बुराई पर अच्छाई की जीत का त्योहार।' }, practices: { en: ['Light diyas and candles', 'Perform Lakshmi puja', 'Share sweets with family', 'Fireworks and rangoli'], hi: ['दीये और मोमबत्तियाँ जलाएं', 'लक्ष्मी पूजा करें', 'परिवार के साथ मिठाई बांटें', 'पटाखे और रंगोली'] } },
  { id: 'navratri', name: { en: 'Navratri', hi: 'नवरात्रि' }, date: '10-03', religion: 'hindu', description: { en: 'Nine nights of worship dedicated to Goddess Durga.', hi: 'देवी दुर्गा को समर्पित पूजा की नौ रातें।' }, practices: { en: ['Fast during nine days', 'Garba and Dandiya dance', 'Worship nine forms of Durga', 'Kanya pujan'], hi: ['नौ दिन उपवास', 'गरबा और डांडिया नृत्य', 'दुर्गा के नौ रूपों की पूजा', 'कन्या पूजन'] } },
  { id: 'holi', name: { en: 'Holi', hi: 'होली' }, date: '03-14', religion: 'hindu', description: { en: 'Festival of colors celebrating spring and the triumph of good.', hi: 'रंगों का त्योहार, वसंत और अच्छाई की विजय का उत्सव।' }, practices: { en: ['Play with colors', 'Holika dahan bonfire', 'Drink thandai', 'Forgive and celebrate'], hi: ['रंगों से खेलें', 'होलिका दहन', 'ठंडाई पिएं', 'क्षमा करें और मनाएं'] } },
  { id: 'janmashtami', name: { en: 'Janmashtami', hi: 'जन्माष्टमी' }, date: '08-26', religion: 'hindu', description: { en: 'Celebration of Lord Krishna\'s birth.', hi: 'भगवान कृष्ण के जन्म का उत्सव।' }, practices: { en: ['Midnight celebration', 'Fast until midnight', 'Dahi handi', 'Bhajans and kirtans'], hi: ['मध्यरात्रि उत्सव', 'मध्यरात्रि तक उपवास', 'दही हांडी', 'भजन और कीर्तन'] } },
  // Muslim
  { id: 'ramadan', name: { en: 'Ramadan', hi: 'रमज़ान' }, date: '03-10', religion: 'muslim', description: { en: 'Holy month of fasting, prayer, and reflection.', hi: 'उपवास, प्रार्थना और चिंतन का पवित्र महीना।' }, practices: { en: ['Fast from dawn to sunset', 'Increased Quran reading', 'Tarawih prayers', 'Charity and giving'], hi: ['सुबह से शाम तक उपवास', 'क़ुरान पाठ बढ़ाएं', 'तरावीह नमाज़', 'दान और सेवा'] } },
  { id: 'eid-ul-fitr', name: { en: 'Eid ul-Fitr', hi: 'ईद उल-फ़ित्र' }, date: '04-10', religion: 'muslim', description: { en: 'Festival marking the end of Ramadan fasting.', hi: 'रमज़ान के उपवास की समाप्ति का त्योहार।' }, practices: { en: ['Eid prayer', 'Wear new clothes', 'Share meals with community', 'Give Zakat al-Fitr'], hi: ['ईद की नमाज़', 'नए कपड़े पहनें', 'समुदाय के साथ भोजन साझा करें', 'ज़कात अल-फ़ित्र दें'] } },
  { id: 'eid-ul-adha', name: { en: 'Eid ul-Adha', hi: 'ईद उल-अज़हा' }, date: '06-17', religion: 'muslim', description: { en: 'Festival of sacrifice honoring Ibrahim\'s devotion.', hi: 'इब्राहीम की भक्ति का सम्मान करने वाला बलिदान का त्योहार।' }, practices: { en: ['Eid prayer', 'Qurbani (sacrifice)', 'Share meat with poor', 'Family gatherings'], hi: ['ईद की नमाज़', 'क़ुर्बानी', 'गरीबों को मांस बांटें', 'पारिवारिक सभाएं'] } },
  // Christian
  { id: 'christmas', name: { en: 'Christmas', hi: 'क्रिसमस' }, date: '12-25', religion: 'christian', description: { en: 'Celebration of the birth of Jesus Christ.', hi: 'ईसा मसीह के जन्म का उत्सव।' }, practices: { en: ['Attend church service', 'Exchange gifts', 'Carol singing', 'Family feast'], hi: ['चर्च सेवा में भाग लें', 'उपहार बांटें', 'कैरोल गाएं', 'पारिवारिक भोज'] } },
  { id: 'easter', name: { en: 'Easter', hi: 'ईस्टर' }, date: '04-20', religion: 'christian', description: { en: 'Celebration of the resurrection of Jesus Christ.', hi: 'ईसा मसीह के पुनरुत्थान का उत्सव।' }, practices: { en: ['Sunrise service', 'Easter egg hunt', 'Church attendance', 'Family meal'], hi: ['सूर्योदय सेवा', 'ईस्टर एग हंट', 'चर्च जाना', 'पारिवारिक भोजन'] } },
  { id: 'good-friday', name: { en: 'Good Friday', hi: 'गुड फ्राइडे' }, date: '04-18', religion: 'christian', description: { en: 'Observance of the crucifixion of Jesus Christ.', hi: 'ईसा मसीह के सूली पर चढ़ने का स्मरण।' }, practices: { en: ['Attend church service', 'Fasting and abstinence', 'Stations of the Cross', 'Prayer and reflection'], hi: ['चर्च सेवा', 'उपवास', 'क्रॉस के स्टेशन', 'प्रार्थना और चिंतन'] } },
  // Buddhist
  { id: 'vesak', name: { en: 'Vesak (Buddha Purnima)', hi: 'वेसाक (बुद्ध पूर्णिमा)' }, date: '05-12', religion: 'buddhist', description: { en: 'Celebrates the birth, enlightenment, and passing of Buddha.', hi: 'बुद्ध के जन्म, ज्ञान प्राप्ति और परिनिर्वाण का उत्सव।' }, practices: { en: ['Visit temple', 'Meditation', 'Acts of kindness', 'Offer flowers and incense'], hi: ['मंदिर जाएं', 'ध्यान करें', 'दयालुता के कार्य', 'फूल और धूप अर्पित करें'] } },
  // Jain
  { id: 'paryushan', name: { en: 'Paryushan', hi: 'पर्युषण' }, date: '08-20', religion: 'jain', description: { en: 'Eight days of intensive fasting, prayer, and self-reflection.', hi: 'आठ दिन का गहन उपवास, प्रार्थना और आत्म-चिंतन।' }, practices: { en: ['Fasting', 'Forgiveness prayers', 'Self-discipline', 'Non-violence pledge'], hi: ['उपवास', 'क्षमा प्रार्थना', 'आत्म-अनुशासन', 'अहिंसा प्रतिज्ञा'] } },
  // Sikh
  { id: 'guru-nanak', name: { en: 'Guru Nanak Jayanti', hi: 'गुरु नानक जयंती' }, date: '11-15', religion: 'sikh', description: { en: 'Birthday of Guru Nanak, the founder of Sikhism.', hi: 'सिख धर्म के संस्थापक गुरु नानक का जन्मदिन।' }, practices: { en: ['Visit Gurudwara', 'Prabhat Pheri procession', 'Langar (community meal)', 'Kirtan and prayer'], hi: ['गुरुद्वारा जाएं', 'प्रभात फेरी जुलूस', 'लंगर', 'कीर्तन और प्रार्थना'] } },
  { id: 'vaisakhi', name: { en: 'Vaisakhi', hi: 'वैसाखी' }, date: '04-13', religion: 'sikh', description: { en: 'Sikh New Year and formation of Khalsa.', hi: 'सिख नव वर्ष और खालसा की स्थापना।' }, practices: { en: ['Visit Gurudwara', 'Nagar Kirtan procession', 'Community service', 'Cultural programs'], hi: ['गुरुद्वारा जाएं', 'नगर कीर्तन जुलूस', 'सामुदायिक सेवा', 'सांस्कृतिक कार्यक्रम'] } },
];

export const getUpcomingFestivals = (religion?: Religion, limit = 5): Festival[] => {
  const now = new Date();
  const currentMMDD = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const sorted = [...festivals].sort((a, b) => {
    const aNext = a.date >= currentMMDD ? a.date : `${parseInt(a.date.split('-')[0]) + 12}-${a.date.split('-')[1]}`;
    const bNext = b.date >= currentMMDD ? b.date : `${parseInt(b.date.split('-')[0]) + 12}-${b.date.split('-')[1]}`;
    return aNext.localeCompare(bNext);
  });

  if (religion && religion !== 'other') {
    return sorted.filter(f => f.religion === religion).slice(0, limit);
  }
  return sorted.slice(0, limit);
};

export const getDaysUntil = (dateMMDD: string): number => {
  const now = new Date();
  const [month, day] = dateMMDD.split('-').map(Number);
  let festivalDate = new Date(now.getFullYear(), month - 1, day);
  if (festivalDate < now) festivalDate = new Date(now.getFullYear() + 1, month - 1, day);
  return Math.ceil((festivalDate.getTime() - now.getTime()) / 86400000);
};
