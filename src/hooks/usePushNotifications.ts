import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  created_at: string;
}

export const usePushNotifications = () => {
  const { user, language } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
      // For browser-based notifications, we store a simple subscription record
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: `browser-${user.id}`,
          subscribed_at: new Date().toISOString(),
          preferences: {
            daily_horoscope: true,
            auspicious_timing: true,
          }
        }, { onConflict: 'user_id' });

      if (error) throw error;
    } catch (error) {
      console.error('Subscription registration error:', error);
    }
  };

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Fetch notifications error:', error);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

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
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

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
