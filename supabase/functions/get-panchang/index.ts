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
const MOON_PHASES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date, latitude = 28.6139, longitude = 77.2090 } = await req.json();
    
    const targetDate = date ? new Date(date) : new Date();
    const dayOfWeek = targetDate.getDay();
    
    // Improved astronomical calculations
    const jd = getJulianDay(targetDate);
    const T = (jd - 2451545.0) / 36525;
    
    const moonLong = getMoonLongitude(T);
    const sunLong = getSunLongitude(T);
    
    // Tithi: Based on Moon-Sun angular distance (12° per tithi)
    const tithiAngle = ((moonLong - sunLong + 360) % 360);
    const tithiIndex = Math.floor(tithiAngle / 12);
    const tithiPaksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
    
    // Moon phase from tithi angle
    const moonPhaseIndex = Math.floor(tithiAngle / 45);
    const moonPhase = MOON_PHASES[moonPhaseIndex % 8];
    
    // Nakshatra: Moon's position in 27 nakshatras (13°20' each)
    const nakshatraIndex = Math.floor(moonLong / (360 / 27)) % 27;
    
    // Yoga: (Sun longitude + Moon longitude) / 13°20'
    const yogaIndex = Math.floor(((sunLong + moonLong) % 360) / (360 / 27)) % 27;
    
    // Karana: Half of tithi
    const karanaIndex = Math.floor((tithiAngle / 6)) % 11;
    
    // Calculate sunrise/sunset using proper solar declination
    const sunrise = calculateSunrise(targetDate, latitude, longitude);
    const sunset = calculateSunset(targetDate, latitude, longitude);
    
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
    
    const abhijitStart = '11:48';
    const abhijitEnd = '12:36';
    
    const shubhMuhuratTimings = [
      { name: 'Brahma Muhurat', start: '04:24', end: '05:12', type: 'spiritual' },
      { name: 'Abhijit Muhurat', start: abhijitStart, end: abhijitEnd, type: 'general' },
      { name: 'Vijay Muhurat', start: '14:00', end: '14:48', type: 'success' },
    ];
    
    const ashubhMuhuratTimings = [
      { name: 'Rahu Kaal', start: rahuKaalTimings[dayOfWeek].start, end: rahuKaalTimings[dayOfWeek].end, type: 'avoid' },
      { name: 'Gulika Kaal', start: getGulikaKaal(dayOfWeek), end: addMinutes(getGulikaKaal(dayOfWeek), 90), type: 'caution' },
    ];

    const panchang = {
      date: targetDate.toISOString().split('T')[0],
      vaar: VAARS[dayOfWeek],
      tithi: {
        name: `${tithiPaksha} ${TITHIS[tithiIndex % 30]}`,
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
      moon_phase: moonPhase,
      sunrise,
      sunset,
      rahu_kaal: rahuKaalTimings[dayOfWeek],
      abhijit_muhurat: { start: abhijitStart, end: abhijitEnd },
      shubh_muhurat: shubhMuhuratTimings,
      ashubh_muhurat: ashubhMuhuratTimings,
      location: { latitude, longitude },
    };

    return new Response(JSON.stringify(panchang), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Panchang error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  const a = Math.floor((14 - m) / 12);
  const y1 = y + 4800 - a;
  const m1 = m + 12 * a - 3;
  return d + Math.floor((153 * m1 + 2) / 5) + 365 * y1 + Math.floor(y1 / 4) - Math.floor(y1 / 100) + Math.floor(y1 / 400) - 32045;
}

// Improved Moon longitude with perturbation terms
function getMoonLongitude(T: number): number {
  const Lp = 218.3165 + 481267.8813 * T; // Mean longitude
  const D = 297.8502 + 445267.1115 * T;   // Mean elongation
  const M = 357.5291 + 35999.0503 * T;    // Sun mean anomaly
  const Mp = 134.9634 + 477198.8676 * T;  // Moon mean anomaly
  const F = 93.2720 + 483202.0175 * T;    // Argument of latitude

  const toRad = (deg: number) => deg * Math.PI / 180;

  // Major perturbation terms
  let longitude = Lp
    + 6.289 * Math.sin(toRad(Mp))
    + 1.274 * Math.sin(toRad(2 * D - Mp))
    + 0.658 * Math.sin(toRad(2 * D))
    + 0.214 * Math.sin(toRad(2 * Mp))
    - 0.186 * Math.sin(toRad(M))
    - 0.114 * Math.sin(toRad(2 * F));

  return ((longitude % 360) + 360) % 360;
}

// Improved Sun longitude
function getSunLongitude(T: number): number {
  const L0 = 280.46646 + 36000.76983 * T;  // Geometric mean longitude
  const M = 357.52911 + 35999.05029 * T;   // Mean anomaly
  const toRad = (deg: number) => deg * Math.PI / 180;

  // Equation of center
  const C = (1.914602 - 0.004817 * T) * Math.sin(toRad(M))
    + 0.019993 * Math.sin(toRad(2 * M))
    + 0.000289 * Math.sin(toRad(3 * M));

  const sunLong = L0 + C;
  // Apparent longitude (nutation correction)
  const omega = 125.04 - 1934.136 * T;
  const apparent = sunLong - 0.00569 - 0.00478 * Math.sin(toRad(omega));

  return ((apparent % 360) + 360) % 360;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Improved sunrise calculation using solar declination
function calculateSunrise(date: Date, latitude: number, longitude: number): string {
  const dayOfYear = getDayOfYear(date);
  const toRad = (d: number) => d * Math.PI / 180;
  const toDeg = (r: number) => r * 180 / Math.PI;

  // Solar declination
  const declination = 23.45 * Math.sin(toRad((360 / 365) * (dayOfYear - 81)));
  
  // Hour angle for sunrise
  const cosHourAngle = (Math.sin(toRad(-0.833)) - Math.sin(toRad(latitude)) * Math.sin(toRad(declination))) /
    (Math.cos(toRad(latitude)) * Math.cos(toRad(declination)));
  
  const hourAngle = toDeg(Math.acos(Math.max(-1, Math.min(1, cosHourAngle))));
  
  // Equation of time (approximate)
  const B = toRad((360 / 365) * (dayOfYear - 81));
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  
  // Solar noon in minutes from midnight (UTC)
  const solarNoon = 720 - 4 * longitude - EoT;
  const sunriseMinutes = solarNoon - hourAngle * 4;
  
  // Convert to IST (UTC+5:30) 
  const istOffset = 330;
  const totalMin = sunriseMinutes + istOffset;
  const hours = Math.floor((totalMin / 60 + 24) % 24);
  const minutes = Math.floor(totalMin % 60);
  return `${hours.toString().padStart(2, '0')}:${Math.abs(minutes).toString().padStart(2, '0')}`;
}

function calculateSunset(date: Date, latitude: number, longitude: number): string {
  const dayOfYear = getDayOfYear(date);
  const toRad = (d: number) => d * Math.PI / 180;
  const toDeg = (r: number) => r * 180 / Math.PI;

  const declination = 23.45 * Math.sin(toRad((360 / 365) * (dayOfYear - 81)));
  const cosHourAngle = (Math.sin(toRad(-0.833)) - Math.sin(toRad(latitude)) * Math.sin(toRad(declination))) /
    (Math.cos(toRad(latitude)) * Math.cos(toRad(declination)));
  const hourAngle = toDeg(Math.acos(Math.max(-1, Math.min(1, cosHourAngle))));
  
  const B = toRad((360 / 365) * (dayOfYear - 81));
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  
  const solarNoon = 720 - 4 * longitude - EoT;
  const sunsetMinutes = solarNoon + hourAngle * 4;
  
  const istOffset = 330;
  const totalMin = sunsetMinutes + istOffset;
  const hours = Math.floor((totalMin / 60 + 24) % 24);
  const minutes = Math.floor(totalMin % 60);
  return `${hours.toString().padStart(2, '0')}:${Math.abs(minutes).toString().padStart(2, '0')}`;
}

function getGulikaKaal(dayOfWeek: number): string {
  const gulikaTimings = ['15:00', '13:30', '12:00', '10:30', '09:00', '07:30', '06:00'];
  return gulikaTimings[dayOfWeek];
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}
