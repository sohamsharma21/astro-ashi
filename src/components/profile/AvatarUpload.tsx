
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import AvatarPreview from './AvatarPreview';

interface AvatarUploadProps {
  initialUrl?: string;
  onUpdate: (url: string) => Promise<void>;
}

const AvatarUpload = ({ initialUrl, onUpdate }: AvatarUploadProps) => {
  const [imageUrl, setImageUrl] = useState<string>(initialUrl || '');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user, language, userProfile } = useAuth();
  const { uploadAvatar, uploading } = useAvatarUpload();

  const getUserInitials = () => {
    if (!userProfile?.full_name) return 'U';
    return userProfile.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(selectedFile.type)) {
        toast({
          title: language === 'en' ? 'Invalid file type' : 'अमान्य फ़ाइल प्रकार',
          description: language === 'en' 
            ? 'Please select a JPEG, PNG, GIF or WEBP image' 
            : 'कृपया JPEG, PNG, GIF या WEBP छवि चुनें',
          variant: 'destructive'
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: language === 'en' ? 'File too large' : 'फ़ाइल बहुत बड़ी है',
          description: language === 'en' 
            ? 'File size should be less than 5MB' 
            : 'फ़ाइल का आकार 5MB से कम होना चाहिए',
          variant: 'destructive'
        });
        return;
      }
      
      setFile(selectedFile);
      
      try {
        // Upload to Supabase
        const uploadedUrl = await uploadAvatar(selectedFile);
        setImageUrl(uploadedUrl);
        
        // Update user profile
        await onUpdate(uploadedUrl);
      } catch (error) {
        console.error('Error in upload process:', error);
      }
    }
  };

  const removeImage = async () => {
    if (imageUrl) {
      try {
        // Reset the avatar
        await onUpdate('');
        setImageUrl('');
        setFile(null);
        
        toast({
          title: language === 'en' ? 'Avatar removed' : 'अवतार हटाया गया',
          description: language === 'en' 
            ? 'Your profile avatar has been removed' 
            : 'आपका प्रोफ़ाइल अवतार हटा दिया गया है',
        });
      } catch (error: any) {
        toast({
          title: language === 'en' ? 'Failed to remove avatar' : 'अवतार हटाने में विफल',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <AvatarPreview 
        imageUrl={imageUrl}
        initials={getUserInitials()}
        size="lg"
        onRemove={removeImage}
        language={language}
      />
      
      <div className="flex items-center">
        <input
          type="file"
          id="avatar-upload"
          className="sr-only"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label
          htmlFor="avatar-upload"
          className={`cosmic-button-outline flex items-center space-x-2 cursor-pointer ${uploading ? 'opacity-70' : ''}`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>{language === 'en' ? 'Uploading...' : 'अपलोड हो रहा है...'}</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              <span>{language === 'en' ? 'Upload Avatar' : 'अवतार अपलोड करें'}</span>
            </>
          )}
        </label>
      </div>
      
      <p className="text-xs text-gray-400 text-center">
        {language === 'en' 
          ? 'JPEG, PNG, GIF or WEBP. Max 5MB.' 
          : 'JPEG, PNG, GIF या WEBP. अधिकतम 5MB.'}
      </p>
    </div>
  );
};

export default AvatarUpload;
