
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user, language } = useAuth();

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setUploading(true);
      setError(null);

      // Create a unique file path for this avatar
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}`;
      
      // Upload the file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);
      
      toast.success(
        language === 'en' 
          ? 'Avatar uploaded successfully' 
          : 'अवतार सफलतापूर्वक अपलोड किया गया'
      );
      
      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setError(err);
      
      toast.error(
        language === 'en' 
          ? `Failed to upload avatar: ${err.message}` 
          : `अवतार अपलोड करने में विफल: ${err.message}`
      );
      
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploading,
    error
  };
};
