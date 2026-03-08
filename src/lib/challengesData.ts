import { Religion } from './faithModules';

export interface ChallengeTask {
  day: number;
  title: { en: string; hi: string; ar: string; es: string; fr: string };
  description: { en: string; hi: string; ar: string; es: string; fr: string };
}

export interface SpiritualChallenge {
  key: string;
  title: { en: string; hi: string; ar: string; es: string; fr: string };
  description: { en: string; hi: string; ar: string; es: string; fr: string };
  duration: number; // days
  icon: string;
  category: 'meditation' | 'gratitude' | 'kindness' | 'prayer' | 'mindfulness' | 'discipline';
  religions: Religion[] | 'all';
  tasks: ChallengeTask[];
  reward: {
    badge: string;
    title: { en: string; hi: string; ar: string; es: string; fr: string };
  };
}

export const spiritualChallenges: SpiritualChallenge[] = [
  {
    key: 'meditation_7',
    title: { en: '7-Day Meditation', hi: '7 दिन का ध्यान', ar: 'تأمل 7 أيام', es: 'Meditación 7 Días', fr: 'Méditation 7 Jours' },
    description: { 
      en: 'Begin your meditation journey with 10 minutes daily for 7 days.', 
      hi: '7 दिनों के लिए प्रतिदिन 10 मिनट ध्यान करें।',
      ar: 'ابدأ رحلة التأمل بـ 10 دقائق يوميًا لمدة 7 أيام.',
      es: 'Comienza tu viaje de meditación con 10 minutos diarios durante 7 días.',
      fr: 'Commencez votre voyage de méditation avec 10 minutes par jour pendant 7 jours.'
    },
    duration: 7,
    icon: '🧘',
    category: 'meditation',
    religions: 'all',
    tasks: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      title: { en: `Day ${i + 1}: Meditation`, hi: `दिन ${i + 1}: ध्यान`, ar: `اليوم ${i + 1}: تأمل`, es: `Día ${i + 1}: Meditación`, fr: `Jour ${i + 1}: Méditation` },
      description: { 
        en: 'Meditate for at least 10 minutes today.', 
        hi: 'आज कम से कम 10 मिनट ध्यान करें।',
        ar: 'تأمل لمدة 10 دقائق على الأقل اليوم.',
        es: 'Medita al menos 10 minutos hoy.',
        fr: 'Méditez au moins 10 minutes aujourd\'hui.'
      }
    })),
    reward: { badge: '🧘‍♂️', title: { en: 'Meditation Starter', hi: 'ध्यान प्रारंभकर्ता', ar: 'مبتدئ التأمل', es: 'Iniciador de Meditación', fr: 'Débutant en Méditation' } }
  },
  {
    key: 'gratitude_21',
    title: { en: '21-Day Gratitude', hi: '21 दिन की कृतज्ञता', ar: 'امتنان 21 يومًا', es: 'Gratitud 21 Días', fr: 'Gratitude 21 Jours' },
    description: { 
      en: 'Transform your mindset by practicing gratitude daily for 21 days.', 
      hi: '21 दिनों के लिए प्रतिदिन कृतज्ञता का अभ्यास करें।',
      ar: 'غير عقليتك من خلال ممارسة الامتنان يوميًا لمدة 21 يومًا.',
      es: 'Transforma tu mentalidad practicando gratitud diaria durante 21 días.',
      fr: 'Transformez votre état d\'esprit en pratiquant la gratitude quotidienne pendant 21 jours.'
    },
    duration: 21,
    icon: '🙏',
    category: 'gratitude',
    religions: 'all',
    tasks: Array.from({ length: 21 }, (_, i) => ({
      day: i + 1,
      title: { en: `Day ${i + 1}: Gratitude`, hi: `दिन ${i + 1}: कृतज्ञता`, ar: `اليوم ${i + 1}: امتنان`, es: `Día ${i + 1}: Gratitud`, fr: `Jour ${i + 1}: Gratitude` },
      description: { 
        en: 'Write 3 things you are grateful for today.', 
        hi: 'आज आप किन 3 चीजों के लिए आभारी हैं लिखें।',
        ar: 'اكتب 3 أشياء تشعر بالامتنان لها اليوم.',
        es: 'Escribe 3 cosas por las que estás agradecido hoy.',
        fr: 'Écrivez 3 choses pour lesquelles vous êtes reconnaissant aujourd\'hui.'
      }
    })),
    reward: { badge: '💖', title: { en: 'Gratitude Master', hi: 'कृतज्ञता मास्टर', ar: 'سيد الامتنان', es: 'Maestro de Gratitud', fr: 'Maître de la Gratitude' } }
  },
  {
    key: 'kindness_30',
    title: { en: '30-Day Kindness', hi: '30 दिन की दयालुता', ar: '30 يومًا من اللطف', es: '30 Días de Bondad', fr: '30 Jours de Bonté' },
    description: { 
      en: 'Perform one act of kindness every day for 30 days.', 
      hi: '30 दिनों के लिए प्रतिदिन एक दयालु कार्य करें।',
      ar: 'قم بعمل طيب واحد كل يوم لمدة 30 يومًا.',
      es: 'Realiza un acto de bondad cada día durante 30 días.',
      fr: 'Effectuez un acte de bonté chaque jour pendant 30 jours.'
    },
    duration: 30,
    icon: '💝',
    category: 'kindness',
    religions: 'all',
    tasks: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      title: { en: `Day ${i + 1}: Kindness`, hi: `दिन ${i + 1}: दयालुता`, ar: `اليوم ${i + 1}: لطف`, es: `Día ${i + 1}: Bondad`, fr: `Jour ${i + 1}: Bonté` },
      description: { 
        en: 'Do one kind act for someone today.', 
        hi: 'आज किसी के लिए एक दयालु कार्य करें।',
        ar: 'قم بعمل طيب لشخص ما اليوم.',
        es: 'Haz un acto bondadoso por alguien hoy.',
        fr: 'Faites un acte gentil pour quelqu\'un aujourd\'hui.'
      }
    })),
    reward: { badge: '👼', title: { en: 'Kindness Champion', hi: 'दयालुता चैंपियन', ar: 'بطل اللطف', es: 'Campeón de Bondad', fr: 'Champion de Bonté' } }
  },
  {
    key: 'prayer_14',
    title: { en: '14-Day Prayer', hi: '14 दिन की प्रार्थना', ar: '14 يومًا من الصلاة', es: '14 Días de Oración', fr: '14 Jours de Prière' },
    description: { 
      en: 'Deepen your connection through daily prayer for 14 days.', 
      hi: '14 दिनों के लिए प्रतिदिन प्रार्थना के माध्यम से अपने संबंध को गहरा करें।',
      ar: 'عمق اتصالك من خلال الصلاة اليومية لمدة 14 يومًا.',
      es: 'Profundiza tu conexión a través de la oración diaria durante 14 días.',
      fr: 'Approfondissez votre connexion par la prière quotidienne pendant 14 jours.'
    },
    duration: 14,
    icon: '🙏',
    category: 'prayer',
    religions: 'all',
    tasks: Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      title: { en: `Day ${i + 1}: Prayer`, hi: `दिन ${i + 1}: प्रार्थना`, ar: `اليوم ${i + 1}: صلاة`, es: `Día ${i + 1}: Oración`, fr: `Jour ${i + 1}: Prière` },
      description: { 
        en: 'Spend 15 minutes in prayer or devotion today.', 
        hi: 'आज 15 मिनट प्रार्थना या भक्ति में बिताएं।',
        ar: 'اقضِ 15 دقيقة في الصلاة أو العبادة اليوم.',
        es: 'Dedica 15 minutos a la oración o devoción hoy.',
        fr: 'Passez 15 minutes en prière ou en dévotion aujourd\'hui.'
      }
    })),
    reward: { badge: '✨', title: { en: 'Devoted Soul', hi: 'समर्पित आत्मा', ar: 'روح مخلصة', es: 'Alma Devota', fr: 'Âme Dévouée' } }
  },
  {
    key: 'mindfulness_10',
    title: { en: '10-Day Mindfulness', hi: '10 दिन का माइंडफुलनेस', ar: '10 أيام من اليقظة', es: '10 Días de Atención Plena', fr: '10 Jours de Pleine Conscience' },
    description: { 
      en: 'Practice being present and mindful for 10 days.', 
      hi: '10 दिनों के लिए वर्तमान में रहने का अभ्यास करें।',
      ar: 'مارس التواجد واليقظة لمدة 10 أيام.',
      es: 'Practica estar presente y consciente durante 10 días.',
      fr: 'Pratiquez la présence et la pleine conscience pendant 10 jours.'
    },
    duration: 10,
    icon: '🌸',
    category: 'mindfulness',
    religions: 'all',
    tasks: Array.from({ length: 10 }, (_, i) => ({
      day: i + 1,
      title: { en: `Day ${i + 1}: Mindfulness`, hi: `दिन ${i + 1}: माइंडफुलनेस`, ar: `اليوم ${i + 1}: يقظة`, es: `Día ${i + 1}: Atención`, fr: `Jour ${i + 1}: Conscience` },
      description: { 
        en: 'Practice 5 minutes of mindful breathing.', 
        hi: '5 मिनट सचेत श्वास का अभ्यास करें।',
        ar: 'مارس 5 دقائق من التنفس الواعي.',
        es: 'Practica 5 minutos de respiración consciente.',
        fr: 'Pratiquez 5 minutes de respiration consciente.'
      }
    })),
    reward: { badge: '🌟', title: { en: 'Mindful Being', hi: 'सचेत व्यक्ति', ar: 'كائن واعي', es: 'Ser Consciente', fr: 'Être Conscient' } }
  },
  {
    key: 'discipline_15',
    title: { en: '15-Day Discipline', hi: '15 दिन का अनुशासन', ar: '15 يومًا من الانضباط', es: '15 Días de Disciplina', fr: '15 Jours de Discipline' },
    description: { 
      en: 'Build spiritual discipline with early rising and routine for 15 days.', 
      hi: '15 दिनों के लिए जल्दी उठने और दिनचर्या के साथ आध्यात्मिक अनुशासन बनाएं।',
      ar: 'بناء الانضباط الروحي بالاستيقاظ المبكر والروتين لمدة 15 يومًا.',
      es: 'Construye disciplina espiritual con madrugar y rutina durante 15 días.',
      fr: 'Construisez la discipline spirituelle avec un lever matinal et une routine pendant 15 jours.'
    },
    duration: 15,
    icon: '⏰',
    category: 'discipline',
    religions: 'all',
    tasks: Array.from({ length: 15 }, (_, i) => ({
      day: i + 1,
      title: { en: `Day ${i + 1}: Discipline`, hi: `दिन ${i + 1}: अनुशासन`, ar: `اليوم ${i + 1}: انضباط`, es: `Día ${i + 1}: Disciplina`, fr: `Jour ${i + 1}: Discipline` },
      description: { 
        en: 'Wake up early and follow your spiritual routine.', 
        hi: 'जल्दी उठें और अपनी आध्यात्मिक दिनचर्या का पालन करें।',
        ar: 'استيقظ مبكرًا واتبع روتينك الروحي.',
        es: 'Despierta temprano y sigue tu rutina espiritual.',
        fr: 'Réveillez-vous tôt et suivez votre routine spirituelle.'
      }
    })),
    reward: { badge: '🏆', title: { en: 'Disciplined Soul', hi: 'अनुशासित आत्मा', ar: 'روح منضبطة', es: 'Alma Disciplinada', fr: 'Âme Disciplinée' } }
  }
];

export const getChallengesByReligion = (religion: Religion): SpiritualChallenge[] => {
  return spiritualChallenges.filter(c => c.religions === 'all' || c.religions.includes(religion));
};

export const getChallengeByKey = (key: string): SpiritualChallenge | undefined => {
  return spiritualChallenges.find(c => c.key === key);
};
