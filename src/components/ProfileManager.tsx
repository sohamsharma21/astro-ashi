
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import ProfileSection from './profile/ProfileSection';

const ProfileManager = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cosmic-gold" />
      </div>
    );
  }

  return <ProfileSection />;
};

export default ProfileManager;
