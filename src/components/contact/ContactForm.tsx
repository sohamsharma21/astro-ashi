
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface ContactFormProps {
  initialEmail?: string;
}

export const ContactForm = ({ initialEmail = '' }: ContactFormProps) => {
  const { language } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: initialEmail,
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success(
        language === 'en' 
          ? 'Your message has been sent. We will contact you soon!' 
          : 'आपका संदेश भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे!'
      );
      setFormData({
        name: '',
        email: initialEmail,
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
      <h2 className="text-2xl font-bold mb-6 text-cosmic-gold">
        {language === 'en' ? 'Send Us A Message' : 'हमें संदेश भेजें'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Your Name' : 'आपका नाम'}
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
              placeholder={language === 'en' ? 'Enter your name' : 'अपना नाम दर्ज करें'}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Your Email' : 'आपका ईमेल'}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
              placeholder={language === 'en' ? 'Enter your email' : 'अपना ईमेल दर्ज करें'}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-1">
            {language === 'en' ? 'Subject' : 'विषय'}
          </label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
            placeholder={language === 'en' ? 'Enter subject' : 'विषय दर्ज करें'}
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">
            {language === 'en' ? 'Your Message' : 'आपका संदेश'}
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white min-h-[150px]"
            placeholder={language === 'en' ? 'Enter your message' : 'अपना संदेश दर्ज करें'}
          />
        </div>
        
        <Button type="submit" disabled={loading} className="cosmic-button w-full">
          {loading 
            ? (language === 'en' ? 'Sending...' : 'भेज रहा है...') 
            : (language === 'en' ? 'Send Message' : 'संदेश भेजें')}
        </Button>
      </form>
    </div>
  );
};
