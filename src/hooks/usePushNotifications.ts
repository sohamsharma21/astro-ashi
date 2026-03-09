import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  created_at: string;
}

export const usePushNotifications = () => {
  const { user, language } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if we're in a secure context and Notification API is available
    const supported = typeof window !== 'undefined' && 
      'Notification' in window && 
      window.isSecureContext !== false;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      // Check specific reasons why it's not supported
      if (!window.isSecureContext) {
        toast.error(language === 'hi' 
          ? 'नोटिफिकेशन के लिए HTTPS ज़रूरी है। कृपया published URL पर जाएं।' 
          : 'Notifications require HTTPS. Please use the published URL.');
      } else if (!('Notification' in window)) {
        toast.error(language === 'hi' 
          ? 'आपका ब्राउज़र नोटिफिकेशन सपोर्ट नहीं करता' 
          : 'Your browser does not support notifications');
      } else {
        toast.error(language === 'hi'
          ? 'नोटिफिकेशन इस preview में उपलब्ध नहीं हैं। Published app पर ट्राय करें।'
          : 'Notifications are not available in preview. Try on the published app.');
      }
      return false;
    }

    // Check if already denied at browser level
    if (Notification.permission === 'denied') {
      toast.error(language === 'hi'
        ? 'नोटिफिकेशन ब्राउज़र सेटिंग्स में ब्लॉक हैं। कृपया ब्राउज़र की साइट सेटिंग्स में जाकर नोटिफिकेशन allow करें।'
        : 'Notifications are blocked in browser settings. Please go to your browser\'s site settings and allow notifications for this site.');
      setPermission('denied');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        if (user) {
          await registerSubscription();
        }
        toast.success(language === 'hi'
          ? '🔔 नोटिफिकेशन सक्षम!'
          : '🔔 Notifications enabled!');
        return true;
      } else if (result === 'denied') {
        toast.error(language === 'hi'
          ? 'नोटिफिकेशन अस्वीकृत। ब्राउज़र सेटिंग्स → साइट सेटिंग्स → नोटिफिकेशन में जाकर allow करें।'
          : 'Permission denied. Go to Browser Settings → Site Settings → Notifications to allow.');
        return false;
      } else {
        // 'default' - user dismissed the prompt
        toast.info(language === 'hi'
          ? 'नोटिफिकेशन प्रॉम्प्ट को dismiss किया गया। बाद में फिर से ट्राय करें।'
          : 'Notification prompt dismissed. You can try again later.');
        return false;
      }
    } catch (error) {
      console.error('Permission request error:', error);
      toast.error(language === 'hi'
        ? 'नोटिफिकेशन सेटअप में त्रुटि। कृपया published app पर ट्राय करें।'
        : 'Error setting up notifications. Please try on the published app.');
      return false;
    }
  }, [isSupported, user, language]);

  const registerSubscription = async () => {
    if (!user) return;

    try {
      const session = await supabase.auth.getSession();
      await fetch(
        `https://czpumlrofurdktvjtibl.supabase.co/rest/v1/push_subscriptions`,
        {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cHVtbHJvZnVyZGt0dmp0aWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MzAwNDIsImV4cCI6MjA2MTAwNjA0Mn0.V3pvJZpklLKv7qROSwXvubQADPsCJSZ4hUQK0FTYEUI',
            'Authorization': `Bearer ${session.data.session?.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            user_id: user.id,
            endpoint: `browser-${user.id}`,
            preferences: { daily_horoscope: true, auspicious_timing: true }
          })
        }
      );
    } catch (error) {
      console.error('Subscription registration error:', error);
    }
  };

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `https://czpumlrofurdktvjtibl.supabase.co/rest/v1/notifications?user_id=eq.${user.id}&order=created_at.desc&limit=20`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cHVtbHJvZnVyZGt0dmp0aWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MzAwNDIsImV4cCI6MjA2MTAwNjA0Mn0.V3pvJZpklLKv7qROSwXvubQADPsCJSZ4hUQK0FTYEUI',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data || []);
        setUnreadCount(data?.filter((n: NotificationItem) => !n.read).length || 0);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      await fetch(
        `https://czpumlrofurdktvjtibl.supabase.co/rest/v1/notifications?id=eq.${notificationId}&user_id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cHVtbHJvZnVyZGt0dmp0aWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MzAwNDIsImV4cCI6MjA2MTAwNjA0Mn0.V3pvJZpklLKv7qROSwXvubQADPsCJSZ4hUQK0FTYEUI',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ read: true })
        }
      );

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await fetch(
        `https://czpumlrofurdktvjtibl.supabase.co/rest/v1/notifications?user_id=eq.${user.id}&read=eq.false`,
        {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cHVtbHJvZnVyZGt0dmp0aWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MzAwNDIsImV4cCI6MjA2MTAwNjA0Mn0.V3pvJZpklLKv7qROSwXvubQADPsCJSZ4hUQK0FTYEUI',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ read: true })
        }
      );

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  }, [user]);

  const showLocalNotification = useCallback((title: string, body: string) => {
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/lovable-uploads/6118717f-8111-4495-bfb2-9b576cb27629.png',
        badge: '/pwa-192x192.png',
      });
    }
  }, [permission]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    permission,
    isSupported,
    requestPermission,
    markAsRead,
    markAllAsRead,
    showLocalNotification,
    refetch: fetchNotifications,
  };
};
