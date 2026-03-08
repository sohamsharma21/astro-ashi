import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, X, Loader2, CheckCircle2 } from 'lucide-react';

const EmailVerificationBanner = () => {
  const { user, userProfile, language } = useAuth();
  const [sending, setSending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!user || userProfile?.email_verified || dismissed) return null;

  const t = {
    en: {
      message: 'Please verify your email to unlock all features.',
      resend: 'Resend Verification Email',
      sent: 'Verification email sent! Check your inbox.',
      error: 'Failed to send verification email.',
    },
    hi: {
      message: 'सभी सुविधाओं को अनलॉक करने के लिए कृपया अपना ईमेल सत्यापित करें।',
      resend: 'सत्यापन ईमेल पुनः भेजें',
      sent: 'सत्यापन ईमेल भेजा गया! अपना इनबॉक्स जांचें।',
      error: 'सत्यापन ईमेल भेजने में विफल।',
    },
  };
  const tr = t[language] || t.en;

  const handleResend = async () => {
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { userId: user.id, email: user.email, language },
      });
      if (error) throw error;
      toast.success(tr.sent);
    } catch {
      toast.error(tr.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <Mail className="w-5 h-5 text-amber-400 shrink-0" />
        <p className="text-sm text-foreground">{tr.message}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" onClick={handleResend} disabled={sending}
          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
          {sending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
          {tr.resend}
        </Button>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
