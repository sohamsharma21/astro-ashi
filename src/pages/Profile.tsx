
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Calendar, Star, Settings, LogOut, ChevronRight, 
  Camera, Shield, Bell, Loader2, Moon, Globe, BookOpen, Trash2
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
    { icon: Star, label: language === 'en' ? 'Zodiac' : 'राशि', value: getZodiacLabel(userProfile?.primary_zodiac_sign) },
    { icon: MapPin, label: language === 'en' ? 'Birth Place' : 'जन्म स्थान', value: userProfile?.birth_place || (language === 'en' ? 'Not set' : 'सेट नहीं') },
    { icon: Calendar, label: language === 'en' ? 'Birth Date' : 'जन्म तिथि', value: userProfile?.birth_date ? new Date(userProfile.birth_date).toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (language === 'en' ? 'Not set' : 'सेट नहीं') },
    { icon: Moon, label: language === 'en' ? 'Moon Sign' : 'चंद्र राशि', value: userProfile?.moon_sign || (language === 'en' ? 'Not set' : 'सेट नहीं') },
  ];

  const profileMenuItems = [
    {
      icon: User,
      label: language === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें',
      action: () => setActiveSection(activeSection === 'edit' ? null : 'edit'),
      isActive: activeSection === 'edit',
    },
    {
      icon: BookOpen,
      label: language === 'en' ? 'Reading History' : 'पठन इतिहास',
      action: () => navigate('/reading-history'),
    },
  ];

  const settingsMenuItems = [
    {
      icon: Globe,
      label: language === 'en' ? 'Language & Preferences' : 'भाषा और प्राथमिकताएं',
      action: () => navigate('/settings'),
    },
    {
      icon: Bell,
      label: language === 'en' ? 'Notifications' : 'सूचनाएँ',
      action: () => navigate('/settings'),
    },
    {
      icon: Shield,
      label: language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति',
      action: () => navigate('/privacy-policy'),
    },
    {
      icon: Trash2,
      label: language === 'en' ? 'Data & Account' : 'डेटा और खाता',
      action: () => navigate('/settings'),
      destructive: true,
    },
  ];

  const renderMenuGroup = (title: string, items: typeof profileMenuItems) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">
        {title}
      </p>
      <div className="cosmic-card rounded-2xl overflow-hidden">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              onClick={item.action}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-primary/5 active:bg-primary/10 ${
                i < items.length - 1 ? 'border-b border-border/20' : ''
              } ${'isActive' in item && item.isActive ? 'bg-primary/5' : ''}`}
            >
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                'destructive' in item && item.destructive 
                  ? 'bg-destructive/10 text-destructive' 
                  : 'bg-primary/10 text-primary'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-sm font-medium flex-1 text-left ${
                'destructive' in item && item.destructive ? 'text-destructive' : 'text-foreground'
              }`}>
                {item.label}
              </span>
              <ChevronRight className={`h-4 w-4 text-muted-foreground/50 transition-transform ${
                'isActive' in item && item.isActive ? 'rotate-90' : ''
              }`} />
            </button>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <div className="cosmic-bg min-h-screen pb-24">
      <SEOHead title="Profile | AstroAshi" description="Your AstroAshi profile" />
      <StarBackground starCount={100} />
      <Navigation />

      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Avatar & Name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center pt-8 pb-6"
        >
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-2 border-primary/40 shadow-lg shadow-primary/10">
              <AvatarImage src={userProfile?.avatar_url || ''} alt="Profile" />
              <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-input"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            </label>
            <input id="avatar-input" type="file" className="sr-only" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleAvatarChange} disabled={uploading} />
          </div>
          <h1 className="text-xl font-heading font-bold text-foreground">
            {userProfile?.full_name || (language === 'en' ? 'Your Name' : 'आपका नाम')}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="grid grid-cols-2 gap-2.5 mb-6">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="cosmic-card p-3.5 rounded-xl flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-[13px] font-semibold text-foreground truncate pl-9">{stat.value}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Profile Section */}
        {renderMenuGroup(language === 'en' ? 'Profile' : 'प्रोफ़ाइल', profileMenuItems)}

        {/* Edit Profile Expandable */}
        {activeSection === 'edit' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="cosmic-card rounded-2xl p-5 mb-4"
          >
            <ProfileSection />
          </motion.div>
        )}

        {/* Settings Section */}
        {renderMenuGroup(language === 'en' ? 'Settings' : 'सेटिंग्स', settingsMenuItems)}

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full py-3.5 h-auto rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 font-medium text-sm"
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
            {language === 'en' ? 'Sign Out' : 'साइन आउट'}
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
