import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { GROUPS } from './GroupTabs';

const CATEGORIES = [
  { key: 'discussion', en: 'Discussion', hi: 'चर्चा' },
  { key: 'question', en: 'Question', hi: 'प्रश्न' },
  { key: 'experience', en: 'Experience', hi: 'अनुभव' },
  { key: 'inspiration', en: 'Inspiration', hi: 'प्रेरणा' },
];

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  language: 'en' | 'hi';
  activeGroup: string;
  onPostCreated: () => void;
}

export const CreatePostDialog = ({ open, onOpenChange, userId, language, activeGroup, onPostCreated }: CreatePostDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('discussion');
  const [group, setGroup] = useState(activeGroup);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;
    if (title.trim().length > 150) {
      toast({ title: language === 'hi' ? 'शीर्षक बहुत लंबा है' : 'Title too long', variant: 'destructive' });
      return;
    }
    if (content.trim().length > 2000) {
      toast({ title: language === 'hi' ? 'सामग्री बहुत लंबी है' : 'Content too long', variant: 'destructive' });
      return;
    }
    setCreating(true);
    const { error } = await supabase.from('community_posts').insert({
      user_id: userId, title: title.trim(), content: content.trim(),
      category, group_name: group, is_anonymous: isAnonymous
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: language === 'hi' ? '✨ पोस्ट बनाई गई!' : '✨ Post created!' });
      setTitle(''); setContent(''); setIsAnonymous(false);
      onOpenChange(false);
      onPostCreated();
    }
    setCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {language === 'hi' ? '✍️ नई पोस्ट बनाएं' : '✍️ Create Post'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder={language === 'hi' ? 'शीर्षक' : 'Title'}
            value={title} onChange={e => setTitle(e.target.value)}
            maxLength={150}
          />
          <div>
            <Textarea
              placeholder={language === 'hi' ? 'अपनी बात लिखें...' : 'Share your thoughts...'}
              value={content} onChange={e => setContent(e.target.value)}
              rows={5} maxLength={2000}
            />
            <p className="text-[10px] text-muted-foreground text-right mt-1">{content.length}/2000</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.key} value={c.key}>{language === 'hi' ? c.hi : c.en}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GROUPS.map(g => <SelectItem key={g.key} value={g.key}>{language === 'hi' ? g.hi : g.en}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30">
            <Switch id="anon-create" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
            <Label htmlFor="anon-create" className="text-xs cursor-pointer">
              {language === 'hi' ? '🙏 गुमनाम रहकर पोस्ट करें' : '🙏 Post anonymously'}
            </Label>
          </div>
          <Button className="w-full" onClick={handleCreate} disabled={!title.trim() || !content.trim() || creating}>
            {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {language === 'hi' ? 'पोस्ट करें' : 'Publish'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
