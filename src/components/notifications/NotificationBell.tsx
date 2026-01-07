import { useState } from 'react';
import { Bell, BellRing, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const { language } = useAuth();
  const {
    notifications,
    unreadCount,
    permission,
    isSupported,
    requestPermission,
    markAsRead,
    markAllAsRead,
  } = usePushNotifications();
  const [open, setOpen] = useState(false);

  const translations = {
    en: {
      notifications: 'Notifications',
      noNotifications: 'No notifications yet',
      markAllRead: 'Mark all as read',
      enableNotifications: 'Enable Notifications',
      notificationsEnabled: 'Notifications are enabled',
    },
    hi: {
      notifications: 'सूचनाएं',
      noNotifications: 'अभी कोई सूचना नहीं',
      markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
      enableNotifications: 'नोटिफिकेशन सक्षम करें',
      notificationsEnabled: 'नोटिफिकेशन सक्षम हैं',
    }
  };

  const t = translations[language] || translations.en;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'daily_horoscope':
        return '🌟';
      case 'auspicious_timing':
        return '✨';
      default:
        return '🔔';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-primary animate-pulse" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{t.notifications}</h4>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                {t.markAllRead}
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t.noNotifications}</p>
              
              {isSupported && permission !== 'granted' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={requestPermission}
                >
                  {t.enableNotifications}
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${
                          !notification.read ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {notification.body}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {notification.read && (
                      <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {isSupported && permission === 'granted' && (
          <div className="p-2 border-t border-border">
            <p className="text-[10px] text-center text-green-500">
              ✓ {t.notificationsEnabled}
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
