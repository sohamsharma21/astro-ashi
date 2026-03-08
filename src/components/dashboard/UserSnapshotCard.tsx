import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { User, Moon, Sun, Star, Sparkles } from 'lucide-react';

interface UserSnapshotCardProps {
  profile: any;
  mahadasha: any;
  panchang: any;
}

const UserSnapshotCard = ({ profile, mahadasha, panchang }: UserSnapshotCardProps) => {
  const { language } = useAuth();

  const t = language === 'hi' ? {
    welcome: 'नमस्ते',
    lagna: 'लग्न',
    moonSign: 'चंद्र राशि',
    nakshatra: 'नक्षत्र',
    rulingPlanet: 'शासक ग्रह',
    mahadasha: 'महादशा',
    antardasha: 'अंतर्दशा',
  } : {
    welcome: 'Welcome back',
    lagna: 'Lagna',
    moonSign: 'Moon Sign',
    nakshatra: 'Nakshatra',
    rulingPlanet: 'Ruling Planet',
    mahadasha: 'Mahadasha',
    antardasha: 'Antardasha',
  };

  const lagnaHi: Record<string, string> = {
    Aries: 'मेष', Taurus: 'वृषभ', Gemini: 'मिथुन', Cancer: 'कर्क',
    Leo: 'सिंह', Virgo: 'कन्या', Libra: 'तुला', Scorpio: 'वृश्चिक',
    Sagittarius: 'धनु', Capricorn: 'मकर', Aquarius: 'कुंभ', Pisces: 'मीन'
  };

  const planetHi: Record<string, string> = {
    Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
    Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु'
  };

  const getDayRulingPlanet = () => {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    return planets[new Date().getDay()];
  };

  const rulingPlanet = getDayRulingPlanet();
  const displayLagna = (val: string) => language === 'hi' && lagnaHi[val] ? lagnaHi[val] : val;
  const displayPlanet = (val: string) => language === 'hi' && planetHi[val] ? planetHi[val] : val;

  return (
    <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-primary/5">
      <CardContent className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">
              {t.welcome}, {profile?.full_name?.split(' ')[0] || 'User'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {language === 'hi' ? 'आपका आध्यात्मिक स्नैपशॉट' : 'Your spiritual snapshot'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Sun className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t.lagna}</span>
            </div>
            <p className="font-semibold text-sm text-foreground">{displayLagna(profile?.lagna || 'N/A')}</p>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Moon className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t.moonSign}</span>
            </div>
            <p className="font-semibold text-sm text-foreground">{displayLagna(profile?.moon_sign || 'N/A')}</p>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t.nakshatra}</span>
            </div>
            <p className="font-semibold text-sm text-foreground">{profile?.nakshatra || 'Ashwini'}</p>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t.rulingPlanet}</span>
            </div>
            <p className="font-semibold text-sm text-foreground">{displayPlanet(rulingPlanet)}</p>
          </div>
        </div>

        {/* Dasha Row */}
        {mahadasha && (
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t.mahadasha}</p>
              <p className="font-bold text-sm text-primary">{displayPlanet(mahadasha.current_mahadasha)}</p>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t.antardasha}</p>
              <p className="font-semibold text-sm text-foreground">{displayPlanet(mahadasha.current_antardasha)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSnapshotCard;
