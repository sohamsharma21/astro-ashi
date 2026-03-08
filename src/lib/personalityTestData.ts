export type Language = 'en' | 'hi' | 'ar' | 'es' | 'fr';

export interface PersonalityQuestion {
  id: number;
  question: Record<Language, string>;
  options: {
    value: string;
    label: Record<Language, string>;
    scores: Record<PersonalityType, number>;
  }[];
}

export type PersonalityType = 'seeker' | 'healer' | 'thinker' | 'devotee';

export interface PersonalityResult {
  type: PersonalityType;
  title: Record<Language, string>;
  description: Record<Language, string>;
  strengths: Record<Language, string[]>;
  practices: Record<Language, string[]>;
  meditations: Record<Language, string[]>;
  icon: string;
  color: string;
}

export const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 1,
    question: {
      en: 'How do you handle stress?',
      hi: 'आप तनाव को कैसे संभालते हैं?',
      ar: 'كيف تتعامل مع التوتر؟',
      es: '¿Cómo manejas el estrés?',
      fr: 'Comment gérez-vous le stress ?'
    },
    options: [
      { value: 'seek_answers', label: { en: 'I seek answers and explore new perspectives', hi: 'मैं उत्तर खोजता हूं और नए दृष्टिकोण तलाशता हूं', ar: 'أبحث عن إجابات واستكشف وجهات نظر جديدة', es: 'Busco respuestas y exploro nuevas perspectivas', fr: 'Je cherche des réponses et explore de nouvelles perspectives' }, scores: { seeker: 3, healer: 1, thinker: 2, devotee: 0 } },
      { value: 'help_others', label: { en: 'I help others who are also struggling', hi: 'मैं दूसरों की मदद करता हूं जो भी संघर्ष कर रहे हैं', ar: 'أساعد الآخرين الذين يعانون أيضًا', es: 'Ayudo a otros que también están luchando', fr: 'J\'aide les autres qui luttent aussi' }, scores: { seeker: 0, healer: 3, thinker: 1, devotee: 2 } },
      { value: 'analyze', label: { en: 'I analyze the situation logically', hi: 'मैं स्थिति का तार्किक विश्लेषण करता हूं', ar: 'أحلل الموقف منطقيًا', es: 'Analizo la situación lógicamente', fr: 'J\'analyse la situation logiquement' }, scores: { seeker: 1, healer: 0, thinker: 3, devotee: 1 } },
      { value: 'pray', label: { en: 'I pray or turn to my faith', hi: 'मैं प्रार्थना करता हूं या अपने विश्वास की ओर मुड़ता हूं', ar: 'أصلي أو ألجأ إلى إيماني', es: 'Oro o recurro a mi fe', fr: 'Je prie ou je me tourne vers ma foi' }, scores: { seeker: 0, healer: 1, thinker: 0, devotee: 3 } }
    ]
  },
  {
    id: 2,
    question: {
      en: 'What gives you the most peace?',
      hi: 'आपको सबसे ज्यादा शांति किससे मिलती है?',
      ar: 'ما الذي يمنحك أكبر قدر من السلام؟',
      es: '¿Qué te da más paz?',
      fr: 'Qu\'est-ce qui vous donne le plus de paix ?'
    },
    options: [
      { value: 'discovery', label: { en: 'Discovering something new about life', hi: 'जीवन के बारे में कुछ नया खोजना', ar: 'اكتشاف شيء جديد عن الحياة', es: 'Descubrir algo nuevo sobre la vida', fr: 'Découvrir quelque chose de nouveau sur la vie' }, scores: { seeker: 3, healer: 0, thinker: 2, devotee: 0 } },
      { value: 'service', label: { en: 'Serving and caring for others', hi: 'दूसरों की सेवा और देखभाल करना', ar: 'خدمة ورعاية الآخرين', es: 'Servir y cuidar a otros', fr: 'Servir et prendre soin des autres' }, scores: { seeker: 0, healer: 3, thinker: 0, devotee: 2 } },
      { value: 'understanding', label: { en: 'Understanding complex concepts', hi: 'जटिल अवधारणाओं को समझना', ar: 'فهم المفاهيم المعقدة', es: 'Entender conceptos complejos', fr: 'Comprendre des concepts complexes' }, scores: { seeker: 1, healer: 0, thinker: 3, devotee: 0 } },
      { value: 'devotion', label: { en: 'Deep devotion and worship', hi: 'गहरी भक्ति और पूजा', ar: 'التفاني العميق والعبادة', es: 'Devoción profunda y adoración', fr: 'Dévotion profonde et adoration' }, scores: { seeker: 0, healer: 1, thinker: 0, devotee: 3 } }
    ]
  },
  {
    id: 3,
    question: {
      en: 'Do you prefer silence or prayer?',
      hi: 'आप मौन पसंद करते हैं या प्रार्थना?',
      ar: 'هل تفضل الصمت أم الصلاة؟',
      es: '¿Prefieres el silencio o la oración?',
      fr: 'Préférez-vous le silence ou la prière ?'
    },
    options: [
      { value: 'contemplative_silence', label: { en: 'Contemplative silence for inner exploration', hi: 'आंतरिक अन्वेषण के लिए चिंतनशील मौन', ar: 'صمت تأملي للاستكشاف الداخلي', es: 'Silencio contemplativo para exploración interior', fr: 'Silence contemplatif pour l\'exploration intérieure' }, scores: { seeker: 3, healer: 1, thinker: 2, devotee: 0 } },
      { value: 'healing_presence', label: { en: 'Quiet presence while holding space for others', hi: 'दूसरों के लिए जगह रखते हुए शांत उपस्थिति', ar: 'حضور هادئ مع إفساح المجال للآخرين', es: 'Presencia tranquila mientras sostienes espacio para otros', fr: 'Présence calme tout en tenant l\'espace pour les autres' }, scores: { seeker: 0, healer: 3, thinker: 1, devotee: 1 } },
      { value: 'meditative_inquiry', label: { en: 'Meditative inquiry and reflection', hi: 'ध्यानात्मक जांच और चिंतन', ar: 'استفسار وتأمل تأملي', es: 'Investigación meditativa y reflexión', fr: 'Enquête méditative et réflexion' }, scores: { seeker: 2, healer: 0, thinker: 3, devotee: 0 } },
      { value: 'devotional_prayer', label: { en: 'Devotional prayer and connection', hi: 'भक्ति प्रार्थना और संबंध', ar: 'صلاة تعبدية واتصال', es: 'Oración devocional y conexión', fr: 'Prière dévotionnelle et connexion' }, scores: { seeker: 0, healer: 1, thinker: 0, devotee: 3 } }
    ]
  },
  {
    id: 4,
    question: {
      en: 'What draws you to spirituality?',
      hi: 'आपको आध्यात्मिकता की ओर क्या आकर्षित करता है?',
      ar: 'ما الذي يجذبك إلى الروحانية؟',
      es: '¿Qué te atrae de la espiritualidad?',
      fr: 'Qu\'est-ce qui vous attire vers la spiritualité ?'
    },
    options: [
      { value: 'truth', label: { en: 'The search for ultimate truth', hi: 'परम सत्य की खोज', ar: 'البحث عن الحقيقة المطلقة', es: 'La búsqueda de la verdad última', fr: 'La recherche de la vérité ultime' }, scores: { seeker: 3, healer: 0, thinker: 2, devotee: 1 } },
      { value: 'compassion', label: { en: 'The ability to help and heal others', hi: 'दूसरों की मदद और उपचार करने की क्षमता', ar: 'القدرة على مساعدة وشفاء الآخرين', es: 'La capacidad de ayudar y sanar a otros', fr: 'La capacité d\'aider et de guérir les autres' }, scores: { seeker: 0, healer: 3, thinker: 0, devotee: 2 } },
      { value: 'wisdom', label: { en: 'Ancient wisdom and sacred knowledge', hi: 'प्राचीन ज्ञान और पवित्र ज्ञान', ar: 'الحكمة القديمة والمعرفة المقدسة', es: 'Sabiduría antigua y conocimiento sagrado', fr: 'Sagesse ancienne et connaissance sacrée' }, scores: { seeker: 2, healer: 0, thinker: 3, devotee: 1 } },
      { value: 'divine_love', label: { en: 'Divine love and surrender', hi: 'दिव्य प्रेम और समर्पण', ar: 'الحب الإلهي والاستسلام', es: 'Amor divino y entrega', fr: 'Amour divin et abandon' }, scores: { seeker: 0, healer: 1, thinker: 0, devotee: 3 } }
    ]
  },
  {
    id: 5,
    question: {
      en: 'How do you prefer to learn?',
      hi: 'आप कैसे सीखना पसंद करते हैं?',
      ar: 'كيف تفضل أن تتعلم؟',
      es: '¿Cómo prefieres aprender?',
      fr: 'Comment préférez-vous apprendre ?'
    },
    options: [
      { value: 'experience', label: { en: 'Through direct experience and exploration', hi: 'प्रत्यक्ष अनुभव और अन्वेषण के माध्यम से', ar: 'من خلال التجربة والاستكشاف المباشر', es: 'A través de experiencia directa y exploración', fr: 'Par l\'expérience directe et l\'exploration' }, scores: { seeker: 3, healer: 1, thinker: 1, devotee: 0 } },
      { value: 'relationships', label: { en: 'Through relationships and service', hi: 'संबंधों और सेवा के माध्यम से', ar: 'من خلال العلاقات والخدمة', es: 'A través de relaciones y servicio', fr: 'Par les relations et le service' }, scores: { seeker: 0, healer: 3, thinker: 0, devotee: 2 } },
      { value: 'study', label: { en: 'Through study and contemplation', hi: 'अध्ययन और चिंतन के माध्यम से', ar: 'من خلال الدراسة والتأمل', es: 'A través del estudio y la contemplación', fr: 'Par l\'étude et la contemplation' }, scores: { seeker: 1, healer: 0, thinker: 3, devotee: 1 } },
      { value: 'practice', label: { en: 'Through devotional practices', hi: 'भक्ति अभ्यासों के माध्यम से', ar: 'من خلال الممارسات التعبدية', es: 'A través de prácticas devocionales', fr: 'Par des pratiques dévotionnelles' }, scores: { seeker: 0, healer: 1, thinker: 0, devotee: 3 } }
    ]
  },
  {
    id: 6,
    question: {
      en: 'What is your ideal spiritual community?',
      hi: 'आपका आदर्श आध्यात्मिक समुदाय क्या है?',
      ar: 'ما هو مجتمعك الروحي المثالي؟',
      es: '¿Cuál es tu comunidad espiritual ideal?',
      fr: 'Quelle est votre communauté spirituelle idéale ?'
    },
    options: [
      { value: 'diverse', label: { en: 'Diverse seekers sharing different paths', hi: 'विभिन्न पथ साझा करने वाले विविध साधक', ar: 'باحثون متنوعون يشاركون مسارات مختلفة', es: 'Buscadores diversos compartiendo diferentes caminos', fr: 'Chercheurs divers partageant différents chemins' }, scores: { seeker: 3, healer: 1, thinker: 1, devotee: 0 } },
      { value: 'supportive', label: { en: 'Supportive circle focused on healing', hi: 'उपचार पर केंद्रित सहायक मंडली', ar: 'دائرة داعمة تركز على الشفاء', es: 'Círculo de apoyo enfocado en la sanación', fr: 'Cercle de soutien axé sur la guérison' }, scores: { seeker: 0, healer: 3, thinker: 0, devotee: 2 } },
      { value: 'intellectual', label: { en: 'Intellectual discussions and debates', hi: 'बौद्धिक चर्चा और बहस', ar: 'مناقشات ومناظرات فكرية', es: 'Discusiones y debates intelectuales', fr: 'Discussions et débats intellectuels' }, scores: { seeker: 2, healer: 0, thinker: 3, devotee: 0 } },
      { value: 'devotional', label: { en: 'Devoted congregation in worship', hi: 'पूजा में समर्पित मंडली', ar: 'جماعة مخلصة في العبادة', es: 'Congregación devota en adoración', fr: 'Congrégation dévouée dans l\'adoration' }, scores: { seeker: 0, healer: 1, thinker: 0, devotee: 3 } }
    ]
  },
  {
    id: 7,
    question: {
      en: 'What do you value most in life?',
      hi: 'जीवन में आप सबसे ज्यादा क्या महत्व देते हैं?',
      ar: 'ما الذي تقدره أكثر في الحياة؟',
      es: '¿Qué valoras más en la vida?',
      fr: 'Qu\'est-ce que vous valorisez le plus dans la vie ?'
    },
    options: [
      { value: 'growth', label: { en: 'Personal and spiritual growth', hi: 'व्यक्तिगत और आध्यात्मिक विकास', ar: 'النمو الشخصي والروحي', es: 'Crecimiento personal y espiritual', fr: 'Croissance personnelle et spirituelle' }, scores: { seeker: 3, healer: 1, thinker: 2, devotee: 0 } },
      { value: 'service', label: { en: 'Service to others', hi: 'दूसरों की सेवा', ar: 'خدمة الآخرين', es: 'Servicio a otros', fr: 'Service aux autres' }, scores: { seeker: 0, healer: 3, thinker: 0, devotee: 2 } },
      { value: 'knowledge', label: { en: 'Knowledge and understanding', hi: 'ज्ञान और समझ', ar: 'المعرفة والفهم', es: 'Conocimiento y comprensión', fr: 'Connaissance et compréhension' }, scores: { seeker: 1, healer: 0, thinker: 3, devotee: 0 } },
      { value: 'faith', label: { en: 'Faith and devotion', hi: 'विश्वास और भक्ति', ar: 'الإيمان والإخلاص', es: 'Fe y devoción', fr: 'Foi et dévotion' }, scores: { seeker: 0, healer: 1, thinker: 0, devotee: 3 } }
    ]
  }
];

