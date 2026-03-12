import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Flame, Heart, MessageCircle, LayoutGrid } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const GROUPS: { key: string; en: string; hi: string; icon: LucideIcon }[] = [
  { key: 'all', en: 'All', hi: 'सभी', icon: LayoutGrid },
  { key: 'general', en: 'General', hi: 'सामान्य', icon: MessageCircle },
  { key: 'mindfulness', en: 'Mindfulness', hi: 'सचेतनता', icon: Sparkles },
  { key: 'daily-prayer', en: 'Daily Prayer', hi: 'दैनिक प्रार्थना', icon: BookOpen },
  { key: 'meditation-challenge', en: 'Meditation', hi: 'ध्यान चुनौती', icon: Flame },
  { key: 'spiritual-growth', en: 'Growth', hi: 'आध्यात्मिक विकास', icon: Heart },
];

interface GroupTabsProps {
  activeGroup: string;
  onGroupChange: (group: string) => void;
  language: 'en' | 'hi';
}

export const GroupTabs = ({ activeGroup, onGroupChange, language }: GroupTabsProps) => (
  <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
    {GROUPS.map(g => {
      const Icon = g.icon;
      return (
        <Button
          key={g.key}
          variant={activeGroup === g.key ? 'default' : 'outline'}
          size="sm"
          className="shrink-0 text-xs rounded-full gap-1.5"
          onClick={() => onGroupChange(g.key)}
        >
          <Icon className="h-3.5 w-3.5" />
          {language === 'hi' ? g.hi : g.en}
        </Button>
      );
    })}
  </div>
);

export { GROUPS };
