import { useState, useEffect, useCallback } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { SEOHead } from '@/components/SEOHead';
import { toast } from '@/hooks/use-toast';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { GroupTabs } from '@/components/community/GroupTabs';
import { PostCard, type PostData } from '@/components/community/PostCard';
import { CreatePostDialog } from '@/components/community/CreatePostDialog';
import { Skeleton } from '@/components/ui/skeleton';

const Community = () => {
  const { user, language } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'trending'>('recent');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('community_posts_safe' as any)
      .select('*')
      .eq('group_name', activeGroup)
      .limit(50);

    if (sortBy === 'trending') {
      query = query.order('likes_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;
    let postsData = (data as unknown as PostData[]) || [];

    // Fetch author names for non-anonymous posts
    const userIds = postsData.filter(p => !p.is_anonymous && p.user_id).map(p => p.user_id!);
    let profileMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
      if (profiles) profiles.forEach(p => { profileMap[p.id] = p.full_name || ''; });
    }

    // Fetch comment counts
    const postIds = postsData.map(p => p.id);
    let commentCounts: Record<string, number> = {};
    if (postIds.length > 0) {
      const { data: comments } = await supabase
        .from('community_comments_safe' as any)
        .select('post_id')
        .in('post_id', postIds);
      if (comments) {
        (comments as any[]).forEach((c: any) => { commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1; });
      }
    }

    postsData = postsData.map(p => ({
      ...p,
      author_name: !p.is_anonymous && p.user_id ? profileMap[p.user_id] : undefined,
      comment_count: commentCounts[p.id] || 0,
    }));

    setPosts(postsData);
    setLoading(false);
  }, [activeGroup, sortBy]);

  const loadLikes = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('community_likes').select('post_id').eq('user_id', user.id);
    if (data) setLikedPosts(new Set(data.map(l => l.post_id)));
  }, [user]);

  useEffect(() => { loadPosts(); loadLikes(); }, [loadPosts, loadLikes]);

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({ title: language === 'hi' ? 'पहले लॉगिन करें' : 'Please sign in first', variant: 'destructive' });
      return;
    }
    const liked = likedPosts.has(postId);
    // Optimistic update
    setLikedPosts(prev => { const n = new Set(prev); liked ? n.delete(postId) : n.add(postId); return n; });
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + (liked ? -1 : 1) } : p));

    if (liked) {
      await supabase.from('community_likes').delete().eq('user_id', user.id).eq('post_id', postId);
      const post = posts.find(p => p.id === postId);
      if (post) await supabase.from('community_posts').update({ likes_count: Math.max(0, post.likes_count - 1) }).eq('id', postId);
    } else {
      await supabase.from('community_likes').insert({ user_id: user.id, post_id: postId });
      const post = posts.find(p => p.id === postId);
      if (post) await supabase.from('community_posts').update({ likes_count: post.likes_count + 1 }).eq('id', postId);
    }
  };

  const toggleBookmark = (postId: string) => {
    // Client-side only bookmarks (localStorage)
    setBookmarkedPosts(prev => {
      const n = new Set(prev);
      n.has(postId) ? n.delete(postId) : n.add(postId);
      const arr = Array.from(n);
      localStorage.setItem('community_bookmarks', JSON.stringify(arr));
      return n;
    });
    toast({ title: bookmarkedPosts.has(postId) ? (language === 'hi' ? 'बुकमार्क हटाया' : 'Bookmark removed') : (language === 'hi' ? '🔖 बुकमार्क किया!' : '🔖 Bookmarked!') });
  };

  const reportPost = async (postId: string) => {
    if (!user) return;
    await supabase.from('community_reports').insert({ reporter_id: user.id, post_id: postId, reason: 'inappropriate' });
    toast({ title: language === 'hi' ? '🚩 रिपोर्ट भेजी गई' : '🚩 Report submitted' });
  };

  const sharePost = async (post: PostData) => {
    const text = `${post.title}\n\n${post.content.slice(0, 200)}...`;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: language === 'hi' ? '📋 कॉपी किया!' : '📋 Copied to clipboard!' });
    }
  };

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('community_bookmarks');
      if (saved) setBookmarkedPosts(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  // Filter by search
  const filteredPosts = searchQuery.trim()
    ? posts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  return (
    <>
      <SEOHead title="Spiritual Community - AstroAshi" description="Connect with a global community of spiritual seekers" />
      <Navigation />
      <main className="min-h-screen pt-16 sm:pt-18 md:pt-20 pb-24 lg:pb-10">
        <div className="container mx-auto px-4 max-w-2xl md:max-w-3xl lg:max-w-4xl py-4 sm:py-6">
          <CommunityHeader
            language={language as 'en' | 'hi'}
            onCreatePost={() => user ? setShowCreate(true) : toast({ title: language === 'hi' ? 'पहले लॉगिन करें' : 'Please sign in', variant: 'destructive' })}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <GroupTabs activeGroup={activeGroup} onGroupChange={setActiveGroup} language={language as 'en' | 'hi'} />

          {/* Posts list */}
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? (language === 'hi' ? 'कोई पोस्ट नहीं मिली' : 'No posts found')
                    : (language === 'hi' ? 'अभी कोई पोस्ट नहीं। पहली पोस्ट बनाएं!' : 'No posts yet. Be the first to share!')}
                </p>
              </div>
            ) : filteredPosts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                index={i}
                language={language as 'en' | 'hi'}
                userId={user?.id}
                isLiked={likedPosts.has(post.id)}
                isBookmarked={bookmarkedPosts.has(post.id)}
                onLike={toggleLike}
                onBookmark={toggleBookmark}
                onReport={reportPost}
                onShare={sharePost}
              />
            ))}
          </div>
        </div>
      </main>

      {user && (
        <CreatePostDialog
          open={showCreate}
          onOpenChange={setShowCreate}
          userId={user.id}
          language={language as 'en' | 'hi'}
          activeGroup={activeGroup}
          onPostCreated={loadPosts}
        />
      )}
    </>
  );
};

export default Community;