export const personalityResults: Record<PersonalityType, PersonalityResult> = {
  seeker: {
    type: 'seeker',
    title: { en: 'The Seeker', hi: 'खोजी', ar: 'الباحث', es: 'El Buscador', fr: 'Le Chercheur' },
    description: {
      en: 'You are driven by curiosity and the desire to discover deeper truths. Your spiritual path is one of exploration, questioning, and constant growth.',
      hi: 'आप जिज्ञासा और गहरे सत्य की खोज की इच्छा से प्रेरित हैं। आपका आध्यात्मिक मार्ग अन्वेषण, प्रश्न और निरंतर विकास का है।',
      ar: 'أنت مدفوع بالفضول والرغبة في اكتشاف حقائق أعمق. مسارك الروحي هو الاستكشاف والتساؤل والنمو المستمر.',
      es: 'Estás impulsado por la curiosidad y el deseo de descubrir verdades más profundas. Tu camino espiritual es de exploración, cuestionamiento y crecimiento constante.',
      fr: 'Vous êtes animé par la curiosité et le désir de découvrir des vérités plus profondes. Votre chemin spirituel est celui de l\'exploration, du questionnement et de la croissance constante.'
    },
    icon: '🔍',
    color: 'from-blue-500 to-purple-500',
    strengths: {
      en: ['Open-mindedness', 'Curiosity', 'Adaptability', 'Courage to question'],
      hi: ['खुला दिमाग', 'जिज्ञासा', 'अनुकूलनशीलता', 'प्रश्न करने का साहस'],
      ar: ['الانفتاح', 'الفضول', 'القدرة على التكيف', 'الشجاعة للسؤال'],
      es: ['Mente abierta', 'Curiosidad', 'Adaptabilidad', 'Coraje para cuestionar'],
      fr: ['Ouverture d\'esprit', 'Curiosité', 'Adaptabilité', 'Courage de questionner']
    },
    practices: {
      en: ['Journaling', 'Exploring different traditions', 'Nature walks', 'Silent retreats'],
      hi: ['जर्नलिंग', 'विभिन्न परंपराओं की खोज', 'प्रकृति में चलना', 'मौन रिट्रीट'],
      ar: ['الكتابة اليومية', 'استكشاف تقاليد مختلفة', 'المشي في الطبيعة', 'الخلوات الصامتة'],
      es: ['Escritura de diario', 'Explorar diferentes tradiciones', 'Paseos por la naturaleza', 'Retiros silenciosos'],
      fr: ['Journalisation', 'Explorer différentes traditions', 'Promenades dans la nature', 'Retraites silencieuses']
    },
    meditations: {
      en: ['Vipassana', 'Walking meditation', 'Open awareness'],
      hi: ['विपश्यना', 'चलन ध्यान', 'खुली जागरूकता'],
      ar: ['فيباسانا', 'التأمل أثناء المشي', 'الوعي المفتوح'],
      es: ['Vipassana', 'Meditación caminando', 'Conciencia abierta'],
      fr: ['Vipassana', 'Méditation en marchant', 'Conscience ouverte']
    }
  },
  healer: {
    type: 'healer',
    title: { en: 'The Healer', hi: 'उपचारक', ar: 'المعالج', es: 'El Sanador', fr: 'Le Guérisseur' },
    description: {
      en: 'Your spiritual gift is compassion and the ability to hold space for others. You find meaning through service and helping others heal.',
      hi: 'आपका आध्यात्मिक उपहार करुणा और दूसरों के लिए जगह रखने की क्षमता है। आप सेवा और दूसरों को ठीक करने में मदद करके अर्थ पाते हैं।',
      ar: 'موهبتك الروحية هي الرحمة والقدرة على إفساح المجال للآخرين. تجد المعنى من خلال الخدمة ومساعدة الآخرين على الشفاء.',
      es: 'Tu don espiritual es la compasión y la capacidad de mantener espacio para otros. Encuentras significado a través del servicio y ayudando a otros a sanar.',
      fr: 'Votre don spirituel est la compassion et la capacité de tenir l\'espace pour les autres. Vous trouvez un sens à travers le service et en aidant les autres à guérir.'
    },
    icon: '💚',
    color: 'from-green-500 to-teal-500',
    strengths: {
      en: ['Empathy', 'Compassion', 'Patience', 'Nurturing presence'],
      hi: ['सहानुभूति', 'करुणा', 'धैर्य', 'पोषणकारी उपस्थिति'],
      ar: ['التعاطف', 'الرحمة', 'الصبر', 'الحضور الراعي'],
      es: ['Empatía', 'Compasión', 'Paciencia', 'Presencia nutritiva'],
      fr: ['Empathie', 'Compassion', 'Patience', 'Présence nourrissante']
    },
    practices: {
      en: ['Volunteer work', 'Listening practice', 'Energy healing', 'Loving-kindness meditation'],
      hi: ['स्वयंसेवा कार्य', 'सुनने का अभ्यास', 'ऊर्जा उपचार', 'प्रेम-दया ध्यान'],
      ar: ['العمل التطوعي', 'ممارسة الاستماع', 'الشفاء بالطاقة', 'تأمل الحب والرحمة'],
      es: ['Trabajo voluntario', 'Práctica de escucha', 'Sanación energética', 'Meditación de bondad amorosa'],
      fr: ['Bénévolat', 'Pratique de l\'écoute', 'Guérison énergétique', 'Méditation de bienveillance']
    },
    meditations: {
      en: ['Metta (loving-kindness)', 'Tonglen', 'Heart chakra meditation'],
      hi: ['मेत्ता (प्रेम-दया)', 'टोंगलेन', 'हृदय चक्र ध्यान'],
      ar: ['ميتا (الحب والرحمة)', 'تونغلين', 'تأمل شاكرا القلب'],
      es: ['Metta (bondad amorosa)', 'Tonglen', 'Meditación del chakra del corazón'],
      fr: ['Metta (bienveillance)', 'Tonglen', 'Méditation du chakra du cœur']
    }
  },
  thinker: {
    type: 'thinker',
    title: { en: 'The Thinker', hi: 'विचारक', ar: 'المفكر', es: 'El Pensador', fr: 'Le Penseur' },
    description: {
      en: 'You approach spirituality through the mind. Your path involves deep study, contemplation, and understanding the wisdom of ancient teachings.',
      hi: 'आप मन के माध्यम से आध्यात्मिकता का दृष्टिकोण रखते हैं। आपका मार्ग गहन अध्ययन, चिंतन और प्राचीन शिक्षाओं के ज्ञान को समझना शामिल है।',
      ar: 'أنت تقترب من الروحانية من خلال العقل. يتضمن مسارك الدراسة العميقة والتأمل وفهم حكمة التعاليم القديمة.',
      es: 'Abordas la espiritualidad a través de la mente. Tu camino involucra estudio profundo, contemplación y comprensión de la sabiduría de las enseñanzas antiguas.',
      fr: 'Vous abordez la spiritualité par l\'esprit. Votre chemin implique une étude approfondie, la contemplation et la compréhension de la sagesse des enseignements anciens.'
    },
    icon: '🧠',
    color: 'from-purple-500 to-indigo-500',
    strengths: {
      en: ['Analytical mind', 'Discernment', 'Focus', 'Deep understanding'],
      hi: ['विश्लेषणात्मक मन', 'विवेक', 'एकाग्रता', 'गहरी समझ'],
      ar: ['العقل التحليلي', 'التمييز', 'التركيز', 'الفهم العميق'],
      es: ['Mente analítica', 'Discernimiento', 'Enfoque', 'Comprensión profunda'],
      fr: ['Esprit analytique', 'Discernement', 'Concentration', 'Compréhension profonde']
    },
    practices: {
      en: ['Scripture study', 'Philosophical inquiry', 'Contemplation', 'Teaching'],
      hi: ['शास्त्र अध्ययन', 'दार्शनिक जांच', 'चिंतन', 'शिक्षण'],
      ar: ['دراسة الكتب المقدسة', 'البحث الفلسفي', 'التأمل', 'التعليم'],
      es: ['Estudio de escrituras', 'Investigación filosófica', 'Contemplación', 'Enseñanza'],
      fr: ['Étude des écritures', 'Enquête philosophique', 'Contemplation', 'Enseignement']
    },
    meditations: {
      en: ['Self-inquiry', 'Zen koan practice', 'Analytical meditation'],
      hi: ['आत्म-जांच', 'ज़ेन कोआन अभ्यास', 'विश्लेषणात्मक ध्यान'],
      ar: ['التحقيق الذاتي', 'ممارسة زن كوان', 'التأمل التحليلي'],
      es: ['Auto-indagación', 'Práctica de koan Zen', 'Meditación analítica'],
      fr: ['Auto-enquête', 'Pratique du koan Zen', 'Méditation analytique']
    }
  },
  devotee: {
    type: 'devotee',
    title: { en: 'The Devotee', hi: 'भक्त', ar: 'المتعبد', es: 'El Devoto', fr: 'Le Dévot' },
    description: {
      en: 'Your path is through the heart. You experience the divine through love, surrender, and devotional practices. Faith is your guiding light.',
      hi: 'आपका मार्ग हृदय के माध्यम से है। आप प्रेम, समर्पण और भक्ति अभ्यासों के माध्यम से दिव्यता का अनुभव करते हैं। विश्वास आपका मार्गदर्शक प्रकाश है।',
      ar: 'مسارك هو من خلال القلب. تختبر الإلهي من خلال الحب والاستسلام والممارسات التعبدية. الإيمان هو نورك الهادي.',
      es: 'Tu camino es a través del corazón. Experimentas lo divino a través del amor, la entrega y las prácticas devocionales. La fe es tu luz guía.',
      fr: 'Votre chemin passe par le cœur. Vous expérimentez le divin à travers l\'amour, l\'abandon et les pratiques dévotionnelles. La foi est votre lumière guide.'
    },
    icon: '🙏',
    color: 'from-amber-500 to-orange-500',
    strengths: {
      en: ['Deep faith', 'Surrender', 'Devotion', 'Heart-centered living'],
      hi: ['गहरा विश्वास', 'समर्पण', 'भक्ति', 'हृदय-केंद्रित जीवन'],
      ar: ['إيمان عميق', 'الاستسلام', 'الإخلاص', 'العيش بقلب محوري'],
      es: ['Fe profunda', 'Entrega', 'Devoción', 'Vida centrada en el corazón'],
      fr: ['Foi profonde', 'Abandon', 'Dévotion', 'Vie centrée sur le cœur']
    },
    practices: {
      en: ['Prayer', 'Chanting', 'Worship rituals', 'Pilgrimage'],
      hi: ['प्रार्थना', 'जप', 'पूजा अनुष्ठान', 'तीर्थ यात्रा'],
      ar: ['الصلاة', 'الترتيل', 'طقوس العبادة', 'الحج'],
      es: ['Oración', 'Canto', 'Rituales de adoración', 'Peregrinación'],
      fr: ['Prière', 'Chant', 'Rituels de culte', 'Pèlerinage']
    },
    meditations: {
      en: ['Mantra meditation', 'Bhakti practices', 'Prayer meditation'],
      hi: ['मंत्र ध्यान', 'भक्ति अभ्यास', 'प्रार्थना ध्यान'],
      ar: ['تأمل المانترا', 'ممارسات بهاكتي', 'تأمل الصلاة'],
      es: ['Meditación con mantra', 'Prácticas de bhakti', 'Meditación de oración'],
      fr: ['Méditation avec mantra', 'Pratiques de bhakti', 'Méditation de prière']
    }
  }
};

export const calculatePersonalityType = (answers: string[]): { type: PersonalityType; scores: Record<PersonalityType, number> } => {
  const scores: Record<PersonalityType, number> = { seeker: 0, healer: 0, thinker: 0, devotee: 0 };
  
  answers.forEach((answer, index) => {
    const question = personalityQuestions[index];
    const option = question?.options.find(o => o.value === answer);
    if (option) {
      scores.seeker += option.scores.seeker;
      scores.healer += option.scores.healer;
      scores.thinker += option.scores.thinker;
      scores.devotee += option.scores.devotee;
    }
  });
  
  const maxScore = Math.max(...Object.values(scores));
  const type = (Object.keys(scores) as PersonalityType[]).find(k => scores[k] === maxScore) || 'seeker';
  
  return { type, scores };
};
