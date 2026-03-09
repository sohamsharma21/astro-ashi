
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';

const ContactUs = () => {
  const { language, user } = useAuth();

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={150} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10">
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center text-gradient-gold ${language === 'hi' ? 'font-noto-devanagari' : ''}`}>
          {language === 'en' ? 'Contact Us' : 'संपर्क करें'}
        </h1>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm initialEmail={user?.email || ''} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactUs;
