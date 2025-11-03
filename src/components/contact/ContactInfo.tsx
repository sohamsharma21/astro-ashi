
import { Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export const ContactInfo = () => {
  const { language } = useAuth();
  
  return (
    <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20 h-full">
      <h2 className="text-2xl font-bold mb-6 text-cosmic-gold">
        {language === 'en' ? 'Get In Touch' : 'संपर्क में रहें'}
      </h2>
      
      <div className="space-y-8">
        <div className="flex items-start">
          <Mail className="text-cosmic-gold mr-4 mt-1" />
          <div>
            <h3 className="font-bold text-white">
              {language === 'en' ? 'Email' : 'ईमेल'}
            </h3>
            <p className="text-gray-300">info@astroashi.com</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone className="text-cosmic-gold mr-4 mt-1" />
          <div>
            <h3 className="font-bold text-white">
              {language === 'en' ? 'Phone' : 'फ़ोन'}
            </h3>
            <p className="text-gray-300">+91 98765 43210</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin className="text-cosmic-gold mr-4 mt-1" />
          <div>
            <h3 className="font-bold text-white">
              {language === 'en' ? 'Address' : 'पता'}
            </h3>
            <p className="text-gray-300">
              {language === 'en' 
                ? '123 Cosmic Way, Spiritual District, Universe 42424' 
                : '123 कॉस्मिक वे, स्पिरिचुअल डिस्ट्रिक्ट, यूनिवर्स 42424'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
