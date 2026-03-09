import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Flag, User, Bookmark, BookmarkCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommentSection } from './CommentSection';
import DOMPurify from 'dompurify';

const CATEGORIES: Record<string, { en: string; hi: string; color: string }> = {
  discussion: { en: 'Discussion', hi: 'चर्चा', color: 'bg-blue-500/10 text-blue-400' },
  question: { en: 'Question', hi: 'प्रश्न', color: 'bg-amber-500/10 text-amber-400' },
  experience: { en: 'Experience', hi: 'अनुभव', color: 'bg-emerald-500/10 text-emerald-400' },
  inspiration: { en: 'Inspiration', hi: 'प्रेरणा', color: 'bg-purple-500/10 text-purple-400' },
};

export interface PostData {
  id: string;
  user_id: string | null;
  title: string;
  content: string;
  category: string;
  group_name: string;
  likes_count: number;
  is_anonymous: boolean;
  created_at: string;
  author_name?: string;
  comment_count?: number;
}

interface PostCardProps {
  post: PostData;
  index: number;
  language: 'en' | 'hi';
  userId?: string;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onReport: (postId: string) => void;
  onShare: (post: PostData) => void;
}

export const PostCard = ({
  post, index, language, userId, isLiked, isBookmarked, onLike, onBookmark, onReport, onShare
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES[post.category] || CATEGORIES.discussion;
  const isLong = post.content.length > 200;

  const timeAgo = (date: string) => {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (mins < 1) return language === 'hi' ? 'अभी' : 'now';
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / 1440)}d`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Card className="bg-card/70 backdrop-blur-sm border-border/30 overflow-hidden hover:border-primary/20 transition-colors">
        <div className="p-4">
          {/* Author row */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {post.is_anonymous
                  ? (language === 'hi' ? '🙏 गुमनाम साधक' : '🙏 Anonymous Seeker')
                  : (post.author_name || (language === 'hi' ? 'सदस्य' : 'Member'))}
              </p>
              <p className="text-[10px] text-muted-foreground">{timeAgo(post.created_at)}</p>
            </div>
            <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 ${cat.color} border-0`}>
              {language === 'hi' ? cat.hi : cat.en}
            </Badge>
          </div>

          {/* Content */}
          <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-snug">{DOMPurify.sanitize(post.title)}</h3>
          <p className={`text-xs text-muted-foreground leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
            {DOMPurify.sanitize(post.content)}
          </p>
          {isLong && (
            <button className="text-[10px] text-primary mt-1 flex items-center gap-0.5" onClick={() => setExpanded(!expanded)}>
              {expanded ? <><ChevronUp className="h-3 w-3" /> {language === 'hi' ? 'कम दिखाएं' : 'Show less'}</> : <><ChevronDown className="h-3 w-3" /> {language === 'hi' ? 'और पढ़ें' : 'Read more'}</>}
            </button>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-border/20">
            <Button
              variant="ghost" size="sm"
              className={`h-8 gap-1.5 text-xs rounded-full ${isLiked ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground'}`}
              onClick={() => onLike(post.id)}
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
              {post.likes_count > 0 && post.likes_count}
            </Button>
            <Button
              variant="ghost" size="sm"
              className="h-8 gap-1.5 text-xs rounded-full text-muted-foreground"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {post.comment_count && post.comment_count > 0 ? post.comment_count : ''}
              {!showComments && <span className="hidden sm:inline">{language === 'hi' ? 'टिप्पणी' : 'Comment'}</span>}
            </Button>
            <Button
              variant="ghost" size="sm"
              className="h-8 gap-1.5 text-xs rounded-full text-muted-foreground"
              onClick={() => onShare(post)}
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>
            <div className="flex-1" />
            <Button
              variant="ghost" size="sm"
              className={`h-8 rounded-full ${isBookmarked ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => onBookmark(post.id)}
            >
              {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5 fill-current" /> : <Bookmark className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost" size="sm"
              className="h-8 rounded-full text-muted-foreground hover:text-destructive"
              onClick={() => onReport(post.id)}
            >
              <Flag className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <CommentSection postId={post.id} userId={userId} language={language} />
        )}
      </Card>
    </motion.div>
  );
};
