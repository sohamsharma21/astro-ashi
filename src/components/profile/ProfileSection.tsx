
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import AvatarUpload from './AvatarUpload';
import ProfileForm, { ProfileFormData } from './ProfileForm';
import { ZodiacSign } from '@/lib/constants';
import { useIsMobile } from '@/hooks/use-mobile';

const ProfileSection = () => {
  const { userProfile, language, updateUserProfile, loading } = useAuth();
  const isMobile = useIsMobile();

  const handleAvatarUpdate = async (avatarUrl: string) => {
    try {
      await updateUserProfile({ avatar_url: avatarUrl });
    } catch (error: any) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleProfileFormSubmit = async (formData: ProfileFormData) => {
    try {
      await updateUserProfile({
        full_name: formData.full_name,
        birth_date: formData.birth_date ? new Date(formData.birth_date).toISOString() : null,
        birth_place: formData.birth_place,
        primary_zodiac_sign: formData.primary_zodiac_sign as ZodiacSign || undefined,
      });

      toast.success(
        language === 'en'
          ? 'Profile updated successfully!'
          : 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!'
      );
    } catch (error: any) {
      toast.error(
        language === 'en'
          ? `Failed to update profile: ${error.message}`
          : `प्रोफ़ाइल अपडेट करने में विफल: ${error.message}`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cosmic-gold" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <AvatarUpload 
          initialUrl={userProfile?.avatar_url || ''} 
          onUpdate={handleAvatarUpdate} 
        />
      </div>

      <ProfileForm
        userProfile={userProfile}
        language={language}
        isMobile={isMobile}
        onSubmit={handleProfileFormSubmit}
      />
    </div>
  );
};

export default ProfileSection;
