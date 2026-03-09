import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, MapPin, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface KundliFormProps {
  onSubmit: (formData: KundliFormData) => void;
  loading: boolean;
}

export interface KundliFormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: string;
  longitude: string;
  gender: string;
}

export const KundliForm = ({ onSubmit, loading }: KundliFormProps) => {
  const { language, user } = useAuth();
  const hi = language === 'hi';
  const [formData, setFormData] = useState<KundliFormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: '',
    longitude: '',
    gender: '',
  });
  const [autoFilled, setAutoFilled] = useState(false);

  // Auto-fill from profile
  useEffect(() => {
    if (!user || autoFilled) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, birth_date, birth_time, birth_place, latitude, longitude, gender')
        .eq('id', user.id)
        .single();
      if (data) {
        setFormData(prev => ({
          ...prev,
          name: data.full_name || prev.name,
          birthDate: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : prev.birthDate,
          birthTime: data.birth_time || prev.birthTime,
          birthPlace: data.birth_place || prev.birthPlace,
          latitude: data.latitude?.toString() || prev.latitude,
          longitude: data.longitude?.toString() || prev.longitude,
          gender: data.gender || prev.gender,
        }));
        setAutoFilled(true);
      }
    };
    loadProfile();
  }, [user, autoFilled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = [
    {
      id: 'name', label: hi ? 'पूरा नाम' : 'Full Name', icon: User,
      type: 'text', placeholder: hi ? 'अपना नाम दर्ज करें' : 'Enter your full name', required: true,
    },
    {
      id: 'birthPlace', label: hi ? 'जन्म स्थान' : 'Birth Place', icon: MapPin,
      type: 'text', placeholder: hi ? 'शहर, राज्य' : 'City, State', required: true,
    },
    {
      id: 'birthDate', label: hi ? 'जन्म तिथि' : 'Date of Birth', icon: Calendar,
      type: 'date', required: true,
    },
    {
      id: 'birthTime', label: hi ? 'जन्म समय' : 'Birth Time', icon: Clock,
      type: 'time', required: true, hint: hi ? 'सही समय से सटीक कुंडली बनती है' : 'Accurate time gives precise results',
    },
  ];

  return (
    <Card className="border border-primary/20 bg-card/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl shadow-primary/5">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          {hi ? 'अपना जन्म विवरण दर्ज करें' : 'Enter Your Birth Details'}
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          {hi ? 'सटीक जानकारी से बेहतर कुंडली बनती है' : 'Accurate details generate a precise birth chart'}
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map(({ id, label, icon: Icon, type, placeholder, required, hint }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </Label>
              <Input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={(formData as any)[id]}
                onChange={handleChange}
                required={required}
                className="bg-background/50 border-border/60 focus:border-primary"
              />
              {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            </div>
          ))}
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            {hi ? 'लिंग (वैकल्पिक)' : 'Gender (Optional)'}
          </Label>
          <Select value={formData.gender} onValueChange={(v) => setFormData(p => ({ ...p, gender: v }))}>
            <SelectTrigger className="bg-background/50 border-border/60">
              <SelectValue placeholder={hi ? 'चुनें' : 'Select'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{hi ? 'पुरुष' : 'Male'}</SelectItem>
              <SelectItem value="female">{hi ? 'महिला' : 'Female'}</SelectItem>
              <SelectItem value="other">{hi ? 'अन्य' : 'Other'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lat/Long (collapsible advanced) */}
        <details className="group">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            {hi ? '🌍 अक्षांश/देशांतर मैन्युअली दें (वैकल्पिक)' : '🌍 Enter Lat/Long manually (optional)'}
          </summary>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-1">
              <Label htmlFor="latitude" className="text-xs text-muted-foreground">{hi ? 'अक्षांश' : 'Latitude'}</Label>
              <Input id="latitude" name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} className="bg-background/50 border-border/60" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="longitude" className="text-xs text-muted-foreground">{hi ? 'देशांतर' : 'Longitude'}</Label>
              <Input id="longitude" name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} className="bg-background/50 border-border/60" />
            </div>
          </div>
        </details>

        <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold gap-2">
          <Sparkles className="w-5 h-5" />
          {loading
            ? (hi ? 'कुंडली बन रही है...' : 'Generating Kundli...')
            : (hi ? '✨ कुंडली बनाएं' : '✨ Generate My Kundli')}
        </Button>
      </form>
    </Card>
  );
};
