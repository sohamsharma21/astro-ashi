import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KundliRequest {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { birthDate, birthTime, latitude, longitude }: KundliRequest = await req.json();

    console.log('Calculating Kundli for:', { birthDate, birthTime, latitude, longitude });

    // Parse birth date and time
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hours, minutes] = birthTime.split(':').map(Number);

    // Create date object in UTC
    const birthDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const julianDay = (birthDateTime.getTime() / 86400000) + 2440587.5;

    // Calculate planetary positions (simplified vedic calculations)
    const sunLongitude = ((280.46 + 0.9856474 * (julianDay - 2451545.0)) % 360 + 360) % 360;
    const moonLongitude = ((218.32 + 13.176396 * (julianDay - 2451545.0)) % 360 + 360) % 360;
    const mercuryLongitude = ((252.25 + 1.602130 * (julianDay - 2451545.0)) % 360 + 360) % 360;
    const venusLongitude = ((181.98 + 1.602130 * (julianDay - 2451545.0)) % 360 + 360) % 360;
    const marsLongitude = ((355.45 + 0.524039 * (julianDay - 2451545.0)) % 360 + 360) % 360;
    const jupiterLongitude = ((34.35 + 0.083056 * (julianDay - 2451545.0)) % 360 + 360) % 360;
    const saturnLongitude = ((50.08 + 0.033371 * (julianDay - 2451545.0)) % 360 + 360) % 360;

    // Calculate Rahu (North Node) and Ketu (South Node)
    const rahuLongitude = ((125.04 - 0.052954 * (julianDay - 2451545.0)) % 360 + 360) % 360;
    const ketuLongitude = (rahuLongitude + 180) % 360;

    // Calculate Ascendant (Lagna) based on local sidereal time
    const localSiderealTime = ((hours + minutes / 60) + longitude / 15) % 24;
    const ascendantLongitude = (localSiderealTime * 15 + sunLongitude) % 360;

    // Zodiac signs in order
    const zodiacSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    // Convert longitude to zodiac sign and degree
    const getZodiacInfo = (longitude: number) => ({
      sign: zodiacSigns[Math.floor(longitude / 30)],
      degree: longitude % 30
    });

    const planetPositions = [
      { planet: 'Sun', ...getZodiacInfo(sunLongitude), longitude: sunLongitude },
      { planet: 'Moon', ...getZodiacInfo(moonLongitude), longitude: moonLongitude },
      { planet: 'Mercury', ...getZodiacInfo(mercuryLongitude), longitude: mercuryLongitude },
      { planet: 'Venus', ...getZodiacInfo(venusLongitude), longitude: venusLongitude },
      { planet: 'Mars', ...getZodiacInfo(marsLongitude), longitude: marsLongitude },
      { planet: 'Jupiter', ...getZodiacInfo(jupiterLongitude), longitude: jupiterLongitude },
      { planet: 'Saturn', ...getZodiacInfo(saturnLongitude), longitude: saturnLongitude },
      { planet: 'Rahu', ...getZodiacInfo(rahuLongitude), longitude: rahuLongitude },
      { planet: 'Ketu', ...getZodiacInfo(ketuLongitude), longitude: ketuLongitude },
    ];

    const ascendantInfo = getZodiacInfo(ascendantLongitude);

    // Calculate houses (Placidus system simplified)
    const houses = zodiacSigns.map((sign, index) => {
      const houseLongitude = (ascendantLongitude + index * 30) % 360;
      const houseSign = zodiacSigns[Math.floor(houseLongitude / 30)];
      const planetsInHouse = planetPositions
        .filter(p => {
          const diff = (p.longitude - houseLongitude + 360) % 360;
          return diff < 30;
        })
        .map(p => p.planet);

      return {
        house: index + 1,
        sign: houseSign,
        planets: planetsInHouse,
        longitude: houseLongitude
      };
    });

    const result = {
      ascendant: ascendantInfo.sign,
      ascendantDegree: ascendantInfo.degree,
      planetPositions: planetPositions.map(({ planet, sign, degree }) => ({
        planet,
        sign,
        degree: Number(degree.toFixed(2))
      })),
      houses,
      julianDay,
      calculatedAt: new Date().toISOString()
    };

    console.log('Kundli calculation complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error calculating Kundli:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
