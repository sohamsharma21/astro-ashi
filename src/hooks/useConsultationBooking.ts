
import { useState } from 'react';
import { ConsultationPackage } from '@/components/consultations/ConsultationPackages';

export const useConsultationBooking = () => {
  const [selectedPackage, setSelectedPackage] = useState<ConsultationPackage | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = (packageId: string, packages: ConsultationPackage[]) => {
    const pkg = packages.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setIsBooking(true);
    }
  };

  const resetBooking = () => {
    setIsBooking(false);
    setSelectedPackage(null);
  };

  return {
    selectedPackage,
    isBooking,
    handleBooking,
    resetBooking
  };
};
