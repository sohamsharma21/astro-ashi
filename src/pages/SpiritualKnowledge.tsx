import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, BookmarkPlus, Bookmark, Share2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { knowledgeEntries, knowledgeCategories, getKnowledgeByReligion, KnowledgeEntry } from '@/lib/spiritualKnowledgeData';
import { Religion } from '@/lib/faithModules';
import { useToast } from '@/hooks/use-toast';

const SpiritualKnowledge = () => {
  const { language, userProfile } = useAuth();
  const { toast } = useToast();
  const religion = (userProfile?.religion as Religion) || 'hindu';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('astroashi-bookmarks') || '[]'); } catch { return []; }
  });

  const filtered = useMemo(() => {
    let entries = selectedCategory === 'all' ? getKnowledgeByReligion(religion) : knowledgeEntries.filter(e => e.category === selectedCategory && (e.religion === religion || e.religion === 'all'));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(e => e.title.en.toLowerCase().includes(q) || e.title.hi.includes(q) || e.content.en.toLowerCase().includes(q));
    }
    return entries;
  }, [religion, selectedCategory, searchQuery]);

  const toggleBookmark = (id: string) => {
    const updated = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem('astroashi-bookmarks', JSON.stringify(updated));
    toast({ title: updated.includes(id) ? (language === 'hi' ? '📌 बुकमार्क किया' : '📌 Bookmarked') : (language === 'hi' ? '❌ हटाया' : '❌ Removed') });
  };

  const shareEntry = async (entry: KnowledgeEntry) => {
    const text = `${entry.title[language]}\n\n${entry.content[language].slice(0, 200)}...\n\n— AstroAshi`;
    if (navigator.share) {
      await navigator.share({ title: entry.title[language], text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: language === 'hi' ? '📋 कॉपी किया' : '📋 Copied to clipboard' });
    }
  };

  const t = {
    en: { title: 'Spiritual Knowledge', search: 'Search wisdom...', all: 'For You', bookmarked: 'Bookmarked', noResults: 'No content found.' },
    hi: { title: 'आध्यात्मिक ज्ञान', search: 'ज्ञान खोजें...', all: 'आपके लिए', bookmarked: 'बुकमार्क', noResults: 'कोई सामग्री नहीं मिली।' },
  };
  const tr = t[language] || t.en;

  return (
    <>
      <SEOHead title="Spiritual Knowledge - AstroAshi" description="Multi-faith learning library with sacred texts, teachings and stories." canonical="/spiritual-knowledge" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10 px-4 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
            📚 {tr.title}
          </motion.h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={tr.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
            <Button size="sm" variant={selectedCategory === 'all' ? 'default' : 'outline'} onClick={() => setSelectedCategory('all')} className="text-xs shrink-0">
              ✨ {tr.all}
            </Button>
            {knowledgeCategories.map(cat => (
              <Button key={cat.key} size="sm" variant={selectedCategory === cat.key ? 'default' : 'outline'} onClick={() => setSelectedCategory(cat.key)} className="text-xs shrink-0 gap-1">
                {cat.icon} {cat.label[language]}
              </Button>
            ))}
            <Button size="sm" variant={selectedCategory === 'bookmarked' ? 'default' : 'outline'} onClick={() => setSelectedCategory('bookmarked')} className="text-xs shrink-0 gap-1">
              📌 {tr.bookmarked}
            </Button>
          </div>

          {/* Content Grid */}
          {(selectedCategory === 'bookmarked' ? knowledgeEntries.filter(e => bookmarks.includes(e.id)) : filtered).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">{tr.noResults}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(selectedCategory === 'bookmarked' ? knowledgeEntries.filter(e => bookmarks.includes(e.id)) : filtered).map((entry, i) => (
                <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="p-4 cursor-pointer hover:border-primary/30 transition-all h-full flex flex-col" onClick={() => setSelectedEntry(entry)}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{entry.icon}</span>
                      <button onClick={(e) => { e.stopPropagation(); toggleBookmark(entry.id); }} className="p-1">
                        {bookmarks.includes(entry.id) ? <Bookmark className="w-4 h-4 text-primary fill-primary" /> : <BookmarkPlus className="w-4 h-4 text-muted-foreground" />}
                      </button>
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-1">{entry.title[language]}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 flex-1">{entry.content[language].slice(0, 120)}...</p>
                    <Badge variant="secondary" className="mt-2 text-[10px] w-fit">
                      {knowledgeCategories.find(c => c.key === entry.category)?.label[language]}
                    </Badge>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Detail Dialog */}
          <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              {selectedEntry && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <span className="text-2xl">{selectedEntry.icon}</span>
                      {selectedEntry.title[language]}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-line mt-2">
                    {selectedEntry.content[language]}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => toggleBookmark(selectedEntry.id)}>
                      {bookmarks.includes(selectedEntry.id) ? <Bookmark className="w-3 h-3 fill-primary text-primary" /> : <BookmarkPlus className="w-3 h-3" />}
                      {bookmarks.includes(selectedEntry.id) ? (language === 'hi' ? 'बुकमार्क हटाएं' : 'Unbookmark') : (language === 'hi' ? 'बुकमार्क' : 'Bookmark')}
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => shareEntry(selectedEntry)}>
                      <Share2 className="w-3 h-3" /> {language === 'hi' ? 'शेयर' : 'Share'}
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SpiritualKnowledge;
