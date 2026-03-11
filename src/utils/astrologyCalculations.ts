/**
 * Pure JavaScript Vedic Astrology Calculations
 * No native modules required — all math is done in JS.
 * Heavy calculations are delegated to Supabase Edge Functions.
 */

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
] as const;

export function getJulianDay(date: Date): number {
  return (date.getTime() / 86400000) + 2440587.5;
}

export function getZodiacSign(longitude: number): string {
  return ZODIAC_SIGNS[Math.floor(((longitude % 360) + 360) % 360 / 30)];
}

export function getZodiacDegree(longitude: number): number {
  return ((longitude % 360) + 360) % 360 % 30;
}

export function getNakshatra(moonLongitude: number): string {
  const index = Math.floor(((moonLongitude % 360) + 360) % 360 / (360 / 27));
  return NAKSHATRAS[index];
}

export function getSunLongitude(jd: number): number {
  return ((280.46 + 0.9856474 * (jd - 2451545.0)) % 360 + 360) % 360;
}

export function getMoonLongitude(jd: number): number {
  return ((218.32 + 13.176396 * (jd - 2451545.0)) % 360 + 360) % 360;
}
