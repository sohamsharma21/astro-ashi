import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation as NavIcon } from 'lucide-react';
import NavigationComponent from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Religion } from '@/lib/faithModules';

interface Place {
  name: string;
  address: string;
  rating?: number;
  type: string;
  distance?: string;
  lat: number;
  lng: number;
}

const placeTypes: Record<string, { label: { en: string; hi: string }; icon: string; query: string }> = {
  temple: { label: { en: 'Hindu Temple', hi: 'हिंदू मंदिर' }, icon: '🛕', query: 'hindu temple' },
  mosque: { label: { en: 'Mosque', hi: 'मस्जिद' }, icon: '🕌', query: 'mosque' },
  church: { label: { en: 'Church', hi: 'चर्च' }, icon: '⛪', query: 'church' },
  gurudwara: { label: { en: 'Gurudwara', hi: 'गुरुद्वारा' }, icon: '🙏', query: 'gurudwara' },
  jain_temple: { label: { en: 'Jain Temple', hi: 'जैन मंदिर' }, icon: '🪷', query: 'jain temple' },
  monastery: { label: { en: 'Buddhist Monastery', hi: 'बौद्ध मठ' }, icon: '☸️', query: 'buddhist monastery' },
};

const religionToType: Record<string, string> = {
  hindu: 'temple', muslim: 'mosque', christian: 'church', sikh: 'gurudwara', jain: 'jain_temple', buddhist: 'monastery', other: 'temple',
};

const WorshipPlaces = () => {
  const { language, userProfile } = useAuth();
  const religion = (userProfile?.religion as Religion) || 'hindu';
  const [selectedType, setSelectedType] = useState(religionToType[religion] || 'temple');
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocationError(language === 'hi' ? 'लोकेशन एक्सेस अनुमति दें' : 'Please allow location access'),
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) searchPlaces();
  }, [selectedType, userLocation]);

  const searchPlaces = async () => {
    if (!userLocation) return;
    setLoading(true);
    const query = searchQuery || placeTypes[selectedType]?.query || 'temple';
    // Use OpenStreetMap Nominatim API (free, no key needed)
    try {
      const bbox = 0.2;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=20&viewbox=${userLocation.lng - bbox},${userLocation.lat + bbox},${userLocation.lng + bbox},${userLocation.lat - bbox}&bounded=1&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AstroAshi/1.0 (astroashi.app)',
        },
      });
      const data = await res.json();
      const results: Place[] = data.map((item: any) => ({
        name: item.display_name.split(',')[0],
        address: item.display_name.split(',').slice(1, 4).join(',').trim(),
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: selectedType,
        distance: getDistance(userLocation.lat, userLocation.lng, parseFloat(item.lat), parseFloat(item.lon)),
      }));
      setPlaces(results);
    } catch (e) {
      console.error('Search error:', e);
    }
    setLoading(false);
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
  };

  const openDirections = (place: Place) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, '_blank');
  };

  const t = {
    en: { title: 'Places of Worship', search: 'Search places...', directions: 'Directions', noResults: 'No places found nearby. Try searching.', loading: 'Searching...' },
    hi: { title: 'पूजा स्थल', search: 'स्थान खोजें...', directions: 'दिशा-निर्देश', noResults: 'पास में कोई स्थान नहीं मिला। खोजें।', loading: 'खोज रहे हैं...' },
  };
  const tr = t[language] || t.en;

  return (
    <>
      <SEOHead title="Places of Worship - AstroAshi" description="Find nearby temples, mosques, churches and spiritual places." canonical="/worship-places" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <NavigationComponent />
        <main className="pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10 px-4 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
            🕌 {tr.title}
          </motion.h1>

          {locationError && <Card className="p-4 mb-4 text-center text-sm text-destructive">{locationError}</Card>}

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(placeTypes).map(([key, val]) => (
              <Button key={key} size="sm" variant={selectedType === key ? 'default' : 'outline'}
                onClick={() => setSelectedType(key)} className="text-xs gap-1">
                <span>{val.icon}</span> {val.label[language]}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-6">
            <Input placeholder={tr.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchPlaces()} className="flex-1" />
            <Button onClick={searchPlaces} size="icon"><Search className="w-4 h-4" /></Button>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">{tr.loading}</div>
          ) : places.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{tr.noResults}</div>
          ) : (
            <div className="space-y-3">
              {places.map((place, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="p-4 hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm truncate">{place.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5 shrink-0" /> {place.address}
                        </p>
                        {place.distance && (
                          <Badge variant="secondary" className="mt-2 text-[10px]">{place.distance}</Badge>
                        )}
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0 text-xs gap-1" onClick={() => openDirections(place)}>
                        <NavIcon className="w-3 h-3" /> {tr.directions}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default WorshipPlaces;
