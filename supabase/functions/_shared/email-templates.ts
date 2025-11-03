// Shared email template utilities
export function escapeHtml(unsafe: string = ''): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

export function getSignupConfirmationTemplate(
  name: string,
  language: 'en' | 'hi'
): EmailTemplate {
  const safeName = escapeHtml(name);
  
  if (language === 'hi') {
    return {
      subject: 'AstroAshi में आपका स्वागत है! 🌟',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #ffd700; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #ffd700; color: #1a1a2e; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🌟 नमस्ते ${safeName}!</h1>
              </div>
              <div class="content">
                <p>AstroAshi में आपका स्वागत है! हम आपको अपने ज्योतिष समुदाय का हिस्सा बनाकर प्रसन्न हैं।</p>
                <p>अब आप निम्नलिखित सुविधाओं का उपयोग कर सकते हैं:</p>
                <ul>
                  <li>📅 दैनिक राशिफल</li>
                  <li>🔮 कुंडली जनरेटर</li>
                  <li>❤️ प्रेम संगतता</li>
                  <li>💬 ज्योतिष चैट</li>
                  <li>📖 आपका व्यक्तिगत पठन इतिहास</li>
                </ul>
                <p style="margin-top: 20px;">आपकी ज्योतिषीय यात्रा शुरू करने के लिए तैयार हैं?</p>
                <div style="text-align: center;">
                  <a href="https://astroashi.lovable.app" class="button">डैशबोर्ड देखें</a>
                </div>
                <p style="margin-top: 30px; color: #666; font-size: 14px;">यदि आपके कोई प्रश्न हैं, तो कृपया हमसे संपर्क करने में संकोच न करें।</p>
              </div>
              <div class="footer">
                <p>© 2025 AstroAshi. सर्वाधिकार सुरक्षित।</p>
              </div>
            </div>
          </body>
        </html>
      `
    };
  }
  
  return {
    subject: 'Welcome to AstroAshi! 🌟',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #ffd700; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #ffd700; color: #1a1a2e; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Welcome ${safeName}!</h1>
            </div>
            <div class="content">
              <p>Thank you for joining AstroAshi! We're excited to have you as part of our astrology community.</p>
              <p>You now have access to:</p>
              <ul>
                <li>📅 Daily Horoscopes</li>
                <li>🔮 Kundli Generator</li>
                <li>❤️ Love Compatibility</li>
                <li>💬 Astrology Chat</li>
                <li>📖 Your Personal Reading History</li>
              </ul>
              <p style="margin-top: 20px;">Ready to start your astrological journey?</p>
              <div style="text-align: center;">
                <a href="https://astroashi.lovable.app" class="button">View Dashboard</a>
              </div>
              <p style="margin-top: 30px; color: #666; font-size: 14px;">If you have any questions, feel free to reach out to us.</p>
            </div>
            <div class="footer">
              <p>© 2025 AstroAshi. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

export function getBookingVerificationTemplate(
  name: string,
  bookingId: string,
  packageTitle: string,
  date: string,
  time: string,
  verificationUrl: string,
  language: 'en' | 'hi'
): EmailTemplate {
  const safeName = escapeHtml(name);
  const safePackageTitle = escapeHtml(packageTitle);
  const safeDate = escapeHtml(date);
  const safeTime = escapeHtml(time);
  
  if (language === 'hi') {
    return {
      subject: '🔔 अपनी बुकिंग की पुष्टि करें - AstroAshi',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #ffd700; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .booking-details { background: #fff; padding: 20px; border-left: 4px solid #ffd700; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 30px; background: #ffd700; color: #1a1a2e; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 बुकिंग सत्यापन आवश्यक</h1>
              </div>
              <div class="content">
                <p>प्रिय ${safeName},</p>
                <p>आपका परामर्श बुक कर दिया गया है! कृपया अपनी बुकिंग की पुष्टि करें:</p>
                <div class="booking-details">
                  <h3>📋 बुकिंग विवरण:</h3>
                  <p><strong>पैकेज:</strong> ${safePackageTitle}</p>
                  <p><strong>तिथि:</strong> ${safeDate}</p>
                  <p><strong>समय:</strong> ${safeTime}</p>
                  <p><strong>बुकिंग ID:</strong> ${bookingId}</p>
                </div>
                <p><strong>⚠️ महत्वपूर्ण:</strong> अपनी बुकिंग की पुष्टि करने के लिए कृपया नीचे दिए गए बटन पर क्लिक करें। यह लिंक 24 घंटे के लिए वैध है।</p>
                <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">बुकिंग सत्यापित करें</a>
                </div>
                <p style="margin-top: 30px; color: #666; font-size: 14px;">यदि आपने इस बुकिंग का अनुरोध नहीं किया है, तो कृपया इस ईमेल को अनदेखा करें।</p>
              </div>
              <div class="footer">
                <p>© 2025 AstroAshi. सर्वाधिकार सुरक्षित।</p>
              </div>
            </div>
          </body>
        </html>
      `
    };
  }
  
  return {
    subject: '🔔 Verify Your Booking - AstroAshi',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #ffd700; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: #fff; padding: 20px; border-left: 4px solid #ffd700; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #ffd700; color: #1a1a2e; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Booking Verification Required</h1>
            </div>
            <div class="content">
              <p>Dear ${safeName},</p>
              <p>Your consultation has been booked! Please verify your booking:</p>
              <div class="booking-details">
                <h3>📋 Booking Details:</h3>
                <p><strong>Package:</strong> ${safePackageTitle}</p>
                <p><strong>Date:</strong> ${safeDate}</p>
                <p><strong>Time:</strong> ${safeTime}</p>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
              </div>
              <p><strong>⚠️ Important:</strong> Please click the button below to confirm your booking. This link is valid for 24 hours.</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Booking</a>
              </div>
              <p style="margin-top: 30px; color: #666; font-size: 14px;">If you didn't request this booking, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 AstroAshi. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}

export function getBookingConfirmationTemplate(
  name: string,
  bookingId: string,
  packageTitle: string,
  date: string,
  time: string,
  language: 'en' | 'hi'
): EmailTemplate {
  const safeName = escapeHtml(name);
  const safePackageTitle = escapeHtml(packageTitle);
  const safeDate = escapeHtml(date);
  const safeTime = escapeHtml(time);
  
  if (language === 'hi') {
    return {
      subject: '✅ बुकिंग की पुष्टि - AstroAshi',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #ffd700; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .booking-details { background: #fff; padding: 20px; border-left: 4px solid #4ade80; margin: 20px 0; }
              .button { display: inline-block; padding: 12px 30px; background: #ffd700; color: #1a1a2e; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              .success { background: #4ade80; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ बुकिंग की पुष्टि</h1>
              </div>
              <div class="content">
                <div class="success">
                  <h2 style="margin: 0;">🎉 आपकी बुकिंग की पुष्टि हो गई है!</h2>
                </div>
                <p>प्रिय ${safeName},</p>
                <p>बधाई हो! आपकी परामर्श बुकिंग की पुष्टि हो गई है।</p>
                <div class="booking-details">
                  <h3>📋 पुष्टि की गई बुकिंग विवरण:</h3>
                  <p><strong>पैकेज:</strong> ${safePackageTitle}</p>
                  <p><strong>तिथि:</strong> ${safeDate}</p>
                  <p><strong>समय:</strong> ${safeTime}</p>
                  <p><strong>बुकिंग ID:</strong> ${bookingId}</p>
                  <p><strong>स्थिति:</strong> ✅ पुष्टि की गई</p>
                </div>
                <p>हम जल्द ही आपसे संपर्क करेंगे अपॉइंटमेंट के विवरण को अंतिम रूप देने के लिए।</p>
                <div style="text-align: center;">
                  <a href="https://astroashi.lovable.app/profile" class="button">प्रोफ़ाइल देखें</a>
                </div>
                <p style="margin-top: 30px; color: #666; font-size: 14px;">यदि आपके कोई प्रश्न हैं, तो कृपया हमसे संपर्क करने में संकोच न करें।</p>
              </div>
              <div class="footer">
                <p>© 2025 AstroAshi. सर्वाधिकार सुरक्षित।</p>
              </div>
            </div>
          </body>
        </html>
      `
    };
  }
  
  return {
    subject: '✅ Booking Confirmed - AstroAshi',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #ffd700; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: #fff; padding: 20px; border-left: 4px solid #4ade80; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #ffd700; color: #1a1a2e; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .success { background: #4ade80; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Booking Confirmed</h1>
            </div>
            <div class="content">
              <div class="success">
                <h2 style="margin: 0;">🎉 Your Booking is Confirmed!</h2>
              </div>
              <p>Dear ${safeName},</p>
              <p>Congratulations! Your consultation booking has been confirmed.</p>
              <div class="booking-details">
                <h3>📋 Confirmed Booking Details:</h3>
                <p><strong>Package:</strong> ${safePackageTitle}</p>
                <p><strong>Date:</strong> ${safeDate}</p>
                <p><strong>Time:</strong> ${safeTime}</p>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Status:</strong> ✅ Confirmed</p>
              </div>
              <p>We will contact you shortly to finalize the appointment details.</p>
              <div style="text-align: center;">
                <a href="https://astroashi.lovable.app/profile" class="button">View Profile</a>
              </div>
              <p style="margin-top: 30px; color: #666; font-size: 14px;">If you have any questions, feel free to reach out to us.</p>
            </div>
            <div class="footer">
              <p>© 2025 AstroAshi. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
}
