
import Navigation from '@/components/Navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileSection from '@/components/profile/ProfileSection';
import AccountSection from '@/components/profile/AccountSection';

const Profile = () => {
  const { language } = useAuth();

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className={`text-4xl md:text-6xl font-bold mb-12 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Your Profile' : 'आपकी प्रोफाइल'}
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-cosmic-deep-space border border-cosmic-gold border-opacity-30 mx-auto flex justify-center">
              <TabsTrigger value="profile" className={`data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-deep-space ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? 'Profile Information' : 'प्रोफ़ाइल जानकारी'}
              </TabsTrigger>
              <TabsTrigger value="account" className={`data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-deep-space ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
                {language === 'en' ? 'Account Settings' : 'खाता सेटिंग्स'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <ProfileLayout 
                title="Your Profile" 
                titleHi="आपकी प्रोफाइल"
              >
                <ProfileSection />
              </ProfileLayout>
            </TabsContent>
            
            <TabsContent value="account" className="mt-6">
              <ProfileLayout 
                title="Account Settings" 
                titleHi="खाता सेटिंग्स"
              >
                <AccountSection />
              </ProfileLayout>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
