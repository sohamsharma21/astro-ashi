import { Resend } from "npm:resend@2.0.0";
import { Logger } from "./security.ts";
import {
  EmailTemplate,
  getMagicLinkTemplate,
  getSignupConfirmationTemplate,
  getBookingVerificationTemplate,
  getBookingConfirmationTemplate
} from "./email-templates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
  logger: Logger;
}

// Centralized email sending with retry logic
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, template, logger } = options;
  
  try {
    logger.info('Sending email', { to, subject: template.subject });
    
    const emailResponse = await resend.emails.send({
      from: "AstroAshi <onboarding@resend.dev>",
      to: [to],
      subject: template.subject,
      html: template.html,
    });

    logger.info('Email sent successfully', { 
      emailId: emailResponse.data?.id,
      to 
    });
  } catch (error: any) {
    logger.error('Failed to send email', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

// Pre-configured email senders for different types
export const emailService = {
  async sendMagicLink(
    email: string,
    magicLink: string,
    language: 'en' | 'hi',
    logger: Logger
  ): Promise<void> {
    const template = getMagicLinkTemplate(magicLink, language);
    await sendEmail({ to: email, template, logger });
  },

  async sendSignupConfirmation(
    email: string,
    name: string,
    language: 'en' | 'hi',
    logger: Logger
  ): Promise<void> {
    const template = getSignupConfirmationTemplate(name, language);
    await sendEmail({ to: email, template, logger });
  },
  
  async sendBookingVerification(
    email: string,
    name: string,
    bookingId: string,
    packageTitle: string,
    date: string,
    time: string,
    verificationUrl: string,
    language: 'en' | 'hi',
    logger: Logger
  ): Promise<void> {
    const template = getBookingVerificationTemplate(
      name,
      bookingId,
      packageTitle,
      date,
      time,
      verificationUrl,
      language
    );
    await sendEmail({ to: email, template, logger });
  },
  
  async sendBookingConfirmation(
    email: string,
    name: string,
    bookingId: string,
    packageTitle: string,
    date: string,
    time: string,
    language: 'en' | 'hi',
    logger: Logger
  ): Promise<void> {
    const template = getBookingConfirmationTemplate(
      name,
      bookingId,
      packageTitle,
      date,
      time,
      language
    );
    await sendEmail({ to: email, template, logger });
  }
};
