import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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

interface KundliChartVisualizationProps {
  ascendant: string;
  houses: House[];
  planetPositions: PlanetPosition[];
  language: 'en' | 'hi';
}

const KundliChartVisualization = ({ 
  ascendant, 
  houses, 
  planetPositions,
  language 
}: KundliChartVisualizationProps) => {
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');

  // Zodiac sign abbreviations
  const signAbbr: Record<string, string> = {
    'Aries': 'Ar', 'Taurus': 'Ta', 'Gemini': 'Ge', 'Cancer': 'Ca',
    'Leo': 'Le', 'Virgo': 'Vi', 'Libra': 'Li', 'Scorpio': 'Sc',
    'Sagittarius': 'Sg', 'Capricorn': 'Cp', 'Aquarius': 'Aq', 'Pisces': 'Pi'
  };

  // Planet abbreviations
  const planetAbbr: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mercury': '☿', 'Venus': '♀',
    'Mars': '♂', 'Jupiter': '♃', 'Saturn': '♄',
    'Rahu': '☊', 'Ketu': '☋'
  };

  const renderNorthIndianChart = () => {
    // North Indian chart is a diamond shape with 12 houses
    return (
      <div className="relative w-full max-w-[500px] mx-auto aspect-square">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Diamond border */}
          <path
            d="M 200 20 L 380 200 L 200 380 L 20 200 Z"
            fill="none"
            stroke="hsl(var(--cosmic-gold))"
            strokeWidth="3"
          />
          
          {/* Inner divisions */}
          <line x1="200" y1="20" x2="200" y2="380" stroke="hsl(var(--cosmic-gold))" strokeWidth="2" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="hsl(var(--cosmic-gold))" strokeWidth="2" />
          <line x1="110" y1="110" x2="290" y2="290" stroke="hsl(var(--cosmic-gold))" strokeWidth="1.5" />
          <line x1="290" y1="110" x2="110" y2="290" stroke="hsl(var(--cosmic-gold))" strokeWidth="1.5" />

          {/* House numbers and contents - North Indian style starting from top */}
          {houses.map((house, idx) => {
            const positions = [
              { x: 200, y: 60, anchor: 'middle' },   // House 1 (top)
              { x: 295, y: 105, anchor: 'start' },   // House 2
              { x: 340, y: 200, anchor: 'start' },   // House 3
              { x: 295, y: 295, anchor: 'start' },   // House 4
              { x: 200, y: 340, anchor: 'middle' },  // House 5
              { x: 105, y: 295, anchor: 'end' },     // House 6
              { x: 60, y: 200, anchor: 'end' },      // House 7
              { x: 105, y: 105, anchor: 'end' },     // House 8
              { x: 200, y: 150, anchor: 'middle' },  // House 9
              { x: 250, y: 150, anchor: 'start' },   // House 10
              { x: 250, y: 250, anchor: 'start' },   // House 11
              { x: 150, y: 250, anchor: 'end' },     // House 12
            ];

            const pos = positions[idx];
            const planetsInHouse = house.planets.map(p => planetAbbr[p] || p.slice(0, 2)).join(' ');

            return (
              <g key={house.house}>
                <text
                  x={pos.x}
                  y={pos.y}
                  fill="hsl(var(--cosmic-gold))"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor={pos.anchor}
                >
                  {house.house}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 15}
                  fill="hsl(var(--cosmic-purple))"
                  fontSize="10"
                  textAnchor={pos.anchor}
                >
                  {signAbbr[house.sign]}
                </text>
                {planetsInHouse && (
                  <text
                    x={pos.x}
                    y={pos.y + 28}
                    fill="hsl(var(--cosmic-pink))"
                    fontSize="14"
                    textAnchor={pos.anchor}
                  >
                    {planetsInHouse}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderSouthIndianChart = () => {
    // South Indian chart is a square grid
    return (
      <div className="relative w-full max-w-[500px] mx-auto aspect-square">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Outer border */}
          <rect
            x="20"
            y="20"
            width="360"
            height="360"
            fill="none"
            stroke="hsl(var(--cosmic-gold))"
            strokeWidth="3"
          />
          
          {/* Grid lines */}
          <line x1="20" y1="120" x2="380" y2="120" stroke="hsl(var(--cosmic-gold))" strokeWidth="2" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="hsl(var(--cosmic-gold))" strokeWidth="2" />
          <line x1="20" y1="280" x2="380" y2="280" stroke="hsl(var(--cosmic-gold))" strokeWidth="2" />
          <line x1="120" y1="20" x2="120" y2="380" stroke="hsl(var(--cosmic-gold))" strokeWidth="2" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="hsl(var(--cosmic-gold))" strokeWidth="2" />
          <line x1="280" y1="20" x2="280" y2="380" stroke="hsl(var(--cosmic-gold))" strokeWidth="2" />

          {/* Diagonal lines */}
          <line x1="20" y1="20" x2="120" y2="120" stroke="hsl(var(--cosmic-gold))" strokeWidth="1.5" />
          <line x1="280" y1="20" x2="380" y2="120" stroke="hsl(var(--cosmic-gold))" strokeWidth="1.5" />
          <line x1="20" y1="280" x2="120" y2="380" stroke="hsl(var(--cosmic-gold))" strokeWidth="1.5" />
          <line x1="280" y1="280" x2="380" y2="380" stroke="hsl(var(--cosmic-gold))" strokeWidth="1.5" />

          {/* House numbers and contents - South Indian style */}
          {houses.map((house, idx) => {
            const positions = [
              { x: 70, y: 60, anchor: 'middle' },    // House 1
              { x: 160, y: 60, anchor: 'middle' },   // House 2
              { x: 240, y: 60, anchor: 'middle' },   // House 3
              { x: 330, y: 60, anchor: 'middle' },   // House 4
              { x: 330, y: 160, anchor: 'middle' },  // House 5
              { x: 330, y: 240, anchor: 'middle' },  // House 6
              { x: 330, y: 330, anchor: 'middle' },  // House 7
              { x: 240, y: 330, anchor: 'middle' },  // House 8
              { x: 160, y: 330, anchor: 'middle' },  // House 9
              { x: 70, y: 330, anchor: 'middle' },   // House 10
              { x: 70, y: 240, anchor: 'middle' },   // House 11
              { x: 70, y: 160, anchor: 'middle' },   // House 12
            ];

            const pos = positions[idx];
            const planetsInHouse = house.planets.map(p => planetAbbr[p] || p.slice(0, 2)).join(' ');

            return (
              <g key={house.house}>
                <text
                  x={pos.x}
                  y={pos.y}
                  fill="hsl(var(--cosmic-gold))"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor={pos.anchor}
                >
                  {house.house}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 15}
                  fill="hsl(var(--cosmic-purple))"
                  fontSize="10"
                  textAnchor={pos.anchor}
                >
                  {signAbbr[house.sign]}
                </text>
                {planetsInHouse && (
                  <text
                    x={pos.x}
                    y={pos.y + 28}
                    fill="hsl(var(--cosmic-pink))"
                    fontSize="14"
                    textAnchor={pos.anchor}
                  >
                    {planetsInHouse}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <Card className="cosmic-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gradient-gold">
          {language === 'en' ? 'Birth Chart' : 'जन्म कुंडली'}
        </h3>
        <div className="flex gap-2">
          <Button
            variant={chartStyle === 'north' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartStyle('north')}
            className="cosmic-button"
          >
            {language === 'en' ? 'North Indian' : 'उत्तर भारतीय'}
          </Button>
          <Button
            variant={chartStyle === 'south' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartStyle('south')}
            className="cosmic-button"
          >
            {language === 'en' ? 'South Indian' : 'दक्षिण भारतीय'}
          </Button>
        </div>
      </div>

      {chartStyle === 'north' ? renderNorthIndianChart() : renderSouthIndianChart()}

      <div className="mt-6 p-4 bg-cosmic-purple/10 rounded-lg border border-cosmic-gold/20">
        <p className="text-sm text-cosmic-text/80 text-center">
          <span className="font-semibold text-cosmic-gold">
            {language === 'en' ? 'Ascendant (Lagna):' : 'लग्न:'}
          </span>{' '}
          {ascendant}
        </p>
      </div>
    </Card>
  );
};

export default KundliChartVisualization;
