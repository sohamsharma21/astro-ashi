
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';

interface ProfileLayoutProps {
  title: string;
  titleHi: string;
  children: ReactNode;
}

const ProfileLayout = ({ title, titleHi, children }: ProfileLayoutProps) => {
  const { language } = useAuth();

  return (
    <Card className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg border border-cosmic-gold border-opacity-20">
      <CardHeader>
        <CardTitle className="text-2xl text-cosmic-gold">
          {language === 'en' ? title : titleHi}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileLayout;
