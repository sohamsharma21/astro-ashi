import { Religion } from './faithModules';

export interface Festival {
  id: string;
  name: { en: string; hi: string };
  date: string; // MM-DD (2025 accurate dates)
  religion: Religion;
  description: { en: string; hi: string };
  practices: { en: string[]; hi: string[] };
}

export const festivals: Festival[] = [
  // ===== HINDU =====
  { id: 'makar-sankranti', name: { en: 'Makar Sankranti', hi: 'मकर संक्रांति' }, date: '01-14', religion: 'hindu', description: { en: 'Harvest festival marking the sun\'s transition into Capricorn.', hi: 'सूर्य के मकर राशि में प्रवेश का त्योहार।' }, practices: { en: ['Fly kites', 'Eat til-gur sweets', 'Take holy dip in river', 'Donate to needy'], hi: ['पतंग उड़ाएं', 'तिल-गुड़ खाएं', 'पवित्र नदी में स्नान', 'दान करें'] } },
  { id: 'basant-panchami', name: { en: 'Basant Panchami', hi: 'बसंत पंचमी' }, date: '02-02', religion: 'hindu', description: { en: 'Celebration of spring and worship of Goddess Saraswati.', hi: 'वसंत ऋतु और देवी सरस्वती की पूजा।' }, practices: { en: ['Wear yellow clothes', 'Worship Saraswati', 'Fly kites', 'Start new learning'], hi: ['पीले कपड़े पहनें', 'सरस्वती पूजा', 'पतंग उड़ाएं', 'नई शिक्षा शुरू करें'] } },
  { id: 'maha-shivratri', name: { en: 'Maha Shivratri', hi: 'महा शिवरात्रि' }, date: '02-26', religion: 'hindu', description: { en: 'The great night of Lord Shiva — fasting, meditation and worship.', hi: 'भगवान शिव की महान रात — उपवास, ध्यान और पूजा।' }, practices: { en: ['All-night vigil', 'Fast and meditate', 'Offer bel patra to Shiva', 'Chant Om Namah Shivaya'], hi: ['रात भर जागरण', 'उपवास और ध्यान', 'शिव को बेलपत्र अर्पित करें', 'ॐ नमः शिवाय का जाप'] } },
  { id: 'holi', name: { en: 'Holi', hi: 'होली' }, date: '03-14', religion: 'hindu', description: { en: 'Festival of colors celebrating spring and the triumph of good.', hi: 'रंगों का त्योहार, वसंत और अच्छाई की विजय का उत्सव।' }, practices: { en: ['Play with colors', 'Holika dahan bonfire', 'Drink thandai', 'Forgive and celebrate'], hi: ['रंगों से खेलें', 'होलिका दहन', 'ठंडाई पिएं', 'क्षमा करें और मनाएं'] } },
  { id: 'ram-navami', name: { en: 'Ram Navami', hi: 'राम नवमी' }, date: '04-06', religion: 'hindu', description: { en: 'Birthday of Lord Rama, the seventh avatar of Vishnu.', hi: 'भगवान राम के जन्म का उत्सव।' }, practices: { en: ['Read Ramayana', 'Visit temple', 'Fast and pray', 'Bhajan kirtan'], hi: ['रामायण पढ़ें', 'मंदिर जाएं', 'उपवास और प्रार्थना', 'भजन कीर्तन'] } },
  { id: 'raksha-bandhan', name: { en: 'Raksha Bandhan', hi: 'रक्षाबंधन' }, date: '08-09', religion: 'hindu', description: { en: 'Festival celebrating the bond between siblings.', hi: 'भाई-बहन के प्रेम का त्योहार।' }, practices: { en: ['Sister ties rakhi on brother\'s wrist', 'Exchange gifts', 'Family feast', 'Pray for protection'], hi: ['बहन भाई की कलाई पर राखी बांधे', 'उपहार दें', 'पारिवारिक भोज', 'रक्षा की प्रार्थना'] } },
  { id: 'janmashtami', name: { en: 'Janmashtami', hi: 'जन्माष्टमी' }, date: '08-16', religion: 'hindu', description: { en: 'Celebration of Lord Krishna\'s birth.', hi: 'भगवान कृष्ण के जन्म का उत्सव।' }, practices: { en: ['Midnight celebration', 'Fast until midnight', 'Dahi handi', 'Bhajans and kirtans'], hi: ['मध्यरात्रि उत्सव', 'मध्यरात्रि तक उपवास', 'दही हांडी', 'भजन और कीर्तन'] } },
  { id: 'ganesh-chaturthi', name: { en: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी' }, date: '08-27', religion: 'hindu', description: { en: 'Birthday of Lord Ganesha, the remover of obstacles.', hi: 'विघ्नहर्ता भगवान गणेश का जन्मोत्सव।' }, practices: { en: ['Install Ganesh idol', 'Offer modak sweets', 'Chant Ganesh mantras', 'Visarjan procession'], hi: ['गणेश प्रतिमा स्थापित करें', 'मोदक अर्पित करें', 'गणेश मंत्र जाप', 'विसर्जन जुलूस'] } },
  { id: 'navratri', name: { en: 'Navratri', hi: 'नवरात्रि' }, date: '09-22', religion: 'hindu', description: { en: 'Nine nights of worship dedicated to Goddess Durga.', hi: 'देवी दुर्गा को समर्पित पूजा की नौ रातें।' }, practices: { en: ['Fast during nine days', 'Garba and Dandiya dance', 'Worship nine forms of Durga', 'Kanya pujan'], hi: ['नौ दिन उपवास', 'गरबा और डांडिया नृत्य', 'दुर्गा के नौ रूपों की पूजा', 'कन्या पूजन'] } },
  { id: 'dussehra', name: { en: 'Dussehra', hi: 'दशहरा' }, date: '10-02', religion: 'hindu', description: { en: 'Victory of Lord Rama over Ravana — triumph of good over evil.', hi: 'भगवान राम की रावण पर विजय — अच्छाई की बुराई पर जीत।' }, practices: { en: ['Watch Ramlila', 'Burn Ravana effigies', 'Worship weapons', 'Visit temple'], hi: ['रामलीला देखें', 'रावण दहन', 'शस्त्र पूजन', 'मंदिर जाएं'] } },
  { id: 'karwa-chauth', name: { en: 'Karwa Chauth', hi: 'करवा चौथ' }, date: '10-10', religion: 'hindu', description: { en: 'Married women fast for their husband\'s long life.', hi: 'विवाहित महिलाएं पति की लंबी उम्र के लिए उपवास करती हैं।' }, practices: { en: ['Fast from sunrise to moonrise', 'Apply mehndi', 'Pray to the moon', 'Break fast after seeing moon'], hi: ['सूर्योदय से चंद्रोदय तक उपवास', 'मेहंदी लगाएं', 'चंद्रमा को अर्घ्य दें', 'चांद देखकर उपवास तोड़ें'] } },
  { id: 'diwali', name: { en: 'Diwali', hi: 'दीपावली' }, date: '10-20', religion: 'hindu', description: { en: 'Festival of lights celebrating the victory of good over evil and light over darkness.', hi: 'अंधकार पर प्रकाश और बुराई पर अच्छाई की जीत का त्योहार।' }, practices: { en: ['Light diyas and candles', 'Perform Lakshmi puja', 'Share sweets with family', 'Fireworks and rangoli'], hi: ['दीये और मोमबत्तियाँ जलाएं', 'लक्ष्मी पूजा करें', 'परिवार के साथ मिठाई बांटें', 'पटाखे और रंगोली'] } },
  { id: 'chhath', name: { en: 'Chhath Puja', hi: 'छठ पूजा' }, date: '10-26', religion: 'hindu', description: { en: 'Ancient festival dedicated to the Sun God and Chhathi Maiya.', hi: 'सूर्य देव और छठी मइया को समर्पित प्राचीन त्योहार।' }, practices: { en: ['Offer arghya to rising/setting sun', 'Fast for 36 hours', 'Stand in water', 'Prepare thekua prasad'], hi: ['उगते/डूबते सूर्य को अर्घ्य दें', '36 घंटे का उपवास', 'पानी में खड़े होकर पूजा', 'ठेकुआ प्रसाद बनाएं'] } },

  // ===== MUSLIM =====
  { id: 'ramadan-2025', name: { en: 'Ramadan', hi: 'रमज़ान' }, date: '02-28', religion: 'muslim', description: { en: 'Holy month of fasting, prayer, and reflection.', hi: 'उपवास, प्रार्थना और चिंतन का पवित्र महीना।' }, practices: { en: ['Fast from dawn to sunset', 'Increased Quran reading', 'Tarawih prayers', 'Charity and giving'], hi: ['सुबह से शाम तक उपवास', 'क़ुरान पाठ बढ़ाएं', 'तरावीह नमाज़', 'दान और सेवा'] } },
  { id: 'eid-ul-fitr-2025', name: { en: 'Eid ul-Fitr', hi: 'ईद उल-फ़ित्र' }, date: '03-30', religion: 'muslim', description: { en: 'Festival marking the end of Ramadan fasting.', hi: 'रमज़ान के उपवास की समाप्ति का त्योहार।' }, practices: { en: ['Eid prayer', 'Wear new clothes', 'Share meals with community', 'Give Zakat al-Fitr'], hi: ['ईद की नमाज़', 'नए कपड़े पहनें', 'समुदाय के साथ भोजन', 'ज़कात अल-फ़ित्र दें'] } },
  { id: 'eid-ul-adha-2025', name: { en: 'Eid ul-Adha', hi: 'ईद उल-अज़हा' }, date: '06-07', religion: 'muslim', description: { en: 'Festival of sacrifice honoring Ibrahim\'s devotion.', hi: 'इब्राहीम की भक्ति का सम्मान करने वाला बलिदान का त्योहार।' }, practices: { en: ['Eid prayer', 'Qurbani (sacrifice)', 'Share meat with poor', 'Family gatherings'], hi: ['ईद की नमाज़', 'क़ुर्बानी', 'गरीबों को मांस बांटें', 'पारिवारिक सभाएं'] } },
  { id: 'milad-un-nabi', name: { en: 'Eid Milad-un-Nabi', hi: 'ईद मिलाद-उन-नबी' }, date: '09-05', religion: 'muslim', description: { en: 'Birthday of Prophet Muhammad (PBUH).', hi: 'पैगंबर मुहम्मद (स.) का जन्मदिन।' }, practices: { en: ['Attend gatherings', 'Recite Quran', 'Share food with poor', 'Naat recitation'], hi: ['सभाओं में जाएं', 'क़ुरान पाठ', 'गरीबों को भोजन', 'नात पठन'] } },
  { id: 'shab-e-barat', name: { en: 'Shab-e-Barat', hi: 'शब-ए-बारात' }, date: '02-14', religion: 'muslim', description: { en: 'Night of forgiveness — pray for salvation and blessings.', hi: 'माफ़ी की रात — मोक्ष और आशीर्वाद की प्रार्थना।' }, practices: { en: ['All-night prayer', 'Visit graves of ancestors', 'Ask for forgiveness', 'Fast next day'], hi: ['रात भर प्रार्थना', 'पूर्वजों की कब्रों पर जाएं', 'माफ़ी मांगें', 'अगले दिन उपवास'] } },

  // ===== CHRISTIAN =====
  { id: 'good-friday', name: { en: 'Good Friday', hi: 'गुड फ्राइडे' }, date: '04-18', religion: 'christian', description: { en: 'Observance of the crucifixion of Jesus Christ.', hi: 'ईसा मसीह के सूली पर चढ़ने का स्मरण।' }, practices: { en: ['Attend church service', 'Fasting and abstinence', 'Stations of the Cross', 'Prayer and reflection'], hi: ['चर्च सेवा', 'उपवास', 'क्रॉस के स्टेशन', 'प्रार्थना और चिंतन'] } },
  { id: 'easter', name: { en: 'Easter', hi: 'ईस्टर' }, date: '04-20', religion: 'christian', description: { en: 'Celebration of the resurrection of Jesus Christ.', hi: 'ईसा मसीह के पुनरुत्थान का उत्सव।' }, practices: { en: ['Sunrise service', 'Easter egg hunt', 'Church attendance', 'Family meal'], hi: ['सूर्योदय सेवा', 'ईस्टर एग हंट', 'चर्च जाना', 'पारिवारिक भोजन'] } },
  { id: 'christmas', name: { en: 'Christmas', hi: 'क्रिसमस' }, date: '12-25', religion: 'christian', description: { en: 'Celebration of the birth of Jesus Christ.', hi: 'ईसा मसीह के जन्म का उत्सव।' }, practices: { en: ['Attend church service', 'Exchange gifts', 'Carol singing', 'Family feast'], hi: ['चर्च सेवा में भाग लें', 'उपहार बांटें', 'कैरोल गाएं', 'पारिवारिक भोज'] } },

  // ===== BUDDHIST =====
  { id: 'vesak', name: { en: 'Vesak (Buddha Purnima)', hi: 'वेसाक (बुद्ध पूर्णिमा)' }, date: '05-12', religion: 'buddhist', description: { en: 'Celebrates the birth, enlightenment, and passing of Buddha.', hi: 'बुद्ध के जन्म, ज्ञान प्राप्ति और परिनिर्वाण का उत्सव।' }, practices: { en: ['Visit temple', 'Meditation', 'Acts of kindness', 'Offer flowers and incense'], hi: ['मंदिर जाएं', 'ध्यान करें', 'दयालुता के कार्य', 'फूल और धूप अर्पित करें'] } },
  { id: 'asalha-puja', name: { en: 'Asalha Puja (Dharma Day)', hi: 'आषाढ़ पूजा (धर्म दिवस)' }, date: '07-10', religion: 'buddhist', description: { en: 'Marks Buddha\'s first teaching of the Dharma.', hi: 'बुद्ध के प्रथम धर्म उपदेश का स्मरण।' }, practices: { en: ['Temple visit', 'Listen to Dharma talks', 'Meditation retreat', 'Dana (giving)'], hi: ['मंदिर जाएं', 'धर्म प्रवचन सुनें', 'ध्यान शिविर', 'दान'] } },

  // ===== JAIN =====
  { id: 'mahavir-jayanti', name: { en: 'Mahavir Jayanti', hi: 'महावीर जयंती' }, date: '04-10', religion: 'jain', description: { en: 'Birthday of Lord Mahavira, the 24th Tirthankara.', hi: '24वें तीर्थंकर भगवान महावीर का जन्मोत्सव।' }, practices: { en: ['Visit Jain temple', 'Abhishek of Mahavira idol', 'Procession (Rath Yatra)', 'Practice non-violence'], hi: ['जैन मंदिर जाएं', 'महावीर प्रतिमा का अभिषेक', 'रथ यात्रा', 'अहिंसा का पालन'] } },
  { id: 'paryushan', name: { en: 'Paryushan', hi: 'पर्युषण' }, date: '08-13', religion: 'jain', description: { en: 'Eight days of intensive fasting, prayer, and self-reflection.', hi: 'आठ दिन का गहन उपवास, प्रार्थना और आत्म-चिंतन।' }, practices: { en: ['Fasting', 'Forgiveness prayers', 'Self-discipline', 'Non-violence pledge'], hi: ['उपवास', 'क्षमा प्रार्थना', 'आत्म-अनुशासन', 'अहिंसा प्रतिज्ञा'] } },
  { id: 'samvatsari', name: { en: 'Samvatsari (Forgiveness Day)', hi: 'संवत्सरी (क्षमा दिवस)' }, date: '08-20', religion: 'jain', description: { en: 'The last day of Paryushan — seek forgiveness from all.', hi: 'पर्युषण का अंतिम दिन — सभी से क्षमा मांगें।' }, practices: { en: ['Ask forgiveness: Micchami Dukkadam', 'Forgive others', 'End all grudges', 'Community gathering'], hi: ['क्षमा मांगें: मिच्छामि दुक्कडम', 'दूसरों को क्षमा करें', 'सभी शिकायतें समाप्त करें', 'सामुदायिक सभा'] } },

  // ===== SIKH =====
  { id: 'vaisakhi', name: { en: 'Vaisakhi', hi: 'वैसाखी' }, date: '04-13', religion: 'sikh', description: { en: 'Sikh New Year and formation of Khalsa.', hi: 'सिख नव वर्ष और खालसा की स्थापना।' }, practices: { en: ['Visit Gurudwara', 'Nagar Kirtan procession', 'Community service', 'Cultural programs'], hi: ['गुरुद्वारा जाएं', 'नगर कीर्तन जुलूस', 'सामुदायिक सेवा', 'सांस्कृतिक कार्यक्रम'] } },
  { id: 'guru-nanak', name: { en: 'Guru Nanak Jayanti', hi: 'गुरु नानक जयंती' }, date: '11-05', religion: 'sikh', description: { en: 'Birthday of Guru Nanak Dev Ji, the founder of Sikhism.', hi: 'सिख धर्म के संस्थापक गुरु नानक देव जी का जन्मदिन।' }, practices: { en: ['Visit Gurudwara', 'Prabhat Pheri procession', 'Langar (community meal)', 'Kirtan and prayer'], hi: ['गुरुद्वारा जाएं', 'प्रभात फेरी जुलूस', 'लंगर', 'कीर्तन और प्रार्थना'] } },
  { id: 'guru-gobind-jayanti', name: { en: 'Guru Gobind Singh Jayanti', hi: 'गुरु गोबिंद सिंह जयंती' }, date: '01-06', religion: 'sikh', description: { en: 'Birthday of the 10th Sikh Guru, Guru Gobind Singh Ji.', hi: 'दसवें सिख गुरु, गुरु गोबिंद सिंह जी का जन्मदिन।' }, practices: { en: ['Visit Gurudwara', 'Listen to Kirtan', 'Serve in Langar', 'Read Guru Granth Sahib'], hi: ['गुरुद्वारा जाएं', 'कीर्तन सुनें', 'लंगर में सेवा', 'गुरु ग्रंथ साहिब पढ़ें'] } },
];

export const getUpcomingFestivals = (religion?: Religion, limit = 5): Festival[] => {
  const now = new Date();
  const currentMMDD = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const sorted = [...festivals].sort((a, b) => {
    const aNext = a.date >= currentMMDD ? a.date : `${String(parseInt(a.date.split('-')[0]) + 12).padStart(2, '0')}-${a.date.split('-')[1]}`;
    const bNext = b.date >= currentMMDD ? b.date : `${String(parseInt(b.date.split('-')[0]) + 12).padStart(2, '0')}-${b.date.split('-')[1]}`;
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
