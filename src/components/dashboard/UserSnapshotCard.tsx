import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Moon, Sun, Star, Sparkles } from 'lucide-react';

interface UserSnapshotCardProps {
  profile: any;
  mahadasha: any;
  panchang: any;
}

const UserSnapshotCard = ({ profile, mahadasha, panchang }: UserSnapshotCardProps) => {
  const { language } = useAuth();

  const translations = {
    en: {
      welcome: 'Welcome',
      lagna: 'Lagna (Ascendant)',
      moonSign: 'Moon Sign',
      nakshatra: 'Nakshatra',
      rulingPlanet: "Today's Ruling Planet",
      currentDasha: 'Current Dasha',
      mahadasha: 'Mahadasha',
      antardasha: 'Antardasha',
    },
    hi: {
      welcome: 'स्वागत है',
      lagna: 'लग्न',
      moonSign: 'चंद्र राशि',
      nakshatra: 'नक्षत्र',
      rulingPlanet: 'आज का शासक ग्रह',
      currentDasha: 'वर्तमान दशा',
      mahadasha: 'महादशा',
      antardasha: 'अंतर्दशा',
    }
  };

  const t = translations[language] || translations.en;

  const lagnaSignTranslations: Record<string, string> = {
    Aries: 'मेष', Taurus: 'वृषभ', Gemini: 'मिथुन', Cancer: 'कर्क',
    Leo: 'सिंह', Virgo: 'कन्या', Libra: 'तुला', Scorpio: 'वृश्चिक',
    Sagittarius: 'धनु', Capricorn: 'मकर', Aquarius: 'कुंभ', Pisces: 'मीन'
  };

  const planetTranslations: Record<string, string> = {
    Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
    Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु'
  };

  const getDayRulingPlanet = () => {
    const dayPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const dayOfWeek = new Date().getDay();
    return dayPlanets[dayOfWeek];
  };

  const rulingPlanet = getDayRulingPlanet();

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* User Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-cinzel text-gradient-gold">
                {t.welcome}, {profile?.full_name || 'User'}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  <Sun className="w-3 h-3 mr-1" />
                  {t.lagna}: {language === 'hi' && lagnaSignTranslations[profile?.lagna] ? lagnaSignTranslations[profile?.lagna] : profile?.lagna || 'N/A'}
                </Badge>
                <Badge variant="secondary" className="bg-secondary/40">
                  <Moon className="w-3 h-3 mr-1" />
                  {t.moonSign}: {language === 'hi' && lagnaSignTranslations[profile?.moon_sign] ? lagnaSignTranslations[profile?.moon_sign] : profile?.moon_sign || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Nakshatra & Ruling Planet */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur">
              <Star className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{t.nakshatra}</p>
              <p className="font-semibold text-foreground">{profile?.nakshatra || 'Ashwini'}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50 backdrop-blur">
              <Sparkles className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{t.rulingPlanet}</p>
              <p className="font-semibold text-foreground">
                {language === 'hi' ? planetTranslations[rulingPlanet] : rulingPlanet}
              </p>
            </div>
          </div>

          {/* Current Dasha */}
          {mahadasha && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground mb-2">{t.currentDasha}</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{t.mahadasha}</p>
                  <p className="font-bold text-primary">
                    {language === 'hi' && planetTranslations[mahadasha.current_mahadasha]
                      ? planetTranslations[mahadasha.current_mahadasha]
                      : mahadasha.current_mahadasha}
                  </p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">{t.antardasha}</p>
                  <p className="font-semibold text-secondary-foreground">
                    {language === 'hi' && planetTranslations[mahadasha.current_antardasha]
                      ? planetTranslations[mahadasha.current_antardasha]
                      : mahadasha.current_antardasha}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSnapshotCard;
