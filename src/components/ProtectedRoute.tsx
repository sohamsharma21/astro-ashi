
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, language, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect when we confirm user is not authenticated and loading is complete
    if (!loading && !user) {
      toast.error(
        language === 'en' 
          ? 'Please sign in to access this feature' 
          : 'इस सुविधा का उपयोग करने के लिए कृपया साइन इन करें'
      );
      // Save the attempted URL to redirect back after login
      navigate('/auth', { state: { from: location.pathname } });
    }
  }, [user, navigate, language, location, loading]);

  // Show loading indicator during authentication check
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-cosmic-gold" />
      </div>
    );
  }

  // If no user, render nothing (redirection handled by useEffect)
  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
