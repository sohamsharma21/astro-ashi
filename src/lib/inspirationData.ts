import { Religion } from './faithModules';

export interface Inspiration {
  quote: { en: string; hi: string };
  source: { en: string; hi: string };
  religion: Religion;
}

export const inspirations: Record<Religion, Inspiration[]> = {
  hindu: [
    { quote: { en: 'You have the right to work, but never to the fruit of work.', hi: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।' }, source: { en: 'Bhagavad Gita 2.47', hi: 'भगवद्गीता 2.47' }, religion: 'hindu' },
    { quote: { en: 'The soul is neither born, nor does it die.', hi: 'न जायते म्रियते वा कदाचित्।' }, source: { en: 'Bhagavad Gita 2.20', hi: 'भगवद्गीता 2.20' }, religion: 'hindu' },
    { quote: { en: 'When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place.', hi: 'जब ध्यान में महारत हासिल हो जाती है, तो मन वायुहीन स्थान में दीपक की लौ की तरह स्थिर हो जाता है।' }, source: { en: 'Bhagavad Gita 6.19', hi: 'भगवद्गीता 6.19' }, religion: 'hindu' },
    { quote: { en: 'Set thy heart upon thy work, but never on its reward.', hi: 'अपना हृदय अपने कार्य में लगाओ, परंतु कभी उसके फल में नहीं।' }, source: { en: 'Bhagavad Gita 2.47', hi: 'भगवद्गीता 2.47' }, religion: 'hindu' },
    { quote: { en: 'A person can rise through the efforts of his own mind.', hi: 'मनुष्य अपने मन के प्रयासों से ऊपर उठ सकता है।' }, source: { en: 'Bhagavad Gita 6.5', hi: 'भगवद्गीता 6.5' }, religion: 'hindu' },
    { quote: { en: 'There is neither this world, nor the world beyond, nor happiness for the one who doubts.', hi: 'संशय करने वाले के लिए न यह लोक है, न परलोक, न सुख।' }, source: { en: 'Bhagavad Gita 4.40', hi: 'भगवद्गीता 4.40' }, religion: 'hindu' },
    { quote: { en: 'Whatever happened, happened for the good. Whatever is happening, is happening for the good.', hi: 'जो हुआ, अच्छे के लिए हुआ। जो हो रहा है, अच्छे के लिए हो रहा है।' }, source: { en: 'Bhagavad Gita', hi: 'भगवद्गीता' }, religion: 'hindu' },
  ],
  muslim: [
    { quote: { en: 'Verily, with hardship comes ease.', hi: 'निस्संदेह, कठिनाई के साथ आसानी है।' }, source: { en: 'Quran 94:6', hi: 'क़ुरान 94:6' }, religion: 'muslim' },
    { quote: { en: 'And He found you lost and guided you.', hi: 'और उसने तुम्हें भटका हुआ पाया और मार्ग दिखाया।' }, source: { en: 'Quran 93:7', hi: 'क़ुरान 93:7' }, religion: 'muslim' },
    { quote: { en: 'Allah does not burden a soul beyond that it can bear.', hi: 'अल्लाह किसी प्राणी पर उसकी सामर्थ्य से अधिक बोझ नहीं डालता।' }, source: { en: 'Quran 2:286', hi: 'क़ुरान 2:286' }, religion: 'muslim' },
    { quote: { en: 'The best among you are those who have the best manners and character.', hi: 'तुम में सबसे अच्छे वे हैं जिनके शिष्टाचार और चरित्र सबसे अच्छे हैं।' }, source: { en: 'Sahih Bukhari', hi: 'सहीह बुख़ारी' }, religion: 'muslim' },
    { quote: { en: 'Indeed, Allah is with the patient.', hi: 'निश्चय ही, अल्लाह धैर्यवानों के साथ है।' }, source: { en: 'Quran 2:153', hi: 'क़ुरान 2:153' }, religion: 'muslim' },
    { quote: { en: 'So remember Me; I will remember you.', hi: 'तो मुझे याद करो; मैं तुम्हें याद करूँगा।' }, source: { en: 'Quran 2:152', hi: 'क़ुरान 2:152' }, religion: 'muslim' },
    { quote: { en: 'Do not lose hope, nor be sad.', hi: 'आशा मत खोओ, और उदास मत होओ।' }, source: { en: 'Quran 3:139', hi: 'क़ुरान 3:139' }, religion: 'muslim' },
  ],
  christian: [
    { quote: { en: 'For I know the plans I have for you, declares the Lord.', hi: 'क्योंकि मैं जानता हूँ कि मेरी तुम्हारे लिए क्या योजनाएं हैं, प्रभु कहते हैं।' }, source: { en: 'Jeremiah 29:11', hi: 'यिर्मयाह 29:11' }, religion: 'christian' },
    { quote: { en: 'Be still, and know that I am God.', hi: 'शांत रहो, और जानो कि मैं ईश्वर हूँ।' }, source: { en: 'Psalm 46:10', hi: 'भजन संहिता 46:10' }, religion: 'christian' },
    { quote: { en: 'The Lord is my shepherd; I shall not want.', hi: 'प्रभु मेरा चरवाहा है; मुझे कोई कमी नहीं होगी।' }, source: { en: 'Psalm 23:1', hi: 'भजन संहिता 23:1' }, religion: 'christian' },
    { quote: { en: 'I can do all things through Christ who strengthens me.', hi: 'मैं मसीह के द्वारा जो मुझे सामर्थ्य देता है, सब कुछ कर सकता हूँ।' }, source: { en: 'Philippians 4:13', hi: 'फिलिप्पियों 4:13' }, religion: 'christian' },
    { quote: { en: 'Love is patient, love is kind.', hi: 'प्रेम धैर्यवान है, प्रेम दयालु है।' }, source: { en: '1 Corinthians 13:4', hi: '1 कुरिन्थियों 13:4' }, religion: 'christian' },
    { quote: { en: 'Trust in the Lord with all your heart.', hi: 'अपने पूरे हृदय से प्रभु पर भरोसा रखो।' }, source: { en: 'Proverbs 3:5', hi: 'नीतिवचन 3:5' }, religion: 'christian' },
    { quote: { en: 'God is love, and whoever abides in love abides in God.', hi: 'ईश्वर प्रेम है, और जो प्रेम में रहता है वह ईश्वर में रहता है।' }, source: { en: '1 John 4:16', hi: '1 यूहन्ना 4:16' }, religion: 'christian' },
  ],
  buddhist: [
    { quote: { en: 'Peace comes from within. Do not seek it without.', hi: 'शांति भीतर से आती है। इसे बाहर मत खोजो।' }, source: { en: 'Buddha', hi: 'बुद्ध' }, religion: 'buddhist' },
    { quote: { en: 'The mind is everything. What you think you become.', hi: 'मन ही सब कुछ है। जो तुम सोचते हो, वही बन जाते हो।' }, source: { en: 'Buddha', hi: 'बुद्ध' }, religion: 'buddhist' },
    { quote: { en: 'Three things cannot be long hidden: the sun, the moon, and the truth.', hi: 'तीन चीज़ें लंबे समय तक छिपी नहीं रह सकतीं: सूर्य, चंद्रमा और सत्य।' }, source: { en: 'Buddha', hi: 'बुद्ध' }, religion: 'buddhist' },
    { quote: { en: 'In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go.', hi: 'अंत में, केवल तीन चीज़ें मायने रखती हैं: आपने कितना प्रेम किया, कितने कोमलता से जिए, और कितनी शालीनता से छोड़ दिया।' }, source: { en: 'Buddha', hi: 'बुद्ध' }, religion: 'buddhist' },
    { quote: { en: 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.', hi: 'अतीत में मत रहो, भविष्य के सपने मत देखो, मन को वर्तमान क्षण पर केंद्रित करो।' }, source: { en: 'Buddha', hi: 'बुद्ध' }, religion: 'buddhist' },
  ],
  jain: [
    { quote: { en: 'Non-violence is the supreme religion.', hi: 'अहिंसा परमो धर्मः।' }, source: { en: 'Lord Mahavira', hi: 'भगवान महावीर' }, religion: 'jain' },
    { quote: { en: 'The soul is the maker and the non-maker, and of itself makes happiness and misery.', hi: 'आत्मा कर्ता और अकर्ता है, और स्वयं सुख और दुख बनाती है।' }, source: { en: 'Lord Mahavira', hi: 'भगवान महावीर' }, religion: 'jain' },
    { quote: { en: 'Have compassion towards all living beings. Hatred leads to destruction.', hi: 'सभी जीवों के प्रति करुणा रखो। घृणा विनाश की ओर ले जाती है।' }, source: { en: 'Lord Mahavira', hi: 'भगवान महावीर' }, religion: 'jain' },
    { quote: { en: 'Every soul is in itself absolutely omniscient and blissful.', hi: 'प्रत्येक आत्मा स्वयं में पूर्णतः सर्वज्ञ और आनंदमय है।' }, source: { en: 'Lord Mahavira', hi: 'भगवान महावीर' }, religion: 'jain' },
    { quote: { en: 'Live and let live.', hi: 'जियो और जीने दो।' }, source: { en: 'Jain Teaching', hi: 'जैन शिक्षा' }, religion: 'jain' },
  ],
  sikh: [
    { quote: { en: 'There is but one God. His name is Truth. He is the Creator.', hi: 'एक ईश्वर है। उसका नाम सत्य है। वह सृष्टिकर्ता है।' }, source: { en: 'Guru Granth Sahib', hi: 'गुरु ग्रंथ साहिब' }, religion: 'sikh' },
    { quote: { en: 'Even kings and emperors with heaps of wealth — their value is not equal to an ant who is filled with the love of God.', hi: 'धन के ढेर वाले राजा और सम्राट भी — उनका मूल्य उस चींटी के बराबर नहीं जो ईश्वर के प्रेम से भरी है।' }, source: { en: 'Guru Nanak Dev Ji', hi: 'गुरु नानक देव जी' }, religion: 'sikh' },
    { quote: { en: 'The world is a drama, staged in a dream.', hi: 'संसार एक नाटक है, सपने में मंचित।' }, source: { en: 'Guru Nanak Dev Ji', hi: 'गुरु नानक देव जी' }, religion: 'sikh' },
    { quote: { en: 'Dwell in peace in the home of your own being.', hi: 'अपने अस्तित्व के घर में शांति से रहो।' }, source: { en: 'Guru Granth Sahib', hi: 'गुरु ग्रंथ साहिब' }, religion: 'sikh' },
    { quote: { en: 'From one Light, the entire universe was born.', hi: 'एक ज्योति से, समस्त ब्रह्मांड की उत्पत्ति हुई।' }, source: { en: 'Guru Granth Sahib', hi: 'गुरु ग्रंथ साहिब' }, religion: 'sikh' },
  ],
  other: [
    { quote: { en: 'Be the change you wish to see in the world.', hi: 'वो बदलाव बनो जो तुम दुनिया में देखना चाहते हो।' }, source: { en: 'Mahatma Gandhi', hi: 'महात्मा गांधी' }, religion: 'other' },
    { quote: { en: 'In a gentle way, you can shake the world.', hi: 'कोमल तरीके से, तुम दुनिया को हिला सकते हो।' }, source: { en: 'Mahatma Gandhi', hi: 'महात्मा गांधी' }, religion: 'other' },
    { quote: { en: 'Kindness is a language which the deaf can hear and the blind can see.', hi: 'दयालुता एक ऐसी भाषा है जो बहरे सुन सकते हैं और अंधे देख सकते हैं।' }, source: { en: 'Mark Twain', hi: 'मार्क ट्वेन' }, religion: 'other' },
    { quote: { en: 'The only way to do great work is to love what you do.', hi: 'महान कार्य करने का एकमात्र तरीका है कि आप जो करते हैं उससे प्यार करें।' }, source: { en: 'Steve Jobs', hi: 'स्टीव जॉब्स' }, religion: 'other' },
    { quote: { en: 'Happiness is not something ready-made. It comes from your own actions.', hi: 'खुशी कोई बनी-बनाई चीज़ नहीं है। यह आपके अपने कर्मों से आती है।' }, source: { en: 'Dalai Lama', hi: 'दलाई लामा' }, religion: 'other' },
  ]
};

export const getDailyInspiration = (religion: Religion): Inspiration => {
  const quotes = inspirations[religion] || inspirations.other;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return quotes[dayOfYear % quotes.length];
};
