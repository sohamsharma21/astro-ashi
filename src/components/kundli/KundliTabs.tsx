import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Loader2, Star, Gem, Palette, Hash, CalendarDays, BookOpen } from 'lucide-react';
import type { StructuredInsights } from '@/hooks/useKundli';

interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
}

interface House {
  house: number;
  sign: string;
  planets: string[];
}

interface KundliTabsProps {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  ascendant: string;
  planetPositions: PlanetPosition[];
  houses: House[];
  insights?: string;
  structured?: StructuredInsights | null;
  language: 'en' | 'hi';
  loadingInsights?: boolean;
}

const planetEmoji: Record<string, string> = {
  Sun: '☀️', Moon: '🌙', Mercury: '💫', Venus: '💖', Mars: '🔴',
  Jupiter: '🟡', Saturn: '🪐', Rahu: '🐍', Ketu: '🔮',
};

const KundliTabs = ({
  name, birthDate, birthTime, birthPlace, ascendant,
  planetPositions, houses, insights, structured, language, loadingInsights,
}: KundliTabsProps) => {
  const hi = language === 'hi';

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(hi ? 'hi-IN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Signs summary
  const moonSign = planetPositions.find(p => p.planet === 'Moon')?.sign || '';
  const sunSign = planetPositions.find(p => p.planet === 'Sun')?.sign || '';

  return (
    <div className="space-y-6">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: hi ? 'सूर्य राशि' : 'Sun Sign', value: structured?.summary?.zodiacSign || sunSign, icon: '☀️', desc: structured?.summary?.zodiacDescription },
          { label: hi ? 'चंद्र राशि' : 'Moon Sign', value: structured?.summary?.moonSign || moonSign, icon: '🌙', desc: structured?.summary?.moonSignDescription },
          { label: hi ? 'लग्न राशि' : 'Rising Sign', value: structured?.summary?.risingSign || ascendant, icon: '⬆️', desc: structured?.summary?.risingSignDescription },
          { label: hi ? 'तत्व' : 'Element', value: structured?.summary?.element || '—', icon: '🔥', desc: structured?.summary?.rulingPlanet ? `${hi ? 'शासक' : 'Ruler'}: ${structured.summary.rulingPlanet}` : undefined },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-3 sm:p-4 border-primary/20 bg-card/60 backdrop-blur text-center h-full">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              <p className="font-bold text-foreground text-sm sm:text-base">{item.value}</p>
              {item.desc && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{item.desc}</p>}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Birth Details */}
      <Card className="p-5 border-primary/20 bg-card/60 backdrop-blur">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          {hi ? 'जन्म विवरण' : 'Birth Details'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { l: hi ? 'नाम' : 'Name', v: name },
            { l: hi ? 'जन्म तिथि' : 'Date', v: formatDate(birthDate) },
            { l: hi ? 'जन्म समय' : 'Time', v: birthTime },
            { l: hi ? 'जन्म स्थान' : 'Place', v: birthPlace },
          ].map((f, i) => (
            <div key={i}>
              <p className="text-xs text-muted-foreground">{f.l}</p>
              <p className="font-semibold text-foreground">{f.v}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Planet Positions Table */}
      <Card className="p-5 border-primary/20 bg-card/60 backdrop-blur">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          {hi ? 'ग्रह स्थिति' : 'Planet Positions'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {planetPositions.map((p, i) => (
            <motion.div key={p.planet} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/40"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{planetEmoji[p.planet] || '⭐'}</span>
                <span className="font-medium text-foreground text-sm">{p.planet}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-primary">{p.sign}</span>
                <span className="text-xs text-muted-foreground ml-1.5">{p.degree.toFixed(1)}°</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* House Details */}
      <Card className="p-5 border-primary/20 bg-card/60 backdrop-blur">
        <h3 className="font-bold text-foreground mb-4">{hi ? 'भाव विवरण' : 'House Details'}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {houses.map((h) => (
            <div key={h.house} className="p-3 rounded-xl bg-background/50 border border-border/40">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-xs">{hi ? `भाव ${h.house}` : `H${h.house}`}</Badge>
                <span className="text-xs font-semibold text-primary">{h.sign}</span>
              </div>
              {h.planets.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1.5">{h.planets.map(p => planetEmoji[p] || p).join(' ')}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* AI Interpretation Cards */}
      {loadingInsights ? (
        <Card className="p-8 border-primary/20 bg-card/60 backdrop-blur flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">{hi ? 'AI अंतर्दृष्टि उत्पन्न हो रही है...' : 'Generating AI insights...'}</p>
        </Card>
      ) : structured ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground text-center">
            {hi ? '🔮 AI अंतर्दृष्टि' : '🔮 AI Insights'}
          </h3>

          {/* Interpretation cards */}
          {[structured.personality, structured.career, structured.relationships, structured.challenges, structured.spiritual].map((section, i) => (
            section && (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <Card className="p-5 border-primary/20 bg-card/60 backdrop-blur">
                  <h4 className="font-bold text-foreground text-lg flex items-center gap-2 mb-3">
                    <span className="text-xl">{section.emoji}</span>
                    {section.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{section.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {('traits' in section ? section.traits :
                      'strengths' in section ? section.strengths :
                      'areas' in section ? section.areas :
                      'practices' in section ? section.practices :
                      'compatibleSigns' in section ? section.compatibleSigns : []
                    )?.map((tag: string, j: number) => (
                      <Badge key={j} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  {'bestFields' in section && section.bestFields && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {section.bestFields.map((f: string, j: number) => (
                        <Badge key={j} variant="outline" className="text-xs">💼 {f}</Badge>
                      ))}
                    </div>
                  )}
                  {'remedies' in section && section.remedies && (
                    <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-xs font-semibold text-primary mb-1">{hi ? 'उपाय:' : 'Remedies:'}</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {section.remedies.map((r: string, j: number) => (
                          <li key={j}>✦ {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {'loveStyle' in section && section.loveStyle && (
                    <p className="mt-2 text-xs text-primary font-medium">💝 {hi ? 'प्रेम शैली' : 'Love Style'}: {section.loveStyle}</p>
                  )}
                </Card>
              </motion.div>
            )
          ))}

          {/* Lucky Factors */}
          {structured.luckyFactors && (
            <Card className="p-5 border-primary/20 bg-card/60 backdrop-blur">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="text-xl">🍀</span>
                {hi ? 'भाग्यशाली कारक' : 'Lucky Factors'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { icon: <Hash className="w-4 h-4" />, l: hi ? 'अंक' : 'Number', v: structured.luckyFactors.number },
                  { icon: <Palette className="w-4 h-4" />, l: hi ? 'रंग' : 'Color', v: structured.luckyFactors.color },
                  { icon: <CalendarDays className="w-4 h-4" />, l: hi ? 'दिन' : 'Day', v: structured.luckyFactors.day },
                  { icon: <Gem className="w-4 h-4" />, l: hi ? 'रत्न' : 'Gem', v: structured.luckyFactors.gemstone },
                  { icon: <Star className="w-4 h-4" />, l: hi ? 'मंत्र' : 'Mantra', v: structured.luckyFactors.mantra },
                ].map((f, i) => (
                  <div key={i} className="text-center p-2.5 rounded-xl bg-background/50 border border-border/40">
                    <div className="flex justify-center text-primary mb-1">{f.icon}</div>
                    <p className="text-[10px] text-muted-foreground">{f.l}</p>
                    <p className="text-xs font-bold text-foreground">{f.v}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : insights ? (
        <Card className="p-5 border-primary/20 bg-card/60 backdrop-blur">
          <h3 className="font-bold text-foreground mb-3">🔮 {hi ? 'AI अंतर्दृष्टि' : 'AI Insights'}</h3>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{insights}</div>
        </Card>
      ) : null}
    </div>
  );
};

export default KundliTabs;
