// Global translations for 5 languages: English, Hindi, Arabic, Spanish, French

export type GlobalLanguage = 'en' | 'hi' | 'ar' | 'es' | 'fr';

export const languageNames: Record<GlobalLanguage, string> = {
  en: 'English',
  hi: 'हिंदी',
  ar: 'العربية',
  es: 'Español',
  fr: 'Français'
};

export const languageFlags: Record<GlobalLanguage, string> = {
  en: '🇺🇸',
  hi: '🇮🇳',
  ar: '🇸🇦',
  es: '🇪🇸',
  fr: '🇫🇷'
};

export const isRTL = (lang: GlobalLanguage): boolean => lang === 'ar';

// Core UI translations
export const uiTranslations: Record<string, Record<GlobalLanguage, string>> = {
  // Navigation
  home: { en: 'Home', hi: 'होम', ar: 'الرئيسية', es: 'Inicio', fr: 'Accueil' },
  horoscope: { en: 'Horoscope', hi: 'राशिफल', ar: 'الأبراج', es: 'Horóscopo', fr: 'Horoscope' },
  kundli: { en: 'Kundli', hi: 'कुंडली', ar: 'خريطة الولادة', es: 'Kundli', fr: 'Kundli' },
  compatibility: { en: 'Compatibility', hi: 'संगतता', ar: 'التوافق', es: 'Compatibilidad', fr: 'Compatibilité' },
  meditation: { en: 'Meditation', hi: 'ध्यान', ar: 'التأمل', es: 'Meditación', fr: 'Méditation' },
  profile: { en: 'Profile', hi: 'प्रोफाइल', ar: 'الملف الشخصي', es: 'Perfil', fr: 'Profil' },
  settings: { en: 'Settings', hi: 'सेटिंग्स', ar: 'الإعدادات', es: 'Configuración', fr: 'Paramètres' },
  signIn: { en: 'Sign In', hi: 'साइन इन', ar: 'تسجيل الدخول', es: 'Iniciar Sesión', fr: 'Connexion' },
  signOut: { en: 'Sign Out', hi: 'साइन आउट', ar: 'تسجيل الخروج', es: 'Cerrar Sesión', fr: 'Déconnexion' },
  
  // Common actions
  save: { en: 'Save', hi: 'सहेजें', ar: 'حفظ', es: 'Guardar', fr: 'Enregistrer' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', ar: 'إلغاء', es: 'Cancelar', fr: 'Annuler' },
  submit: { en: 'Submit', hi: 'सबमिट करें', ar: 'إرسال', es: 'Enviar', fr: 'Soumettre' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...', ar: 'جار التحميل...', es: 'Cargando...', fr: 'Chargement...' },
  share: { en: 'Share', hi: 'साझा करें', ar: 'مشاركة', es: 'Compartir', fr: 'Partager' },
  copy: { en: 'Copy', hi: 'कॉपी करें', ar: 'نسخ', es: 'Copiar', fr: 'Copier' },
  delete: { en: 'Delete', hi: 'हटाएं', ar: 'حذف', es: 'Eliminar', fr: 'Supprimer' },
  edit: { en: 'Edit', hi: 'संपादित करें', ar: 'تعديل', es: 'Editar', fr: 'Modifier' },
  close: { en: 'Close', hi: 'बंद करें', ar: 'إغلاق', es: 'Cerrar', fr: 'Fermer' },
  back: { en: 'Back', hi: 'वापस', ar: 'رجوع', es: 'Atrás', fr: 'Retour' },
  next: { en: 'Next', hi: 'अगला', ar: 'التالي', es: 'Siguiente', fr: 'Suivant' },
  previous: { en: 'Previous', hi: 'पिछला', ar: 'السابق', es: 'Anterior', fr: 'Précédent' },
  start: { en: 'Start', hi: 'शुरू करें', ar: 'ابدأ', es: 'Comenzar', fr: 'Commencer' },
  complete: { en: 'Complete', hi: 'पूर्ण', ar: 'اكتمل', es: 'Completo', fr: 'Terminé' },
  
  // Time periods
  today: { en: 'Today', hi: 'आज', ar: 'اليوم', es: 'Hoy', fr: 'Aujourd\'hui' },
  yesterday: { en: 'Yesterday', hi: 'कल', ar: 'أمس', es: 'Ayer', fr: 'Hier' },
  tomorrow: { en: 'Tomorrow', hi: 'कल', ar: 'غدًا', es: 'Mañana', fr: 'Demain' },
  daily: { en: 'Daily', hi: 'दैनिक', ar: 'يومي', es: 'Diario', fr: 'Quotidien' },
  weekly: { en: 'Weekly', hi: 'साप्ताहिक', ar: 'أسبوعي', es: 'Semanal', fr: 'Hebdomadaire' },
  monthly: { en: 'Monthly', hi: 'मासिक', ar: 'شهري', es: 'Mensual', fr: 'Mensuel' },
  morning: { en: 'Morning', hi: 'सुबह', ar: 'صباح', es: 'Mañana', fr: 'Matin' },
  afternoon: { en: 'Afternoon', hi: 'दोपहर', ar: 'بعد الظهر', es: 'Tarde', fr: 'Après-midi' },
  evening: { en: 'Evening', hi: 'शाम', ar: 'مساء', es: 'Noche', fr: 'Soir' },
  
  // Spiritual terms
  prayer: { en: 'Prayer', hi: 'प्रार्थना', ar: 'صلاة', es: 'Oración', fr: 'Prière' },
  gratitude: { en: 'Gratitude', hi: 'कृतज्ञता', ar: 'امتنان', es: 'Gratitud', fr: 'Gratitude' },
  kindness: { en: 'Kindness', hi: 'दयालुता', ar: 'لطف', es: 'Bondad', fr: 'Bonté' },
  mindfulness: { en: 'Mindfulness', hi: 'माइंडफुलनेस', ar: 'اليقظة', es: 'Atención Plena', fr: 'Pleine Conscience' },
  spirituality: { en: 'Spirituality', hi: 'आध्यात्मिकता', ar: 'الروحانية', es: 'Espiritualidad', fr: 'Spiritualité' },
  wisdom: { en: 'Wisdom', hi: 'ज्ञान', ar: 'حكمة', es: 'Sabiduría', fr: 'Sagesse' },
  peace: { en: 'Peace', hi: 'शांति', ar: 'سلام', es: 'Paz', fr: 'Paix' },
  love: { en: 'Love', hi: 'प्रेम', ar: 'حب', es: 'Amor', fr: 'Amour' },
  faith: { en: 'Faith', hi: 'विश्वास', ar: 'إيمان', es: 'Fe', fr: 'Foi' },
  
  // Features
  challenges: { en: 'Challenges', hi: 'चुनौतियां', ar: 'التحديات', es: 'Desafíos', fr: 'Défis' },
  lifeInsights: { en: 'Life Insights', hi: 'जीवन अंतर्दृष्टि', ar: 'رؤى الحياة', es: 'Perspectivas de Vida', fr: 'Aperçus de Vie' },
  personalityTest: { en: 'Personality Test', hi: 'व्यक्तित्व परीक्षण', ar: 'اختبار الشخصية', es: 'Test de Personalidad', fr: 'Test de Personnalité' },
  myHoroscope: { en: 'My Horoscope', hi: 'मेरा राशिफल', ar: 'برجي', es: 'Mi Horóscopo', fr: 'Mon Horoscope' },
  
  // Status
  completed: { en: 'Completed', hi: 'पूर्ण', ar: 'مكتمل', es: 'Completado', fr: 'Terminé' },
  inProgress: { en: 'In Progress', hi: 'प्रगति में', ar: 'قيد التقدم', es: 'En Progreso', fr: 'En Cours' },
  notStarted: { en: 'Not Started', hi: 'शुरू नहीं हुआ', ar: 'لم يبدأ', es: 'No Iniciado', fr: 'Non Commencé' },
  streak: { en: 'Streak', hi: 'स्ट्रीक', ar: 'سلسلة', es: 'Racha', fr: 'Série' },
  days: { en: 'days', hi: 'दिन', ar: 'أيام', es: 'días', fr: 'jours' },
  
  // Horoscope sections
  todaysEnergy: { en: "Today's Energy", hi: 'आज की ऊर्जा', ar: 'طاقة اليوم', es: 'Energía de Hoy', fr: 'Énergie du Jour' },
  careerInsight: { en: 'Career Insight', hi: 'करियर अंतर्दृष्टि', ar: 'رؤية مهنية', es: 'Perspectiva Profesional', fr: 'Aperçu Carrière' },
  loveInsight: { en: 'Love Insight', hi: 'प्रेम अंतर्दृष्टि', ar: 'رؤية الحب', es: 'Perspectiva Amorosa', fr: 'Aperçu Amour' },
  spiritualAdvice: { en: 'Spiritual Advice', hi: 'आध्यात्मिक सलाह', ar: 'نصيحة روحية', es: 'Consejo Espiritual', fr: 'Conseil Spirituel' },
  
  // Life insights
  careerGuidance: { en: 'Career Guidance', hi: 'करियर मार्गदर्शन', ar: 'التوجيه المهني', es: 'Orientación Profesional', fr: 'Orientation Professionnelle' },
  relationshipAdvice: { en: 'Relationship Advice', hi: 'रिश्ते की सलाह', ar: 'نصيحة العلاقات', es: 'Consejo de Relaciones', fr: 'Conseil Relationnel' },
  personalGrowth: { en: 'Personal Growth', hi: 'व्यक्तिगत विकास', ar: 'النمو الشخصي', es: 'Crecimiento Personal', fr: 'Développement Personnel' },
  spiritualGuidance: { en: 'Spiritual Guidance', hi: 'आध्यात्मिक मार्गदर्शन', ar: 'التوجيه الروحي', es: 'Orientación Espiritual', fr: 'Orientation Spirituelle' },
  
  // Messages
  welcomeBack: { en: 'Welcome back!', hi: 'वापसी पर स्वागत है!', ar: 'مرحبًا بعودتك!', es: '¡Bienvenido de nuevo!', fr: 'Bienvenue !' },
  goodMorning: { en: 'Good Morning', hi: 'सुप्रभात', ar: 'صباح الخير', es: 'Buenos Días', fr: 'Bonjour' },
  goodAfternoon: { en: 'Good Afternoon', hi: 'नमस्कार', ar: 'مساء الخير', es: 'Buenas Tardes', fr: 'Bon Après-midi' },
  goodEvening: { en: 'Good Evening', hi: 'शुभ संध्या', ar: 'مساء الخير', es: 'Buenas Noches', fr: 'Bonsoir' },
  error: { en: 'Error', hi: 'त्रुटि', ar: 'خطأ', es: 'Error', fr: 'Erreur' },
  success: { en: 'Success', hi: 'सफलता', ar: 'نجاح', es: 'Éxito', fr: 'Succès' },
  
  // Religion labels
  hindu: { en: 'Hindu', hi: 'हिंदू', ar: 'هندوسي', es: 'Hindú', fr: 'Hindou' },
  muslim: { en: 'Muslim', hi: 'मुस्लिम', ar: 'مسلم', es: 'Musulmán', fr: 'Musulman' },
  christian: { en: 'Christian', hi: 'ईसाई', ar: 'مسيحي', es: 'Cristiano', fr: 'Chrétien' },
  buddhist: { en: 'Buddhist', hi: 'बौद्ध', ar: 'بوذي', es: 'Budista', fr: 'Bouddhiste' },
  jain: { en: 'Jain', hi: 'जैन', ar: 'جايني', es: 'Jain', fr: 'Jaïn' },
  sikh: { en: 'Sikh', hi: 'सिख', ar: 'سيخي', es: 'Sij', fr: 'Sikh' },
  other: { en: 'Other', hi: 'अन्य', ar: 'أخرى', es: 'Otro', fr: 'Autre' }
};

export const t = (key: string, lang: GlobalLanguage): string => {
  return uiTranslations[key]?.[lang] || uiTranslations[key]?.en || key;
};

// For backwards compatibility with existing 'en' | 'hi' type
export const getGlobalLanguage = (lang: 'en' | 'hi' | string): GlobalLanguage => {
  if (lang === 'en' || lang === 'hi' || lang === 'ar' || lang === 'es' || lang === 'fr') {
    return lang as GlobalLanguage;
  }
  return 'en';
};
