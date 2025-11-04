import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export const SEOHead = ({
  title = 'AstroAshi - Your Personal Astrology & Kundli Platform',
  description = 'Get personalized horoscopes, Kundli analysis, astrology consultations, and AI-powered astrological insights. Explore your cosmic journey with AstroAshi - the complete astrology platform.',
  keywords = 'astrology, horoscope, kundli, birth chart, zodiac signs, astrology consultation, daily horoscope, vedic astrology, jyotish, राशिफल, कुंडली',
  ogImage = 'https://czpumlrofurdktvjtibl.supabase.co/storage/v1/object/public/astroashi-logo.png',
  ogType = 'website',
  canonical
}: SEOHeadProps) => {
  const siteUrl = 'https://astroashi.vercel.app';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="AstroAshi" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English, Hindi" />
      <meta name="author" content="AstroAshi" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Schema.org markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AstroAshi",
          "url": siteUrl,
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};
