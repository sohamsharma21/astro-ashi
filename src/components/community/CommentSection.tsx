import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';

interface Comment {
  id: string;
  content: string;
  user_id: string | null;
  is_anonymous: boolean;
  created_at: string;
  author_name?: string;
}

interface CommentSectionProps {
  postId: string;
  userId?: string;
  language: 'en' | 'hi';
}

export const CommentSection = ({ postId, userId, language }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => { loadComments(); }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('community_comments_safe' as any)
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (data) {
      // Fetch author names for non-anonymous comments
      const userIds = (data as any[]).filter(c => !c.is_anonymous && c.user_id).map(c => c.user_id);
      let profileMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
        if (profiles) profiles.forEach(p => { profileMap[p.id] = p.full_name || ''; });
      }
      setComments((data as any[]).map(c => ({
        ...c,
        author_name: !c.is_anonymous && c.user_id ? profileMap[c.user_id] : undefined,
      })));
    }
    setLoading(false);
  };

  const submitComment = async () => {
    if (!userId || !text.trim()) return;
    if (text.trim().length > 500) {
      toast({ title: language === 'hi' ? 'टिप्पणी बहुत लंबी है' : 'Comment too long', variant: 'destructive' });
      return;
    }
    setSending(true);
    const { error } = await supabase.from('community_comments').insert({
      post_id: postId, user_id: userId, content: text.trim(), is_anonymous: isAnon
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setText('');
      loadComments();
    }
    setSending(false);
  };

  const deleteComment = async (commentId: string) => {
    await supabase.from('community_comments').delete().eq('id', commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return language === 'hi' ? 'अभी' : 'now';
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  return (
    <div className="border-t border-border/20 bg-muted/10 px-4 pb-4 pt-3">
      {loading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-2.5 mb-3 max-h-60 overflow-y-auto">
            {comments.length === 0 && (
              <p className="text-[11px] text-muted-foreground text-center py-2">
                {language === 'hi' ? 'कोई टिप्पणी नहीं। पहले लिखें!' : 'No comments yet. Be the first!'}
              </p>
            )}
            {comments.map(c => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2 group"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-3 w-3 text-primary/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-foreground">
                      {c.is_anonymous
                        ? (language === 'hi' ? 'गुमनाम' : 'Anonymous')
                        : (c.author_name || (language === 'hi' ? 'सदस्य' : 'Member'))}
                    </span>
                    <span className="text-[9px] text-muted-foreground">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{DOMPurify.sanitize(c.content)}</p>
                </div>
                {userId && c.user_id === userId && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-destructive/60 shrink-0"
                    onClick={() => deleteComment(c.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {userId && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={language === 'hi' ? 'टिप्पणी लिखें...' : 'Write a comment...'}
              className="text-xs h-8 bg-background/50"
              maxLength={500}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submitComment()}
            />
            <Button size="sm" className="h-8 w-8 p-0 shrink-0" onClick={submitComment} disabled={!text.trim() || sending}>
              {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <div className="flex items-center gap-1.5">
            <Switch id={`anon-comment-${postId}`} checked={isAnon} onCheckedChange={setIsAnon} className="scale-75" />
            <Label htmlFor={`anon-comment-${postId}`} className="text-[10px] text-muted-foreground cursor-pointer">
              {language === 'hi' ? 'गुमनाम' : 'Anonymous'}
            </Label>
          </div>
        </div>
      )}
    </div>
  );
};
