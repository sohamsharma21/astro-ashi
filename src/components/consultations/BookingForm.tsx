
import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { ConsultationPackage } from './ConsultationPackages';
import { toast } from 'sonner';
import { bookingsApi } from '@/services/bookings';
import { format } from 'date-fns';

interface BookingFormProps {
  selectedPackage: ConsultationPackage;
  onCancel: () => void;
}

export const BookingForm = ({ selectedPackage, onCancel }: BookingFormProps) => {
  const { language, user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(
        language === 'en' 
          ? 'You must be logged in to book a consultation'
          : 'परामर्श बुक करने के लिए आपको लॉग इन होना चाहिए'
      );
      return;
    }
    
    // Validate form data
    if (!formData.date || !formData.time || !formData.phone) {
      toast.error(
        language === 'en'
          ? 'Please fill all required fields'
          : 'कृपया सभी आवश्यक फ़ील्ड भरें'
      );
      return;
    }
    
    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, '').replace(/-/g, ''))) {
      toast.error(
        language === 'en'
          ? 'Please enter a valid phone number'
          : 'कृपया एक वैध फ़ोन नंबर दर्ज करें'
      );
      return;
    }
    
    // Make sure the selected date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error(
        language === 'en'
          ? 'Please select a future date'
          : 'कृपया भविष्य की तिथि चुनें'
      );
      return;
    }
    
    setLoading(true);
    
    try {
      // Create booking in database
      const bookingData = {
        user_id: user.id,
        package_id: selectedPackage.id,
        package_title: selectedPackage.title,
        package_price: selectedPackage.price,
        booking_date: formData.date,
        booking_time: formData.time,
        phone: formData.phone
      };
      
      const booking = await bookingsApi.createBooking(bookingData);
      if (booking && user.email) {
        try {
          // Determine the best display name
          const displayName = (user.user_metadata?.full_name 
            || user.user_metadata?.name 
            || userProfile?.full_name 
            || user.email?.split('@')[0] 
            || 'AstroAshi User');

          // Send verification email
          await bookingsApi.sendBookingVerificationEmail(
            user.email,
            displayName,
            booking.id || '',
            selectedPackage.title,
            format(new Date(formData.date), 'PPP'),
            formData.time,
            language
          );
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
          // Continue with success message even if email fails
        }
      }
      toast.success(
        language === 'en' 
          ? 'Consultation booked successfully! Please check your email and click the verification link to confirm your booking.'
          : 'परामर्श सफलतापूर्वक बुक किया गया! कृपया अपना ईमेल जांचें और अपनी बुकिंग की पुष्टि के लिए सत्यापन लिंक पर क्लिक करें।'
      );
      
      onCancel();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(
        language === 'en' 
          ? 'Failed to book consultation. Please try again.'
          : 'परामर्श बुक करने में विफल। कृपया पुनः प्रयास करें।'
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate the minimum date (today) for the date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg p-8 rounded-lg border border-cosmic-gold border-opacity-20">
        <h2 className="text-2xl font-bold mb-6 text-cosmic-gold text-center">
          {language === 'en' ? 'Book Your Consultation' : 'अपना परामर्श बुक करें'}
        </h2>
        
        <p className="mb-6 text-white text-center">
          {language === 'en' 
            ? `You're booking the ${selectedPackage.title} consultation`
            : `आप ${selectedPackage.title} परामर्श बुक कर रहे हैं`}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Preferred Date' : 'पसंदीदा तिथि'}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-gold h-5 w-5" />
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
                className="pl-10 bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Preferred Time' : 'पसंदीदा समय'}
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-gold h-5 w-5" />
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="pl-10 bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
              {language === 'en' ? 'Contact Number' : 'संपर्क नंबर'}
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              className="bg-cosmic-deep-space bg-opacity-50 border-cosmic-gold border-opacity-30 text-white"
              placeholder={language === 'en' ? 'Your phone number' : 'आपका फोन नंबर'}
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              className="flex-1 cosmic-button-outline"
              onClick={onCancel}
            >
              {language === 'en' ? 'Cancel' : 'रद्द करें'}
            </Button>
            
            <Button
              type="submit"
              className="flex-1 cosmic-button"
              disabled={loading}
            >
              {loading
                ? (language === 'en' ? 'Processing...' : 'प्रोसेसिंग...')
                : (language === 'en' ? 'Confirm Booking' : 'बुकिंग की पुष्टि करें')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
