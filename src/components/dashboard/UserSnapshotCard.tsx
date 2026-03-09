import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { User, Moon, Sun, Star, Sparkles, ChevronRight } from 'lucide-react';

interface UserSnapshotCardProps {
  profile: any;
  mahadasha: any;
  panchang: any;
}

const UserSnapshotCard = ({ profile, mahadasha }: UserSnapshotCardProps) => {
  const { language } = useAuth();

  const t = language === 'hi' ? {
    welcome: 'नमस्ते',
    subtitle: 'आपका आध्यात्मिक स्नैपशॉट',
    lagna: 'लग्न', moonSign: 'चंद्र राशि', nakshatra: 'नक्षत्र', rulingPlanet: 'शासक ग्रह',
    mahadasha: 'महादशा', antardasha: 'अंतर्दशा',
  } : {
    welcome: 'Welcome back',
    subtitle: 'Your spiritual snapshot',
    lagna: 'Lagna', moonSign: 'Moon Sign', nakshatra: 'Nakshatra', rulingPlanet: 'Ruling Planet',
    mahadasha: 'Mahadasha', antardasha: 'Antardasha',
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
  const d = (val: string, map: Record<string, string>) => language === 'hi' && map[val] ? map[val] : val;

  const stats = [
    { icon: Sun, label: t.lagna, value: d(profile?.lagna || 'N/A', lagnaHi), color: 'text-amber-400' },
    { icon: Moon, label: t.moonSign, value: d(profile?.moon_sign || 'N/A', lagnaHi), color: 'text-sky-400' },
    { icon: Star, label: t.nakshatra, value: profile?.nakshatra || 'N/A', color: 'text-violet-400' },
    { icon: Sparkles, label: t.rulingPlanet, value: d(rulingPlanet, planetHi), color: 'text-primary' },
  ];

  return (
    <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-card via-card to-primary/[0.03]">
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-heading font-bold text-foreground">
                {t.welcome}, {profile?.full_name?.split(' ')[0] || 'User'}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-2.5 sm:p-3 rounded-xl bg-muted/20 border border-border/20 hover:border-border/40 transition-colors">
                <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                  <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${s.color}`} />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</span>
                </div>
                <p className="font-bold text-xs sm:text-sm text-foreground font-heading">{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* Dasha Row */}
        {mahadasha && (
          <div className="mt-2.5 sm:mt-3 p-2.5 sm:p-3 rounded-xl bg-primary/[0.04] border border-primary/10 flex items-center gap-3 sm:gap-5">
            <div className="flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">{t.mahadasha}</p>
              <p className="font-bold text-xs sm:text-sm text-primary font-heading">{d(mahadasha.current_mahadasha, planetHi)}</p>
            </div>
            <div className="w-px h-7 sm:h-8 bg-border/30" />
            <div className="flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">{t.antardasha}</p>
              <p className="font-bold text-xs sm:text-sm text-foreground font-heading">{d(mahadasha.current_antardasha, planetHi)}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSnapshotCard;
