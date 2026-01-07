import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TITHIS = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'];
const NAKSHATRAS = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const YOGAS = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
const KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
const VAARS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date, latitude = 28.6139, longitude = 77.2090 } = await req.json();
    
    const targetDate = date ? new Date(date) : new Date();
    const dayOfYear = getDayOfYear(targetDate);
    const dayOfWeek = targetDate.getDay();
    
    // Calculate Panchang elements based on lunar calculations
    const jd = getJulianDay(targetDate);
    const moonLongitude = getMoonLongitude(jd);
    const sunLongitude = getSunLongitude(jd);
    
    // Tithi: Based on Moon-Sun angular distance (12° per tithi)
    const tithiAngle = ((moonLongitude - sunLongitude + 360) % 360);
    const tithiIndex = Math.floor(tithiAngle / 12);
    const tithiPaksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
    
    // Nakshatra: Moon's position in 27 nakshatras
    const nakshatraIndex = Math.floor(moonLongitude / 13.333) % 27;
    
    // Yoga: Sum of Sun and Moon longitudes / 13.333
    const yogaIndex = Math.floor((sunLongitude + moonLongitude) / 13.333) % 27;
    
    // Karana: Half of tithi
    const karanaIndex = Math.floor((tithiAngle / 6)) % 11;
    
    // Calculate sunrise/sunset (simplified for latitude)
    const sunrise = calculateSunrise(targetDate, latitude);
    const sunset = calculateSunset(targetDate, latitude);
    
    // Rahu Kaal based on day of week
    const rahuKaalTimings = [
      { start: '16:30', end: '18:00' }, // Sunday
      { start: '07:30', end: '09:00' }, // Monday
      { start: '15:00', end: '16:30' }, // Tuesday
      { start: '12:00', end: '13:30' }, // Wednesday
      { start: '13:30', end: '15:00' }, // Thursday
      { start: '10:30', end: '12:00' }, // Friday
      { start: '09:00', end: '10:30' }, // Saturday
    ];
    
    // Abhijit Muhurat (midday auspicious time)
    const abhijitStart = '11:48';
    const abhijitEnd = '12:36';

    const panchang = {
      date: targetDate.toISOString().split('T')[0],
      vaar: VAARS[dayOfWeek],
      tithi: {
        name: `${tithiPaksha} ${TITHIS[tithiIndex % 15]}`,
        paksha: tithiPaksha,
        index: tithiIndex,
      },
      nakshatra: {
        name: NAKSHATRAS[nakshatraIndex],
        index: nakshatraIndex,
      },
      yoga: {
        name: YOGAS[yogaIndex],
        index: yogaIndex,
      },
      karana: {
        name: KARANAS[karanaIndex],
        index: karanaIndex,
      },
      sunrise,
      sunset,
      rahu_kaal: rahuKaalTimings[dayOfWeek],
      abhijit_muhurat: { start: abhijitStart, end: abhijitEnd },
      location: { latitude, longitude },
    };

    return new Response(JSON.stringify(panchang), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Panchang error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getJulianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const a = Math.floor((14 - m) / 12);
  const y1 = y + 4800 - a;
  const m1 = m + 12 * a - 3;
  return d + Math.floor((153 * m1 + 2) / 5) + 365 * y1 + Math.floor(y1 / 4) - Math.floor(y1 / 100) + Math.floor(y1 / 400) - 32045;
}

function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = (218.32 + 481267.883 * T) % 360;
  return (L + 360) % 360;
}

function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = (280.46 + 36000.77 * T) % 360;
  return (L + 360) % 360;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function calculateSunrise(date: Date, latitude: number): string {
  const dayOfYear = getDayOfYear(date);
  const baseTime = 6 + Math.sin((dayOfYear - 80) * Math.PI / 182.5) * (latitude / 30);
  const hours = Math.floor(baseTime);
  const minutes = Math.floor((baseTime - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function calculateSunset(date: Date, latitude: number): string {
  const dayOfYear = getDayOfYear(date);
  const baseTime = 18 + Math.sin((dayOfYear - 80) * Math.PI / 182.5) * (latitude / 30);
  const hours = Math.floor(baseTime);
  const minutes = Math.floor((baseTime - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
