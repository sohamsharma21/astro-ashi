
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';

interface AvatarPreviewProps {
  imageUrl?: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onRemove?: () => Promise<void> | void;
  language: 'en' | 'hi';
}

const AvatarPreview = ({ imageUrl, initials, size = 'md', onRemove, language }: AvatarPreviewProps) => {
  // Map size string to actual dimensions
  const sizeMap = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };
  
  const avatarSize = sizeMap[size];
  
  return (
    <div className="relative inline-block">
      <Avatar className={`${avatarSize} border-2 border-cosmic-gold`}>
        <AvatarImage src={imageUrl} alt="Profile" />
        <AvatarFallback className="bg-cosmic-violet text-white text-xl">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {imageUrl && onRemove && (
        <button 
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-cosmic-deep-space border border-cosmic-gold rounded-full p-1"
          title={language === 'en' ? 'Remove image' : 'छवि हटाएं'}
          type="button"
        >
          <X className="h-4 w-4 text-cosmic-gold" />
        </button>
      )}
    </div>
  );
};

export default AvatarPreview;
