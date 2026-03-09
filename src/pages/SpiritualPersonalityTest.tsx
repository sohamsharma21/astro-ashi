import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Sparkles, RotateCcw, Share2, CheckCircle } from 'lucide-react';
import { personalityQuestions, personalityResults, calculatePersonalityType, PersonalityType, PersonalityResult, Language } from '@/lib/personalityTestData';
import { GlobalLanguage, getGlobalLanguage } from '@/lib/globalTranslations';

const SpiritualPersonalityTest = () => {
  const { user, language } = useAuth();
  const lang = getGlobalLanguage(language) as Language;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [savedResult, setSavedResult] = useState<PersonalityResult | null>(null);

  const labels = {
    en: { title: 'Spiritual Personality Test', subtitle: 'Discover your spiritual archetype', question: 'Question', of: 'of', next: 'Next', back: 'Back', seeResult: 'See My Personality', retake: 'Retake Test', share: 'Share Result', yourType: 'Your Spiritual Personality', strengths: 'Your Strengths', practices: 'Recommended Practices', meditations: 'Suggested Meditations', saved: 'Result saved!' },
    hi: { title: 'आध्यात्मिक व्यक्तित्व परीक्षण', subtitle: 'अपने आध्यात्मिक स्वरूप की खोज करें', question: 'प्रश्न', of: 'का', next: 'अगला', back: 'पीछे', seeResult: 'मेरा व्यक्तित्व देखें', retake: 'फिर से परीक्षण करें', share: 'परिणाम साझा करें', yourType: 'आपका आध्यात्मिक व्यक्तित्व', strengths: 'आपकी ताकत', practices: 'अनुशंसित अभ्यास', meditations: 'सुझाए गए ध्यान', saved: 'परिणाम सहेजा गया!' },
    ar: { title: 'اختبار الشخصية الروحية', subtitle: 'اكتشف نموذجك الروحي', question: 'سؤال', of: 'من', next: 'التالي', back: 'رجوع', seeResult: 'شاهد شخصيتي', retake: 'إعادة الاختبار', share: 'مشاركة النتيجة', yourType: 'شخصيتك الروحية', strengths: 'نقاط قوتك', practices: 'ممارسات موصى بها', meditations: 'تأملات مقترحة', saved: 'تم حفظ النتيجة!' },
    es: { title: 'Test de Personalidad Espiritual', subtitle: 'Descubre tu arquetipo espiritual', question: 'Pregunta', of: 'de', next: 'Siguiente', back: 'Atrás', seeResult: 'Ver Mi Personalidad', retake: 'Repetir Test', share: 'Compartir Resultado', yourType: 'Tu Personalidad Espiritual', strengths: 'Tus Fortalezas', practices: 'Prácticas Recomendadas', meditations: 'Meditaciones Sugeridas', saved: '¡Resultado guardado!' },
    fr: { title: 'Test de Personnalité Spirituelle', subtitle: 'Découvrez votre archétype spirituel', question: 'Question', of: 'sur', next: 'Suivant', back: 'Retour', seeResult: 'Voir Ma Personnalité', retake: 'Refaire le Test', share: 'Partager le Résultat', yourType: 'Votre Personnalité Spirituelle', strengths: 'Vos Forces', practices: 'Pratiques Recommandées', meditations: 'Méditations Suggérées', saved: 'Résultat enregistré!' }
  };
  const lb = labels[lang] || labels.en;

  useEffect(() => {
    if (user) loadSavedResult();
  }, [user]);

  const loadSavedResult = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('spiritual_personality_results')
      .select('*')
      .eq('user_id', user.id)
      .order('taken_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setSavedResult(personalityResults[data.personality_type as PersonalityType]);
    }
  };

  const selectAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const goNext = () => {
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = async () => {
    const { type, scores } = calculatePersonalityType(answers);
    const resultData = personalityResults[type];
    setResult(resultData);
    setShowResult(true);

    // Save to database
    if (user) {
      await supabase.from('spiritual_personality_results').insert({
        user_id: user.id,
        personality_type: type,
        answers,
        scores
      });
      toast.success(lb.saved);
    }
  };

  const retakeTest = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setResult(null);
    setShowResult(false);
  };

  const shareResult = async () => {
    if (!result) return;
    const text = `I discovered my spiritual personality: ${result.title[lang] || result.title.en} ${result.icon} - Take the test on AstroAshi!`;
    if (navigator.share) {
      await navigator.share({ title: lb.title, text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success(lang === 'hi' ? 'कॉपी हो गया!' : 'Copied!');
    }
  };

  const question = personalityQuestions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / personalityQuestions.length) * 100;

  return (
    <>
      <SEOHead title={`${lb.title} - AstroAshi`} description={lb.subtitle} canonical="/personality-test" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={120} />
        <Navigation />

        <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl md:max-w-3xl mx-auto">
            
            {/* Show saved result prompt */}
            {savedResult && !showResult && answers.length === 0 && (
              <Card className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="py-4 text-center">
                  <span className="text-4xl mb-2 block">{savedResult.icon}</span>
                  <p className="text-sm text-muted-foreground mb-2">{lb.yourType}</p>
                  <p className="font-semibold text-lg">{savedResult.title[lang] || savedResult.title.en}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={retakeTest}>
                    <RotateCcw className="w-4 h-4 mr-2" /> {lb.retake}
                  </Button>
                </CardContent>
              </Card>
            )}

            {!showResult ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-cinzel text-gradient-gold mb-2">{lb.title}</h1>
                  <p className="text-muted-foreground">{lb.subtitle}</p>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>{lb.question} {currentQuestion + 1} {lb.of} {personalityQuestions.length}</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg text-center">
                          {question.question[lang] || question.question.en}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {question.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => selectAnswer(option.value)}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${
                              answers[currentQuestion] === option.value
                                ? 'bg-primary/20 border-primary/50'
                                : 'bg-muted/30 border-border/50 hover:bg-muted/50 hover:border-primary/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                answers[currentQuestion] === option.value ? 'border-primary bg-primary' : 'border-muted-foreground'
                              }`}>
                                {answers[currentQuestion] === option.value && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-sm">{option.label[lang] || option.label.en}</span>
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={goBack} disabled={currentQuestion === 0}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> {lb.back}
                  </Button>
                  {currentQuestion < personalityQuestions.length - 1 ? (
                    <Button onClick={goNext} disabled={!answers[currentQuestion]}>
                      {lb.next} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={calculateResult} disabled={!answers[currentQuestion]} className="cosmic-button">
                      <Sparkles className="w-4 h-4 mr-2" /> {lb.seeResult}
                    </Button>
                  )}
                </div>
              </>
            ) : result && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                {/* Result Header */}
                <Card className={`bg-gradient-to-br ${result.color} border-none text-center py-8`}>
                  <span className="text-7xl mb-4 block">{result.icon}</span>
                  <p className="text-sm text-white/70 mb-1">{lb.yourType}</p>
                  <h2 className="text-3xl font-cinzel font-bold text-white">{result.title[lang] || result.title.en}</h2>
                </Card>

                {/* Description */}
                <Card>
                  <CardContent className="py-5">
                    <p className="text-foreground/90">{result.description[lang] || result.description.en}</p>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{lb.strengths}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(result.strengths[lang] || result.strengths.en).map((s, i) => (
                        <Badge key={i} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Practices */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{lb.practices}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(result.practices[lang] || result.practices.en).map((p, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" /> {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Meditations */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{lb.meditations}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(result.meditations[lang] || result.meditations.en).map((m, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-primary" /> {m}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={retakeTest}>
                    <RotateCcw className="w-4 h-4 mr-2" /> {lb.retake}
                  </Button>
                  <Button className="flex-1 cosmic-button" onClick={shareResult}>
                    <Share2 className="w-4 h-4 mr-2" /> {lb.share}
                  </Button>
                </div>
              </motion.div>
            )}

          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SpiritualPersonalityTest;
