export type Religion = 'hindu' | 'muslim' | 'christian' | 'jain' | 'buddhist' | 'sikh' | 'other';

export interface FaithContent {
  greeting: { en: string; hi: string };
  dailyInsightLabel: { en: string; hi: string };
  features: string[];
  showKundli: boolean;
  showPanchang: boolean;
  showMuhurat: boolean;
  calendarType: string;
  spiritualTips: { en: string[]; hi: string[] };
}

export const faithModules: Record<Religion, FaithContent> = {
  hindu: {
    greeting: { en: 'Namaste', hi: 'नमस्ते' },
    dailyInsightLabel: { en: 'Daily Kundli Insight', hi: 'दैनिक कुंडली अंतर्दृष्टि' },
    features: ['kundli', 'panchang', 'muhurat', 'remedies', 'predictions'],
    showKundli: true,
    showPanchang: true,
    showMuhurat: true,
    calendarType: 'panchang',
    spiritualTips: {
      en: [
        'Chant the Gayatri Mantra at sunrise for mental clarity.',
        'Light a diya in the evening for positive energy.',
        'Offer water to Surya Dev for health and vitality.',
        'Practice meditation during Brahma Muhurat (4-6 AM).',
        'Observe a fast on Ekadashi for spiritual purification.',
      ],
      hi: [
        'सूर्योदय पर गायत्री मंत्र का जाप करें।',
        'शाम को सकारात्मक ऊर्जा के लिए दीपक जलाएं।',
        'स्वास्थ्य के लिए सूर्य देव को जल अर्पित करें।',
        'ब्रह्म मुहूर्त (सुबह 4-6) में ध्यान करें।',
        'आध्यात्मिक शुद्धि के लिए एकादशी का व्रत रखें।',
      ],
    },
  },
  muslim: {
    greeting: { en: 'Assalamu Alaikum', hi: 'अस्सलामु अलैकुम' },
    dailyInsightLabel: { en: 'Daily Spiritual Guidance', hi: 'दैनिक आध्यात्मिक मार्गदर्शन' },
    features: ['prayer_times', 'hijri_calendar', 'spiritual_suggestions'],
    showKundli: false,
    showPanchang: false,
    showMuhurat: false,
    calendarType: 'hijri',
    spiritualTips: {
      en: [
        'Begin your day with Bismillah and gratitude.',
        'Recite Surah Al-Fatiha for blessings and guidance.',
        'Give Sadaqah (charity) to purify your wealth.',
        'Maintain Dhikr (remembrance of Allah) throughout the day.',
        'Practice patience (Sabr) in times of difficulty.',
      ],
      hi: [
        'अपना दिन बिस्मिल्लाह और कृतज्ञता से शुरू करें।',
        'आशीर्वाद के लिए सूरह अल-फातिहा पढ़ें।',
        'अपने धन को शुद्ध करने के लिए सदका दें।',
        'पूरे दिन ज़िक्र करते रहें।',
        'कठिनाई में सब्र रखें।',
      ],
    },
  },
  christian: {
    greeting: { en: 'God Bless You', hi: 'ईश्वर आपको आशीर्वाद दे' },
    dailyInsightLabel: { en: 'Daily Devotional', hi: 'दैनिक भक्ति' },
    features: ['liturgical_calendar', 'bible_verses', 'prayer_prompts'],
    showKundli: false,
    showPanchang: false,
    showMuhurat: false,
    calendarType: 'liturgical',
    spiritualTips: {
      en: [
        'Start your morning with a prayer of thanksgiving.',
        'Read a Psalm for comfort and inspiration.',
        'Practice forgiveness as Christ taught.',
        'Serve others with love and compassion.',
        'Trust in God\'s plan during uncertain times.',
      ],
      hi: [
        'सुबह धन्यवाद की प्रार्थना से शुरू करें।',
        'सांत्वना के लिए भजन पढ़ें।',
        'क्षमा का अभ्यास करें जैसे मसीह ने सिखाया।',
        'प्रेम और करुणा से सेवा करें।',
        'अनिश्चित समय में ईश्वर की योजना पर भरोसा रखें।',
      ],
    },
  },
  jain: {
    greeting: { en: 'Jai Jinendra', hi: 'जय जिनेन्द्र' },
    dailyInsightLabel: { en: 'Daily Spiritual Reflection', hi: 'दैनिक आध्यात्मिक चिंतन' },
    features: ['jain_calendar', 'spiritual_reflections', 'ahimsa_tips'],
    showKundli: false,
    showPanchang: true,
    showMuhurat: true,
    calendarType: 'jain',
    spiritualTips: {
      en: [
        'Practice Ahimsa (non-violence) in thought, word, and deed.',
        'Observe Samayik (meditation) for inner peace.',
        'Practice Aparigraha (non-attachment) today.',
        'Be truthful (Satya) in all interactions.',
        'Reflect on the teachings of Mahavira.',
      ],
      hi: [
        'मन, वचन और कर्म में अहिंसा का पालन करें।',
        'आंतरिक शांति के लिए सामायिक करें।',
        'अपरिग्रह का अभ्यास करें।',
        'सभी व्यवहारों में सत्य बोलें।',
        'महावीर की शिक्षाओं पर चिंतन करें।',
      ],
    },
  },
  buddhist: {
    greeting: { en: 'Namo Buddhaya', hi: 'नमो बुद्धाय' },
    dailyInsightLabel: { en: 'Daily Dharma', hi: 'दैनिक धर्म' },
    features: ['buddhist_calendar', 'dharma_teachings', 'mindfulness'],
    showKundli: false,
    showPanchang: true,
    showMuhurat: false,
    calendarType: 'buddhist',
    spiritualTips: {
      en: [
        'Practice mindful breathing for 10 minutes.',
        'Cultivate loving-kindness (Metta) toward all beings.',
        'Observe the Noble Eightfold Path in daily life.',
        'Practice letting go of attachments.',
        'Reflect on the impermanence of all things.',
      ],
      hi: [
        '10 मिनट सचेतन श्वास का अभ्यास करें।',
        'सभी प्राणियों के प्रति मैत्री भावना रखें।',
        'दैनिक जीवन में अष्टांगिक मार्ग का पालन करें।',
        'आसक्ति त्यागने का अभ्यास करें।',
        'सभी चीजों की अनित्यता पर चिंतन करें।',
      ],
    },
  },
  sikh: {
    greeting: { en: 'Sat Sri Akal', hi: 'सत श्री अकाल' },
    dailyInsightLabel: { en: 'Daily Hukamnama', hi: 'दैनिक हुकमनामा' },
    features: ['nanakshahi_calendar', 'gurbani', 'seva_reminders'],
    showKundli: false,
    showPanchang: true,
    showMuhurat: false,
    calendarType: 'nanakshahi',
    spiritualTips: {
      en: [
        'Start your day with Japji Sahib.',
        'Practice Seva (selfless service) today.',
        'Remember Waheguru in every moment.',
        'Share your blessings through Langar (community kitchen).',
        'Live with honesty and earn through honest means (Kirat Karni).',
      ],
      hi: [
        'अपना दिन जपजी साहिब से शुरू करें।',
        'आज सेवा (निस्वार्थ सेवा) करें।',
        'हर पल वाहेगुरु को याद करें।',
        'लंगर के माध्यम से अपने आशीर्वाद साझा करें।',
        'ईमानदारी से जीवन जिएं (किरत करनी)।',
      ],
    },
  },
  other: {
    greeting: { en: 'Welcome', hi: 'स्वागत है' },
    dailyInsightLabel: { en: 'Daily Inspiration', hi: 'दैनिक प्रेरणा' },
    features: ['general_calendar', 'inspirational_quotes', 'mindfulness'],
    showKundli: true,
    showPanchang: true,
    showMuhurat: false,
    calendarType: 'general',
    spiritualTips: {
      en: [
        'Start your day with gratitude and positive intentions.',
        'Practice kindness toward yourself and others.',
        'Spend time in nature for inner peace.',
        'Reflect on what truly matters in life.',
        'Be present in each moment.',
      ],
      hi: [
        'अपना दिन कृतज्ञता और सकारात्मक इरादों से शुरू करें।',
        'अपने और दूसरों के प्रति दयालुता का अभ्यास करें।',
        'आंतरिक शांति के लिए प्रकृति में समय बिताएं।',
        'जीवन में जो वास्तव में महत्वपूर्ण है उस पर चिंतन करें।',
        'हर पल में उपस्थित रहें।',
      ],
    },
  },
};

export const getReligionLabel = (religion: Religion, language: 'en' | 'hi'): string => {
  const labels: Record<Religion, { en: string; hi: string }> = {
    hindu: { en: 'Hindu', hi: 'हिन्दू' },
    muslim: { en: 'Muslim', hi: 'मुस्लिम' },
    christian: { en: 'Christian', hi: 'ईसाई' },
    jain: { en: 'Jain', hi: 'जैन' },
    buddhist: { en: 'Buddhist', hi: 'बौद्ध' },
    sikh: { en: 'Sikh', hi: 'सिख' },
    other: { en: 'Other', hi: 'अन्य' },
  };
  return labels[religion]?.[language] || labels.other[language];
};

export const getDailyTip = (religion: Religion, language: 'en' | 'hi'): string => {
  const tips = faithModules[religion]?.spiritualTips[language] || faithModules.other.spiritualTips[language];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return tips[dayOfYear % tips.length];
};
