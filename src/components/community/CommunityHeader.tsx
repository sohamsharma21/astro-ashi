import { motion } from 'framer-motion';
import { Plus, Search, TrendingUp, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface CommunityHeaderProps {
  language: 'en' | 'hi';
  onCreatePost: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'recent' | 'trending';
  onSortChange: (s: 'recent' | 'trending') => void;
}

export const CommunityHeader = ({
  language, onCreatePost, searchQuery, onSearchChange, sortBy, onSortChange
}: CommunityHeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mb-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            🙏 {language === 'hi' ? 'आध्यात्मिक समुदाय' : 'Spiritual Community'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === 'hi' ? 'साथ मिलकर आगे बढ़ें' : 'Grow together spiritually'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setShowSearch(!showSearch)}>
            {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
          <Button size="sm" className="rounded-full gap-1.5" onClick={onCreatePost}>
            <Plus className="h-4 w-4" /> {language === 'hi' ? 'पोस्ट' : 'Post'}
          </Button>
        </div>
      </div>

      {showSearch && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Input
            placeholder={language === 'hi' ? 'पोस्ट खोजें...' : 'Search posts...'}
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="bg-muted/30"
          />
        </motion.div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant={sortBy === 'recent' ? 'secondary' : 'ghost'}
          size="sm" className="h-7 text-xs gap-1 rounded-full"
          onClick={() => onSortChange('recent')}
        >
          <Clock className="h-3 w-3" /> {language === 'hi' ? 'नवीनतम' : 'Recent'}
        </Button>
        <Button
          variant={sortBy === 'trending' ? 'secondary' : 'ghost'}
          size="sm" className="h-7 text-xs gap-1 rounded-full"
          onClick={() => onSortChange('trending')}
        >
          <TrendingUp className="h-3 w-3" /> {language === 'hi' ? 'ट्रेंडिंग' : 'Trending'}
        </Button>
      </div>
    </motion.div>
  );
};
