import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flag, Plus, Send, User, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  group_name: string;
  likes_count: number;
  is_anonymous: boolean;
  created_at: string;
}

const GROUPS = [
  { key: 'mindfulness', en: 'Mindfulness', hi: 'सचेतनता' },
  { key: 'daily-prayer', en: 'Daily Prayer', hi: 'दैनिक प्रार्थना' },
  { key: 'meditation-challenge', en: 'Meditation Challenge', hi: 'ध्यान चुनौती' },
  { key: 'spiritual-growth', en: 'Spiritual Growth', hi: 'आध्यात्मिक विकास' },
  { key: 'general', en: 'General', hi: 'सामान्य' },
];

const CATEGORIES = [
  { key: 'discussion', en: 'Discussion', hi: 'चर्चा' },
  { key: 'question', en: 'Question', hi: 'प्रश्न' },
  { key: 'experience', en: 'Experience', hi: 'अनुभव' },
  { key: 'inspiration', en: 'Inspiration', hi: 'प्रेरणा' },
];

const Community = () => {
  const { user, language } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState('general');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  // Create post form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('discussion');
  const [newGroup, setNewGroup] = useState('general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadPosts(); loadLikes(); }, [activeGroup]);

  const loadPosts = async () => {
    setLoading(true);
    // Use safe view to protect anonymous user identities
    const query = supabase.from('community_posts_safe' as any).select('*')
      .eq('group_name', activeGroup).order('created_at', { ascending: false }).limit(50);
    const { data } = await query;
    setPosts((data as Post[]) || []);
    setLoading(false);
  };

  const loadLikes = async () => {
    if (!user) return;
    const { data } = await supabase.from('community_likes').select('post_id').eq('user_id', user.id);
    if (data) setLikedPosts(new Set(data.map(l => l.post_id)));
  };

  const createPost = async () => {
    if (!user || !newTitle.trim() || !newContent.trim()) return;
    setCreating(true);
    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id, title: newTitle.trim(), content: newContent.trim(),
      category: newCategory, group_name: newGroup, is_anonymous: isAnonymous
    });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else {
      toast({ title: language === 'hi' ? 'पोस्ट बनाई गई!' : 'Post created!' });
      setNewTitle(''); setNewContent(''); setShowCreate(false); setIsAnonymous(false);
      if (newGroup === activeGroup) loadPosts();
    }
    setCreating(false);
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    if (likedPosts.has(postId)) {
      await supabase.from('community_likes').delete().eq('user_id', user.id).eq('post_id', postId);
      setLikedPosts(prev => { const n = new Set(prev); n.delete(postId); return n; });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p));
      // Update post likes_count
      await supabase.from('community_posts').update({ likes_count: Math.max(0, (posts.find(p => p.id === postId)?.likes_count || 1) - 1) }).eq('id', postId);
    } else {
      await supabase.from('community_likes').insert({ user_id: user.id, post_id: postId });
      setLikedPosts(prev => new Set(prev).add(postId));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
      await supabase.from('community_posts').update({ likes_count: (posts.find(p => p.id === postId)?.likes_count || 0) + 1 }).eq('id', postId);
    }
  };

  const reportPost = async (postId: string) => {
    if (!user) return;
    await supabase.from('community_reports').insert({ reporter_id: user.id, post_id: postId, reason: 'inappropriate' });
    toast({ title: language === 'hi' ? 'रिपोर्ट भेजी गई' : 'Report submitted' });
  };

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  return (
    <>
      <SEOHead title="Spiritual Community - AstroAshi" description="Connect with a global community of spiritual seekers" />
      <Navigation />
      <main className="min-h-screen pt-16 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 max-w-2xl py-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {language === 'hi' ? 'आध्यात्मिक समुदाय' : 'Spiritual Community'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' ? 'साथ मिलकर आगे बढ़ें' : 'Grow together spiritually'}
              </p>
            </div>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full gap-1.5"><Plus className="h-4 w-4" /> {language === 'hi' ? 'पोस्ट' : 'Post'}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>{language === 'hi' ? 'नई पोस्ट बनाएं' : 'Create Post'}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder={language === 'hi' ? 'शीर्षक' : 'Title'} value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                  <Textarea placeholder={language === 'hi' ? 'अपनी बात लिखें...' : 'Share your thoughts...'} value={newContent}
                    onChange={e => setNewContent(e.target.value)} rows={4} />
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={newCategory} onValueChange={setNewCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => <SelectItem key={c.key} value={c.key}>{language === 'hi' ? c.hi : c.en}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={newGroup} onValueChange={setNewGroup}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {GROUPS.map(g => <SelectItem key={g.key} value={g.key}>{language === 'hi' ? g.hi : g.en}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="anon" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                    <Label htmlFor="anon" className="text-sm">{language === 'hi' ? 'गुमनाम रहें' : 'Post anonymously'}</Label>
                  </div>
                  <Button className="w-full" onClick={createPost} disabled={!newTitle.trim() || !newContent.trim() || creating}>
                    <Send className="h-4 w-4 mr-2" /> {language === 'hi' ? 'पोस्ट करें' : 'Publish'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Groups */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {GROUPS.map(g => (
              <Button key={g.key} variant={activeGroup === g.key ? 'default' : 'outline'} size="sm"
                className="shrink-0 text-xs rounded-full" onClick={() => setActiveGroup(g.key)}>
                {language === 'hi' ? g.hi : g.en}
              </Button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'अभी कोई पोस्ट नहीं। पहली पोस्ट बनाएं!' : 'No posts yet. Be the first to share!'}
                </p>
              </div>
            ) : posts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}>
                <Card className="p-4 bg-card/60 border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {post.is_anonymous ? (language === 'hi' ? 'गुमनाम' : 'Anonymous') : 'Member'} · {timeAgo(post.created_at)}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground ml-auto">
                      {CATEGORIES.find(c => c.key === post.category)?.[language === 'hi' ? 'hi' : 'en'] || post.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{post.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{post.content}</p>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className={`h-7 gap-1 text-xs ${likedPosts.has(post.id) ? 'text-red-500' : ''}`}
                      onClick={() => toggleLike(post.id)}>
                      <Heart className={`h-3.5 w-3.5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      {post.likes_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground"
                      onClick={() => reportPost(post.id)}>
                      <Flag className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Community;
