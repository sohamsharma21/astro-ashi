import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Globe, Heart, Download, Trash2, Loader2 } from 'lucide-react';
import { Religion, getReligionLabel } from '@/lib/faithModules';

const Settings = () => {
  const { user, language, setLanguage, userProfile, updateUserProfile } = useAuth();
  const [religion, setReligion] = useState<Religion>((userProfile as any)?.religion || 'hindu');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const t = {
    en: {
      title: 'Settings',
      language: 'Language',
      religion: 'Religion',
      save: 'Save Changes',
      dataExport: 'Export My Data',
      dataDelete: 'Delete My Account',
      exportDesc: 'Download all your data as JSON.',
      deleteDesc: 'Permanently delete your account and all data.',
      deleteConfirm: 'Are you sure? This action cannot be undone.',
      saved: 'Settings saved!',
      exported: 'Data exported!',
    },
    hi: {
      title: 'सेटिंग्स',
      language: 'भाषा',
      religion: 'धर्म',
      save: 'परिवर्तन सहेजें',
      dataExport: 'मेरा डेटा निर्यात करें',
      dataDelete: 'मेरा खाता हटाएं',
      exportDesc: 'अपना सारा डेटा JSON के रूप में डाउनलोड करें।',
      deleteDesc: 'अपना खाता और सारा डेटा स्थायी रूप से हटाएं।',
      deleteConfirm: 'क्या आप सुनिश्चित हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।',
      saved: 'सेटिंग्स सहेजी गई!',
      exported: 'डेटा निर्यात किया गया!',
    },
  };
  const tr = t[language] || t.en;

  const religions: Religion[] = ['hindu', 'muslim', 'christian', 'jain', 'buddhist', 'sikh', 'other'];

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile({ preferred_language: language } as any);
      const { error } = await supabase
        .from('profiles')
        .update({ religion })
        .eq('id', user.id);
      if (error) throw error;
      toast.success(tr.saved);
    } catch (err) {
      console.error('Settings save error:', err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const [profileRes, kundliRes, predictionsRes, historyRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('kundli_data').select('*').eq('user_id', user.id),
        supabase.from('user_predictions').select('*').eq('user_id', user.id),
        supabase.from('reading_history').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        profile: profileRes.data,
        kundli: kundliRes.data,
        predictions: predictionsRes.data,
        readingHistory: historyRes.data,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `astroashi-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(tr.exported);
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(tr.deleteConfirm)) return;
    // In production, this would call an edge function that uses service_role to delete user
    toast.error('Account deletion requires admin approval. Please contact support.');
  };

  return (
    <>
      <SEOHead title={`${tr.title} - AstroAshi`} description="Manage your AstroAshi settings" canonical="/settings" />
      <div className="cosmic-bg min-h-screen">
        <StarBackground starCount={100} />
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-cinzel text-gradient-gold mb-2">{tr.title}</h1>
            </div>

            {/* Language & Religion */}
            <Card className="bg-gradient-to-br from-background to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cinzel">
                  <Globe className="w-5 h-5 text-primary" />
                  {tr.language} & {tr.religion}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{tr.language}</Label>
                  <Select value={language} onValueChange={(val: 'en' | 'hi') => setLanguage(val)}>
                    <SelectTrigger className="bg-background/50 border-primary/20"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{tr.religion}</Label>
                  <Select value={religion} onValueChange={(val: Religion) => setReligion(val)}>
                    <SelectTrigger className="bg-background/50 border-primary/20"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {religions.map((r) => (
                        <SelectItem key={r} value={r}>{getReligionLabel(r, language)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full cosmic-button">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {tr.save}
                </Button>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-gradient-to-br from-background to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cinzel">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                  {language === 'hi' ? 'डेटा प्रबंधन' : 'Data Management'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
                  <div>
                    <p className="font-medium flex items-center gap-2"><Download className="w-4 h-4" /> {tr.dataExport}</p>
                    <p className="text-xs text-muted-foreground">{tr.exportDesc}</p>
                  </div>
                  <Button variant="outline" onClick={handleExport} disabled={exporting}>
                    {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : tr.dataExport}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                  <div>
                    <p className="font-medium flex items-center gap-2 text-destructive"><Trash2 className="w-4 h-4" /> {tr.dataDelete}</p>
                    <p className="text-xs text-muted-foreground">{tr.deleteDesc}</p>
                  </div>
                  <Button variant="destructive" onClick={handleDelete}>{tr.dataDelete}</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Settings;
