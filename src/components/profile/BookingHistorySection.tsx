import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { bookingsApi, ConsultationBooking } from '@/services/bookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Phone, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const BookingHistorySection = () => {
  const { user, language } = useAuth();
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userBookings = await bookingsApi.getUserBookings(user.id);
      setBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(
        language === 'en' 
          ? 'Failed to load booking history'
          : 'बुकिंग इतिहास लोड करने में विफल'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <RefreshCcw className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return language === 'en' ? 'Verified ✅' : 'सत्यापित ✅';
      case 'pending':
        return language === 'en' ? 'Pending ⏳' : 'लंबित ⏳';
      default:
        return language === 'en' ? 'Unknown' : 'अज्ञात';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-gold"></div>
        <p className="mt-2 text-gray-300">
          {language === 'en' ? 'Loading booking history...' : 'बुकिंग इतिहास लोड हो रहा है...'}
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg border-cosmic-gold border-opacity-20">
        <CardContent className="text-center py-8">
          <div className="text-cosmic-gold text-4xl mb-4">🌟</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {language === 'en' ? 'No Bookings Yet' : 'अभी तक कोई बुकिंग नहीं'}
          </h3>
          <p className="text-gray-300 mb-4">
            {language === 'en' 
              ? 'You haven\'t booked any consultations yet. Start your cosmic journey!'
              : 'आपने अभी तक कोई परामर्श बुक नहीं किया है। अपनी ब्रह्मांडीय यात्रा शुरू करें!'}
          </p>
          <Button 
            className="cosmic-button"
            onClick={() => window.location.href = '/consultations'}
          >
            {language === 'en' ? 'Book Consultation' : 'परामर्श बुक करें'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-cosmic-gold">
          {language === 'en' ? 'Consultation History' : 'परामर्श इतिहास'}
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchBookings}
          className="border-cosmic-gold border-opacity-30 text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-deep-space"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Refresh' : 'रिफ्रेश'}
        </Button>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card 
            key={booking.id} 
            className="bg-cosmic-deep-space bg-opacity-80 backdrop-blur-lg border-cosmic-gold border-opacity-20 hover:border-opacity-40 transition-all duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-cosmic-gold text-lg">
                  {booking.package_title}
                </CardTitle>
                <Badge variant={getStatusBadgeVariant(booking.status)} className="flex items-center gap-1">
                  {getStatusIcon(booking.status)}
                  {getStatusText(booking.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="h-4 w-4 text-cosmic-gold" />
                  <span>
                    {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="h-4 w-4 text-cosmic-gold" />
                  <span>{booking.booking_time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="h-4 w-4 text-cosmic-gold" />
                  <span>{booking.phone}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-cosmic-gold border-opacity-20">
                <div className="text-sm text-gray-400">
                  {language === 'en' ? 'Booking ID:' : 'बुकिंग आईडी:'} {booking.id?.slice(0, 8)}...
                </div>
                <div className="text-lg font-semibold text-cosmic-gold">
                  {booking.package_price}
                </div>
              </div>
              
              {booking.status === 'pending' && (
                <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-3 mt-3">
                  <p className="text-yellow-300 text-sm">
                    {language === 'en' 
                      ? '⚠️ Please check your email and click the verification link to confirm this booking.'
                      : '⚠️ कृपया अपना ईमेल जांचें और इस बुकिंग की पुष्टि के लिए सत्यापन लिंक पर क्लिक करें।'}
                  </p>
                </div>
              )}
              
              {booking.status === 'approved' && (
                <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-3 mt-3">
                  <p className="text-green-300 text-sm">
                    {language === 'en' 
                      ? '✅ Booking confirmed! Our astrologer will contact you before your appointment.'
                      : '✅ बुकिंग की पुष्टि हो गई! हमारा ज्योतिषी आपकी नियुक्ति से पहले आपसे संपर्क करेगा।'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};