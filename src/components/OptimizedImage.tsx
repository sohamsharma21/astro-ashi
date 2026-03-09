import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  wrapperClassName?: string;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  fallback = '/placeholder.svg',
  className, 
  wrapperClassName,
  ...props 
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-inherit" />
      )}
      <img
        ref={imgRef}
        src={error ? fallback : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
