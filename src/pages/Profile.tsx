
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Calendar, Star, Settings, LogOut, ChevronRight, 
  Camera, Shield, Bell, Loader2, Moon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import ProfileSection from '@/components/profile/ProfileSection';
import { SEOHead } from '@/components/SEOHead';

const Profile = () => {
  const { user, userProfile, language, updateUserProfile, loading } = useAuth();
  const navigate = useNavigate();
  const { uploadAvatar, uploading } = useAvatarUpload();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getUserInitials = () => {
    if (!userProfile?.full_name) return 'U';
    return userProfile.full_name
      .split(' ')
      .map((name: string) => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error(language === 'en' ? 'Invalid file type' : 'अमान्य फ़ाइल प्रकार');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'en' ? 'File too large (max 5MB)' : 'फ़ाइल बहुत बड़ी (अधिकतम 5MB)');
      return;
    }
    try {
      const url = await uploadAvatar(file);
      await updateUserProfile({ avatar_url: url });
      toast.success(language === 'en' ? 'Avatar updated!' : 'अवतार अपडेट हो गया!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast.success(language === 'en' ? 'Signed out' : 'साइन आउट हो गया');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getZodiacLabel = (sign: string | undefined) => {
    if (!sign) return language === 'en' ? 'Not set' : 'सेट नहीं';
    const names: Record<string, string> = {
      aries: language === 'en' ? 'Aries ♈' : 'मेष ♈',
      taurus: language === 'en' ? 'Taurus ♉' : 'वृषभ ♉',
      gemini: language === 'en' ? 'Gemini ♊' : 'मिथुन ♊',
      cancer: language === 'en' ? 'Cancer ♋' : 'कर्क ♋',
      leo: language === 'en' ? 'Leo ♌' : 'सिंह ♌',
      virgo: language === 'en' ? 'Virgo ♍' : 'कन्या ♍',
      libra: language === 'en' ? 'Libra ♎' : 'तुला ♎',
      scorpio: language === 'en' ? 'Scorpio ♏' : 'वृश्चिक ♏',
      sagittarius: language === 'en' ? 'Sagittarius ♐' : 'धनु ♐',
      capricorn: language === 'en' ? 'Capricorn ♑' : 'मकर ♑',
      aquarius: language === 'en' ? 'Aquarius ♒' : 'कुंभ ♒',
      pisces: language === 'en' ? 'Pisces ♓' : 'मीन ♓',
    };
    return names[sign] || sign;
  };

  if (loading) {
    return (
      <div className="cosmic-bg min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const quickStats = [
    {
      icon: Star,
      label: language === 'en' ? 'Zodiac' : 'राशि',
      value: getZodiacLabel(userProfile?.primary_zodiac_sign),
    },
    {
      icon: MapPin,
      label: language === 'en' ? 'Birth Place' : 'जन्म स्थान',
      value: userProfile?.birth_place || (language === 'en' ? 'Not set' : 'सेट नहीं'),
    },
    {
      icon: Calendar,
      label: language === 'en' ? 'Birth Date' : 'जन्म तिथि',
      value: userProfile?.birth_date 
        ? new Date(userProfile.birth_date).toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : (language === 'en' ? 'Not set' : 'सेट नहीं'),
    },
    {
      icon: Moon,
      label: language === 'en' ? 'Moon Sign' : 'चंद्र राशि',
      value: userProfile?.moon_sign || (language === 'en' ? 'Not set' : 'सेट नहीं'),
    },
  ];

  const menuItems = [
    {
      icon: User,
      label: language === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें',
      action: () => setActiveSection(activeSection === 'edit' ? null : 'edit'),
      isActive: activeSection === 'edit',
    },
    {
      icon: Settings,
      label: language === 'en' ? 'Settings' : 'सेटिंग्स',
      action: () => navigate('/settings'),
    },
    {
      icon: Shield,
      label: language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति',
      action: () => navigate('/privacy-policy'),
    },
    {
      icon: Bell,
      label: language === 'en' ? 'Notifications' : 'सूचनाएँ',
      action: () => navigate('/settings'),
    },
  ];

  return (
    <div className="cosmic-bg min-h-screen pb-24">
      <SEOHead title="Profile | AstroAshi" description="Your AstroAshi profile" />
      <StarBackground starCount={100} />
      <Navigation />

      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Avatar & Name Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center pt-8 pb-6"
        >
          <div className="relative mb-4">
            <Avatar className="h-28 w-28 border-[3px] border-primary shadow-lg shadow-primary/20">
              <AvatarImage src={userProfile?.avatar_url || ''} alt="Profile" />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-input"
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </label>
            <input
              id="avatar-input"
              type="file"
              className="sr-only"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleAvatarChange}
              disabled={uploading}
            />
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            {userProfile?.full_name || (language === 'en' ? 'Your Name' : 'आपका नाम')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="cosmic-card p-4 rounded-2xl flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate pl-10">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cosmic-card rounded-2xl overflow-hidden mb-4"
        >
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={item.action}
                className={`w-full flex items-center gap-4 px-5 py-4 transition-colors hover:bg-primary/5 active:bg-primary/10 ${
                  i < menuItems.length - 1 ? 'border-b border-border/30' : ''
                } ${item.isActive ? 'bg-primary/5' : ''}`}
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground flex-1 text-left">
                  {item.label}
                </span>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${item.isActive ? 'rotate-90' : ''}`} />
              </button>
            );
          })}
        </motion.div>

        {/* Edit Profile Expandable */}
        {activeSection === 'edit' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="cosmic-card rounded-2xl p-5 mb-4"
          >
            <ProfileSection />
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full py-4 h-auto rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 font-medium"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            {language === 'en' ? 'Sign Out' : 'साइन आउट'}
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
