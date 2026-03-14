
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const BLOCKED_EXTENSIONS = ['.exe', '.js', '.php', '.sh', '.html', '.bat', '.cmd', '.svg'];

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user, language } = useAuth();

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Security: validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error('Only JPEG, PNG and WEBP images are allowed');
    }

    // Security: block suspicious extensions
    const fileName = file.name.toLowerCase();
    if (BLOCKED_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
      throw new Error('File type not allowed');
    }

    try {
      setUploading(true);
      setError(null);

      // Compress image before upload (target ~200KB)
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 512,
        useWebWorker: true,
        fileType: 'image/webp',
      });

      // Create a unique file path for this avatar
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.webp`;
      
      // Upload the compressed file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, { upsert: true, contentType: 'image/webp' });

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
