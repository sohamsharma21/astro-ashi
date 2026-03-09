export interface KarmaDeed {
  key: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  points: number;
  category: 'kindness' | 'charity' | 'prayer' | 'service' | 'mindfulness' | 'environment' | 'health' | 'family';
  icon: string;
  religions: string[]; // empty = universal
}

export const karmaDeeds: KarmaDeed[] = [
  // Kindness
  { key: 'help_someone', titleEn: 'Help Someone', titleHi: 'किसी की मदद करें', descEn: 'Assist someone in need today', descHi: 'आज किसी ज़रूरतमंद की मदद करें', points: 10, category: 'kindness', icon: '🤝', religions: [] },
  { key: 'kind_words', titleEn: 'Kind Words', titleHi: 'मीठे बोल', descEn: 'Say something kind to someone', descHi: 'किसी से प्यार भरी बात कहें', points: 5, category: 'kindness', icon: '💬', religions: [] },
  { key: 'smile_stranger', titleEn: 'Smile at a Stranger', titleHi: 'अजनबी को मुस्कुराएं', descEn: 'Brighten someone\'s day with a warm smile', descHi: 'किसी के दिन को मुस्कुराहट से रोशन करें', points: 5, category: 'kindness', icon: '😊', religions: [] },
  { key: 'write_thank_you', titleEn: 'Write a Thank You Note', titleHi: 'धन्यवाद पत्र लिखें', descEn: 'Express gratitude to someone in writing', descHi: 'लिखित में किसी को धन्यवाद दें', points: 10, category: 'kindness', icon: '📝', religions: [] },
  { key: 'listen_deeply', titleEn: 'Listen Deeply', titleHi: 'गहराई से सुनें', descEn: 'Give someone your full attention without interrupting', descHi: 'किसी को बिना बाधा के पूरा ध्यान दें', points: 10, category: 'kindness', icon: '👂', religions: [] },
  { key: 'compliment', titleEn: 'Give a Genuine Compliment', titleHi: 'सच्ची तारीफ करें', descEn: 'Acknowledge someone\'s effort or quality', descHi: 'किसी की मेहनत या गुण की सराहना करें', points: 5, category: 'kindness', icon: '⭐', religions: [] },

  // Charity
  { key: 'donate', titleEn: 'Donate to Charity', titleHi: 'दान करें', descEn: 'Give to a charitable cause', descHi: 'किसी अच्छे काम के लिए दान दें', points: 20, category: 'charity', icon: '💝', religions: [] },
  { key: 'donate_food', titleEn: 'Donate Food', titleHi: 'भोजन दान करें', descEn: 'Share food with the hungry', descHi: 'भूखों को भोजन दें', points: 20, category: 'charity', icon: '🍲', religions: [] },
  { key: 'donate_clothes', titleEn: 'Donate Clothes', titleHi: 'कपड़े दान करें', descEn: 'Give clothes to those in need', descHi: 'ज़रूरतमंदों को कपड़े दें', points: 20, category: 'charity', icon: '👕', religions: [] },
  { key: 'donate_books', titleEn: 'Donate Books', titleHi: 'किताबें दान करें', descEn: 'Share knowledge by donating books', descHi: 'किताबें दान करके ज्ञान बांटें', points: 15, category: 'charity', icon: '📚', religions: [] },

  // Prayer
  { key: 'pray_others', titleEn: 'Pray for Others', titleHi: 'दूसरों के लिए प्रार्थना', descEn: 'Pray or send good wishes for someone', descHi: 'किसी के लिए प्रार्थना या शुभकामनाएं भेजें', points: 10, category: 'prayer', icon: '🙏', religions: [] },
  { key: 'morning_prayer', titleEn: 'Morning Prayer', titleHi: 'सुबह की प्रार्थना', descEn: 'Start your day with a prayer', descHi: 'दिन की शुरुआत प्रार्थना से करें', points: 10, category: 'prayer', icon: '🌅', religions: [] },
  { key: 'evening_prayer', titleEn: 'Evening Prayer', titleHi: 'शाम की प्रार्थना', descEn: 'End your day with gratitude prayer', descHi: 'दिन का अंत कृतज्ञता प्रार्थना से करें', points: 10, category: 'prayer', icon: '🌙', religions: [] },

  // Service
  { key: 'feed_animals', titleEn: 'Feed Animals', titleHi: 'जानवरों को खिलाएं', descEn: 'Feed stray animals or birds', descHi: 'आवारा जानवरों या पक्षियों को खिलाएं', points: 15, category: 'service', icon: '🐾', religions: [] },
  { key: 'volunteer', titleEn: 'Volunteer Work', titleHi: 'सेवा कार्य', descEn: 'Spend time in community service', descHi: 'समाज सेवा में समय दें', points: 25, category: 'service', icon: '🌟', religions: [] },
  { key: 'teach', titleEn: 'Teach Someone', titleHi: 'किसी को सिखाएं', descEn: 'Share knowledge with someone', descHi: 'किसी के साथ ज्ञान साझा करें', points: 15, category: 'service', icon: '📖', religions: [] },
  { key: 'help_elderly', titleEn: 'Help an Elder', titleHi: 'बुज़ुर्ग की मदद करें', descEn: 'Assist an elderly person today', descHi: 'आज किसी बुज़ुर्ग की मदद करें', points: 15, category: 'service', icon: '👴', religions: [] },
  { key: 'clean_public', titleEn: 'Clean a Public Space', titleHi: 'सार्वजनिक स्थान साफ करें', descEn: 'Pick up litter or clean a public area', descHi: 'कूड़ा उठाएं या सार्वजनिक क्षेत्र साफ करें', points: 15, category: 'service', icon: '🧹', religions: [] },

  // Mindfulness
  { key: 'forgive', titleEn: 'Forgive Someone', titleHi: 'किसी को माफ़ करें', descEn: 'Let go of anger and forgive', descHi: 'गुस्सा छोड़ें और माफ़ करें', points: 15, category: 'mindfulness', icon: '☮️', religions: [] },
  { key: 'meditate', titleEn: 'Meditate for Peace', titleHi: 'शांति के लिए ध्यान', descEn: 'Spend 10 minutes in meditation', descHi: '10 मिनट ध्यान करें', points: 10, category: 'mindfulness', icon: '🧘', religions: [] },
  { key: 'digital_detox', titleEn: 'Digital Detox', titleHi: 'डिजिटल डिटॉक्स', descEn: 'Spend 1 hour without phone/screen', descHi: '1 घंटा फोन/स्क्रीन के बिना बिताएं', points: 15, category: 'mindfulness', icon: '📵', religions: [] },
  { key: 'journal_reflect', titleEn: 'Reflect & Journal', titleHi: 'आत्म-चिंतन करें', descEn: 'Write in your spiritual journal', descHi: 'अपनी आध्यात्मिक डायरी में लिखें', points: 10, category: 'mindfulness', icon: '✍️', religions: [] },
  { key: 'practice_patience', titleEn: 'Practice Patience', titleHi: 'धैर्य रखें', descEn: 'Stay calm in a challenging situation', descHi: 'कठिन परिस्थिति में शांत रहें', points: 10, category: 'mindfulness', icon: '🕊️', religions: [] },

  // Environment
  { key: 'plant_tree', titleEn: 'Plant or Water a Tree', titleHi: 'पेड़ लगाएं या पानी दें', descEn: 'Care for nature and the environment', descHi: 'प्रकृति की देखभाल करें', points: 20, category: 'environment', icon: '🌱', religions: [] },
  { key: 'save_water', titleEn: 'Save Water', titleHi: 'पानी बचाएं', descEn: 'Consciously save water today', descHi: 'आज सचेत रूप से पानी बचाएं', points: 10, category: 'environment', icon: '💧', religions: [] },
  { key: 'reduce_waste', titleEn: 'Reduce Waste', titleHi: 'कचरा कम करें', descEn: 'Avoid single-use plastic or reduce waste', descHi: 'सिंगल-यूज प्लास्टिक से बचें या कचरा कम करें', points: 10, category: 'environment', icon: '♻️', religions: [] },
  { key: 'feed_birds', titleEn: 'Feed Birds', titleHi: 'पक्षियों को दाना डालें', descEn: 'Put out water and grains for birds', descHi: 'पक्षियों के लिए पानी और दाना रखें', points: 10, category: 'environment', icon: '🐦', religions: [] },

  // Health
  { key: 'early_rise', titleEn: 'Wake Up Early', titleHi: 'जल्दी उठें', descEn: 'Rise before sunrise for spiritual practice', descHi: 'आध्यात्मिक अभ्यास के लिए सूर्योदय से पहले उठें', points: 10, category: 'health', icon: '🌄', religions: [] },
  { key: 'healthy_meal', titleEn: 'Eat a Sattvic Meal', titleHi: 'सात्विक भोजन करें', descEn: 'Choose a pure, healthy vegetarian meal', descHi: 'शुद्ध, स्वस्थ शाकाहारी भोजन चुनें', points: 10, category: 'health', icon: '🥗', religions: [] },
  { key: 'yoga_practice', titleEn: 'Practice Yoga', titleHi: 'योग करें', descEn: 'Spend 15 minutes doing yoga asanas', descHi: '15 मिनट योग आसन करें', points: 15, category: 'health', icon: '🧎', religions: [] },

  // Family
  { key: 'call_parents', titleEn: 'Call Your Parents', titleHi: 'माता-पिता को फोन करें', descEn: 'Talk to your parents or elders', descHi: 'अपने माता-पिता या बड़ों से बात करें', points: 15, category: 'family', icon: '📞', religions: [] },
  { key: 'family_time', titleEn: 'Quality Family Time', titleHi: 'परिवार के साथ समय बिताएं', descEn: 'Spend meaningful time with family', descHi: 'परिवार के साथ सार्थक समय बिताएं', points: 15, category: 'family', icon: '👨‍👩‍👧‍👦', religions: [] },
  { key: 'cook_family', titleEn: 'Cook for Family', titleHi: 'परिवार के लिए खाना बनाएं', descEn: 'Prepare a meal for your family with love', descHi: 'प्यार से परिवार के लिए खाना बनाएं', points: 15, category: 'family', icon: '🍳', religions: [] },

  // Religion-specific
  { key: 'seva', titleEn: 'Selfless Seva', titleHi: 'निःस्वार्थ सेवा', descEn: 'Serve at a temple, gurdwara or community kitchen', descHi: 'मंदिर, गुरुद्वारे या लंगर में सेवा करें', points: 25, category: 'service', icon: '🙌', religions: ['hindu', 'sikh'] },
  { key: 'zakat', titleEn: 'Give Sadaqah/Zakat', titleHi: 'सदक़ा/ज़कात दें', descEn: 'Give charity as an act of worship', descHi: 'इबादत के रूप में दान दें', points: 25, category: 'charity', icon: '🌙', religions: ['muslim'] },
  { key: 'gau_seva', titleEn: 'Gau Seva (Cow Care)', titleHi: 'गौ सेवा', descEn: 'Feed or care for cows', descHi: 'गायों को चारा डालें या सेवा करें', points: 20, category: 'service', icon: '🐄', religions: ['hindu'] },
  { key: 'tulsi_water', titleEn: 'Water Tulsi Plant', titleHi: 'तुलसी को पानी दें', descEn: 'Water and care for a Tulsi plant', descHi: 'तुलसी के पौधे को पानी दें और देखभाल करें', points: 10, category: 'prayer', icon: '🌿', religions: ['hindu'] },
  { key: 'quran_reading', titleEn: 'Read Quran', titleHi: 'कुरान पढ़ें', descEn: 'Read a page of the Holy Quran', descHi: 'पवित्र कुरान का एक पन्ना पढ़ें', points: 15, category: 'prayer', icon: '📖', religions: ['muslim'] },
  { key: 'bible_reading', titleEn: 'Read Bible', titleHi: 'बाइबल पढ़ें', descEn: 'Read a chapter from the Bible', descHi: 'बाइबल का एक अध्याय पढ़ें', points: 15, category: 'prayer', icon: '✝️', religions: ['christian'] },
  { key: 'path_reading', titleEn: 'Read Guru Granth Sahib', titleHi: 'गुरु ग्रंथ साहिब पाठ', descEn: 'Read from the Guru Granth Sahib', descHi: 'गुरु ग्रंथ साहिब का पाठ करें', points: 15, category: 'prayer', icon: '☬', religions: ['sikh'] },
];

export const getDailyDeeds = (religion: string): KarmaDeed[] => {
  const universal = karmaDeeds.filter(d => d.religions.length === 0);
  const specific = karmaDeeds.filter(d => d.religions.includes(religion));
  const all = [...specific, ...universal];
  // Return 7 deeds for the day, rotating by day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const shuffled = all.sort((a, b) => {
    const ha = (a.key.charCodeAt(0) * 31 + dayOfYear) % 100;
    const hb = (b.key.charCodeAt(0) * 31 + dayOfYear) % 100;
    return ha - hb;
  });
  return shuffled.slice(0, 7);
};

export const categoryLabels: Record<string, { en: string; hi: string }> = {
  kindness: { en: 'Kindness', hi: 'दया' },
  charity: { en: 'Charity', hi: 'दान' },
  prayer: { en: 'Prayer', hi: 'प्रार्थना' },
  service: { en: 'Service', hi: 'सेवा' },
  mindfulness: { en: 'Mindfulness', hi: 'सचेतनता' },
  environment: { en: 'Environment', hi: 'पर्यावरण' },
  health: { en: 'Health', hi: 'स्वास्थ्य' },
  family: { en: 'Family', hi: 'परिवार' },
};
