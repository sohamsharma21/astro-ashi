import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Img,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AuthEmailProps {
  type: 'password_reset' | 'email_verification' | 'magic_link';
  actionUrl: string;
  userName?: string;
  language: 'en' | 'hi';
}

const translations = {
  en: {
    password_reset: {
      preview: 'Reset your AstroAshi password',
      title: 'Reset Your Password',
      subtitle: 'Click the button below to reset your password',
      button: 'Reset Password',
      note: 'This link will expire in 24 hours.',
      ignore: "If you didn't request a password reset, you can safely ignore this email.",
    },
    email_verification: {
      preview: 'Verify your AstroAshi account',
      title: 'Verify Your Email',
      subtitle: 'Click the button below to verify your email address',
      button: 'Verify Email',
      note: 'This link will expire in 24 hours.',
      ignore: "If you didn't create an account, you can safely ignore this email.",
    },
    magic_link: {
      preview: 'Your AstroAshi login link',
      title: 'Sign In to AstroAshi',
      subtitle: 'Click the button below to sign in to your account',
      button: 'Sign In',
      note: 'This link will expire in 1 hour.',
      ignore: "If you didn't request this link, you can safely ignore this email.",
    },
    welcome: 'Hello',
    footer: 'May the stars guide your path',
    copyright: '© 2025 AstroAshi. All rights reserved.',
  },
  hi: {
    password_reset: {
      preview: 'अपना AstroAshi पासवर्ड रीसेट करें',
      title: 'अपना पासवर्ड रीसेट करें',
      subtitle: 'अपना पासवर्ड रीसेट करने के लिए नीचे बटन पर क्लिक करें',
      button: 'पासवर्ड रीसेट करें',
      note: 'यह लिंक 24 घंटे में समाप्त हो जाएगा।',
      ignore: 'यदि आपने पासवर्ड रीसेट का अनुरोध नहीं किया है, तो आप इस ईमेल को सुरक्षित रूप से अनदेखा कर सकते हैं।',
    },
    email_verification: {
      preview: 'अपना AstroAshi खाता सत्यापित करें',
      title: 'अपना ईमेल सत्यापित करें',
      subtitle: 'अपना ईमेल पता सत्यापित करने के लिए नीचे बटन पर क्लिक करें',
      button: 'ईमेल सत्यापित करें',
      note: 'यह लिंक 24 घंटे में समाप्त हो जाएगा।',
      ignore: 'यदि आपने खाता नहीं बनाया है, तो आप इस ईमेल को सुरक्षित रूप से अनदेखा कर सकते हैं।',
    },
    magic_link: {
      preview: 'आपका AstroAshi लॉगिन लिंक',
      title: 'AstroAshi में साइन इन करें',
      subtitle: 'अपने खाते में साइन इन करने के लिए नीचे बटन पर क्लिक करें',
      button: 'साइन इन करें',
      note: 'यह लिंक 1 घंटे में समाप्त हो जाएगा।',
      ignore: 'यदि आपने इस लिंक का अनुरोध नहीं किया है, तो आप इस ईमेल को सुरक्षित रूप से अनदेखा कर सकते हैं।',
    },
    welcome: 'नमस्ते',
    footer: 'सितारे आपका मार्गदर्शन करें',
    copyright: '© 2025 AstroAshi. सर्वाधिकार सुरक्षित।',
  }
};

export const AuthEmail = ({ type, actionUrl, userName, language = 'en' }: AuthEmailProps) => {
  const t = translations[language];
  const content = t[type];

  return (
    <Html>
      <Head />
      <Preview>{content.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with cosmic gradient */}
          <Section style={header}>
            <Img
              src="https://astroashi.lovable.app/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png"
              width="80"
              height="80"
              alt="AstroAshi"
              style={logo}
            />
            <Heading style={h1}>AstroAshi</Heading>
            <Text style={tagline}>✨ Your Personal Vedic Astrology Guide ✨</Text>
          </Section>

          {/* Main content */}
          <Section style={content_section}>
            <Text style={greeting}>
              {t.welcome}{userName ? `, ${userName}` : ''}! 🌟
            </Text>
            
            <Heading style={h2}>{content.title}</Heading>
            <Text style={text}>{content.subtitle}</Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={actionUrl} style={button}>
                {content.button}
              </Link>
            </Section>

            <Text style={note}>{content.note}</Text>
            <Text style={ignoreText}>{content.ignore}</Text>

            {/* Cosmic divider */}
            <Section style={divider}>
              <Text style={stars}>⭐ ✦ ⭐ ✦ ⭐</Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>{t.footer}</Text>
            <Text style={copyright}>{t.copyright}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AuthEmail;

// Styles
const main = {
  backgroundColor: '#0f0520',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  background: 'linear-gradient(135deg, #1a0b2e 0%, #321c5c 100%)',
  borderRadius: '16px 16px 0 0',
  padding: '40px 20px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto 16px',
  borderRadius: '50%',
  border: '3px solid #ffd700',
  boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
};

const h1 = {
  color: '#ffd700',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
};

const tagline = {
  color: '#c0c0c0',
  fontSize: '14px',
  margin: '0',
};

const content_section = {
  backgroundColor: '#1a0b2e',
  padding: '32px 40px',
};

const greeting = {
  color: '#ffffff',
  fontSize: '18px',
  margin: '0 0 24px',
};

const h2 = {
  color: '#ffd700',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const text = {
  color: '#e0e0e0',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#ffd700',
  borderRadius: '30px',
  color: '#1a0b2e',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '14px 32px',
  textDecoration: 'none',
  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
};

const note = {
  color: '#a0a0a0',
  fontSize: '14px',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const ignoreText = {
  color: '#707070',
  fontSize: '12px',
  margin: '0',
  textAlign: 'center' as const,
};

const divider = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const stars = {
  color: '#ffd700',
  fontSize: '16px',
  letterSpacing: '8px',
};

const footer = {
  backgroundColor: '#0f0520',
  borderRadius: '0 0 16px 16px',
  padding: '24px 20px',
  textAlign: 'center' as const,
  borderTop: '1px solid #321c5c',
};

const footerText = {
  color: '#ffd700',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '0 0 8px',
};

const copyright = {
  color: '#606060',
  fontSize: '12px',
  margin: '0',
};
