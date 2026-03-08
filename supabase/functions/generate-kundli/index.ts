import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ZODIAC_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const NAKSHATRAS = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const MAHADASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const MAHADASHA_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { birthDate, birthTime, latitude, longitude, birthPlace } = await req.json();

    // Parse birth details - default to 12:00 if no time provided
    const timeStr = birthTime && birthTime.trim() !== '' ? birthTime : '12:00';
    const birth = new Date(`${birthDate}T${timeStr}`);
    const julianDay = getJulianDay(birth);
    
    // Calculate planetary positions using simplified Vedic calculations
    const planets = calculatePlanetaryPositions(julianDay, latitude, longitude);
    
    // Calculate Ascendant (Lagna)
    const ascendant = calculateAscendant(birth, latitude, longitude);
    
    // Calculate houses
    const houses = calculateHouses(ascendant, planets);
    
    // Calculate Mahadasha
    const moonNakshatra = Math.floor((planets.find(p => p.name === 'Moon')?.longitude || 0) / 13.333);
    const mahadasha = calculateMahadasha(birth, moonNakshatra);

    const result = {
      ascendant: {
        sign: ZODIAC_SIGNS[ascendant.signIndex],
        degree: ascendant.degree,
      },
      planets,
      houses,
      mahadasha,
      birthDetails: {
        date: birthDate,
        time: birthTime,
        place: birthPlace,
        latitude,
        longitude,
      },
      calculatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Kundli generation error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getJulianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate() + (date.getHours() + date.getMinutes() / 60) / 24;
  const a = Math.floor((14 - m) / 12);
  const y1 = y + 4800 - a;
  const m1 = m + 12 * a - 3;
  return d + Math.floor((153 * m1 + 2) / 5) + 365 * y1 + Math.floor(y1 / 4) - Math.floor(y1 / 100) + Math.floor(y1 / 400) - 32045;
}

function calculatePlanetaryPositions(jd: number, lat: number, lng: number) {
  const T = (jd - 2451545.0) / 36525;
  const ayanamsa = 23.856 + 0.0140 * T; // Lahiri Ayanamsa approximation
  
  return PLANETS.map((name, idx) => {
    // Simplified mean longitude calculation
    const meanLongitudes = [280.46, 218.32, 355.45, 252.25, 34.35, 181.98, 49.94, 0, 180];
    const dailyMotion = [0.9856, 13.176, 0.524, 4.092, 0.083, 1.602, 0.033, 0.053, -0.053];
    
    let longitude = (meanLongitudes[idx] + dailyMotion[idx] * (jd - 2451545)) % 360;
    longitude = (longitude - ayanamsa + 360) % 360; // Apply Ayanamsa for sidereal
    
    const signIndex = Math.floor(longitude / 30);
    const degree = longitude % 30;
    const nakshatraIndex = Math.floor(longitude / 13.333);
    
    return {
      name,
      longitude,
      sign: ZODIAC_SIGNS[signIndex],
      signIndex,
      degree: Math.round(degree * 100) / 100,
      nakshatra: NAKSHATRAS[nakshatraIndex % 27],
      nakshatraIndex: nakshatraIndex % 27,
    };
  });
}

function calculateAscendant(birth: Date, lat: number, lng: number) {
  const hours = birth.getHours() + birth.getMinutes() / 60;
  const lst = (hours + lng / 15 + 12) % 24; // Local Sidereal Time (simplified)
  const ascLongitude = (lst * 15 + 90) % 360;
  
  return {
    signIndex: Math.floor(ascLongitude / 30),
    degree: Math.round((ascLongitude % 30) * 100) / 100,
  };
}

function calculateHouses(ascendant: { signIndex: number; degree: number }, planets: any[]) {
  const houses = [];
  for (let i = 0; i < 12; i++) {
    const houseSign = (ascendant.signIndex + i) % 12;
    const planetsInHouse = planets.filter(p => p.signIndex === houseSign);
    houses.push({
      house: i + 1,
      sign: ZODIAC_SIGNS[houseSign],
      planets: planetsInHouse.map(p => p.name),
    });
  }
  return houses;
}

function calculateMahadasha(birthDate: Date, moonNakshatraIndex: number) {
  const nakshatraLord = MAHADASHA_ORDER[moonNakshatraIndex % 9];
  const lordIndex = MAHADASHA_ORDER.indexOf(nakshatraLord);
  
  const today = new Date();
  const ageYears = (today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  
  let accumulated = 0;
  let currentIndex = lordIndex;
  
  // Find current Mahadasha
  while (accumulated + MAHADASHA_YEARS[MAHADASHA_ORDER[currentIndex] as keyof typeof MAHADASHA_YEARS] < ageYears) {
    accumulated += MAHADASHA_YEARS[MAHADASHA_ORDER[currentIndex] as keyof typeof MAHADASHA_YEARS];
    currentIndex = (currentIndex + 1) % 9;
  }
  
  const currentMahadasha = MAHADASHA_ORDER[currentIndex];
  const mahadashaYears = MAHADASHA_YEARS[currentMahadasha as keyof typeof MAHADASHA_YEARS];
  const yearsIntoDasha = ageYears - accumulated;
  const antardashaIndex = Math.floor((yearsIntoDasha / mahadashaYears) * 9);
  const currentAntardasha = MAHADASHA_ORDER[(currentIndex + antardashaIndex) % 9];
  
  return {
    current_mahadasha: currentMahadasha,
    current_antardasha: currentAntardasha,
    mahadasha_start: new Date(birthDate.getTime() + accumulated * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    mahadasha_end: new Date(birthDate.getTime() + (accumulated + mahadashaYears) * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    antardasha_start: new Date().toISOString().split('T')[0],
    antardasha_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
}
