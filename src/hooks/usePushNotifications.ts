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
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error(language === 'hi' 
        ? 'आपका ब्राउज़र नोटिफिकेशन सपोर्ट नहीं करता' 
        : 'Your browser does not support notifications');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Register for push notifications
        if (user) {
          await registerSubscription();
        }
        toast.success(language === 'hi'
          ? 'नोटिफिकेशन सक्षम!'
          : 'Notifications enabled!');
        return true;
      } else {
        toast.error(language === 'hi'
          ? 'नोटिफिकेशन अनुमति अस्वीकृत'
          : 'Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }, [isSupported, user, language]);

  const registerSubscription = async () => {
    if (!user) return;

    try {
      // Store subscription using direct API call since types aren't updated yet
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
      // Use raw fetch since types aren't updated yet
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
