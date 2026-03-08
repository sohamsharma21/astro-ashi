import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Trash2, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Religion } from '@/lib/faithModules';
import { goalCategories, getSuggestedGoals } from '@/lib/lifeGoalsData';
import { Slider } from '@/components/ui/slider';

interface LifeGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  milestones: { text: string; done: boolean }[];
  progress: number;
  completed: boolean;
}

const LifePathPlanner = () => {
  const { user, language, userProfile } = useAuth();
  const { toast } = useToast();
  const religion = (userProfile?.religion as Religion) || 'hindu';
  const [goals, setGoals] = useState<LifeGoal[]>([]);
  const [_loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('patience');

  const loadGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('life_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setGoals((data || []).map((g: any) => ({
      id: g.id, title: g.title, description: g.description, category: g.category,
      milestones: (g.milestones as any[]) || [], progress: g.progress, completed: g.completed,
    })));
    setLoading(false);
  }, [user]);

  useEffect(() => { loadGoals(); }, [loadGoals]);

  const createGoal = async () => {
    if (!user || !newTitle.trim()) return;
    await supabase.from('life_goals').insert({
      user_id: user.id, title: newTitle, description: newDesc, category: newCategory,
      milestones: [], progress: 0, completed: false,
    });
    setNewTitle(''); setNewDesc(''); setShowCreate(false);
    toast({ title: language === 'hi' ? '✅ लक्ष्य बनाया!' : '✅ Goal created!' });
    loadGoals();
  };

  const useSuggestion = (suggestion: any) => {
    setNewTitle(suggestion.title[language]);
    setNewDesc(suggestion.description[language]);
    setNewCategory(suggestion.category);
    setShowCreate(true);
  };

  const updateProgress = async (goalId: string, progress: number) => {
    await supabase.from('life_goals').update({ progress, completed: progress >= 100, updated_at: new Date().toISOString() }).eq('id', goalId);
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, progress, completed: progress >= 100 } : g));
  };

  const toggleMilestone = async (goalId: string, milestoneIdx: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const updated = goal.milestones.map((m, i) => i === milestoneIdx ? { ...m, done: !m.done } : m);
    const doneCount = updated.filter(m => m.done).length;
    const newProgress = updated.length > 0 ? Math.round((doneCount / updated.length) * 100) : goal.progress;
    await supabase.from('life_goals').update({ milestones: updated as any, progress: newProgress, completed: newProgress >= 100, updated_at: new Date().toISOString() }).eq('id', goalId);
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, milestones: updated, progress: newProgress, completed: newProgress >= 100 } : g));
  };

  const deleteGoal = async (goalId: string) => {
    await supabase.from('life_goals').delete().eq('id', goalId);
    setGoals(prev => prev.filter(g => g.id !== goalId));
    toast({ title: language === 'hi' ? '🗑️ लक्ष्य हटाया' : '🗑️ Goal removed' });
  };

  const suggestions = getSuggestedGoals(religion);

  const t = {
    en: { title: 'Life Path Planner', create: 'Create Goal', suggested: 'Suggested Goals', myGoals: 'My Goals', noGoals: 'No goals yet. Create your first!', name: 'Goal title', desc: 'Description (optional)', save: 'Save Goal' },
    hi: { title: 'जीवन पथ योजनाकार', create: 'लक्ष्य बनाएं', suggested: 'सुझाए गए लक्ष्य', myGoals: 'मेरे लक्ष्य', noGoals: 'अभी कोई लक्ष्य नहीं। पहला बनाएं!', name: 'लक्ष्य शीर्षक', desc: 'विवरण (वैकल्पिक)', save: 'लक्ष्य सहेजें' },
  };
  const tr = t[language] || t.en;

  return (
    <>
      <SEOHead title="Life Path Planner - AstroAshi" description="Align your life goals with spiritual values." canonical="/life-path" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
            🎯 {tr.title}
          </motion.h1>

          {/* Suggested Goals */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-primary" /> {tr.suggested}
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestions.map((s, i) => (
                <Card key={i} className="p-3 min-w-[200px] cursor-pointer hover:border-primary/30 transition-all shrink-0" onClick={() => useSuggestion(s)}>
                  <p className="text-xs font-medium text-foreground">{s.title[language]}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{s.description[language]}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Create Button */}
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button className="w-full mb-6 gap-2"><Plus className="w-4 h-4" /> {tr.create}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{tr.create}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder={tr.name} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                <Textarea placeholder={tr.desc} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2} />
                <div className="flex flex-wrap gap-2">
                  {goalCategories.map(c => (
                    <Button key={c.key} size="sm" variant={newCategory === c.key ? 'default' : 'outline'} onClick={() => setNewCategory(c.key)} className="text-xs gap-1">
                      {c.icon} {c.label[language]}
                    </Button>
                  ))}
                </div>
                <Button onClick={createGoal} className="w-full">{tr.save}</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Goals List */}
          {goals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">{tr.noGoals}</div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal, i) => {
                const cat = goalCategories.find(c => c.key === goal.category);
                return (
                  <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className={`p-4 ${goal.completed ? 'border-primary/40 bg-primary/5' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-foreground flex items-center gap-2">
                            {cat?.icon} {goal.title}
                            {goal.completed && <Badge variant="default" className="text-[10px]">✅</Badge>}
                          </h3>
                          {goal.description && <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>}
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => deleteGoal(goal.id)} className="shrink-0 h-8 w-8">
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-bold text-primary">{goal.progress}%</span>
                        </div>
                        <Slider value={[goal.progress]} onValueChange={([v]) => updateProgress(goal.id, v)} max={100} step={5} className="mt-1" />
                      </div>

                      {/* Milestones */}
                      {goal.milestones.length > 0 && (
                        <div className="space-y-1.5">
                          {goal.milestones.map((m, mi) => (
                            <button key={mi} onClick={() => toggleMilestone(goal.id, mi)}
                              className="flex items-center gap-2 text-xs w-full text-left">
                              {m.done ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                              <span className={m.done ? 'line-through text-muted-foreground' : 'text-foreground'}>{m.text}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LifePathPlanner;
