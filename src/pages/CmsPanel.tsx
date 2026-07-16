import React from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { motion } from 'motion/react';
import {
  Lock, Mail, Key, LogOut, ArrowLeft, AlertCircle
} from 'lucide-react';
import { NewsList, NewsForm, HeroList, HeroForm, BranchList, BranchForm, MessageList, SettingsManager } from '../crm';

interface CmsPanelProps {
  onNavigate: (page: 'home' | 'about' | 'contact' | 'news' | 'news-details' | 'cms-panel', sectionId?: string, newsId?: string) => void;
}

export default function CmsPanel({ onNavigate }: CmsPanelProps) {
  // Authentication & Session States
  const [session, setSession] = React.useState<any>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');
  const [submittingLogin, setSubmittingLogin] = React.useState(false);

  // Active Menu Tab (news, hero slides, branches, messages, settings)
  const [activeMenu, setActiveMenu] = React.useState<'news' | 'hero' | 'branch' | 'messages' | 'settings'>('news');

  // Articles & Database States
  const [articles, setArticles] = React.useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = React.useState(false);

  // Slider Slides & Database States
  const [slides, setSlides] = React.useState<any[]>([]);
  const [loadingSlides, setLoadingSlides] = React.useState(false);

  // Branches & Database States
  const [branches, setBranches] = React.useState<any[]>([]);
  const [loadingBranches, setLoadingBranches] = React.useState(false);

  // Messages Inquiries States
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = React.useState(false);

  // Captcha & Page Settings States
  const [captchaEnabled, setCaptchaEnabled] = React.useState(false);
  const [captchaKey, setCaptchaKey] = React.useState('NCT-SAFE');
  const [aboutTitle1En, setAboutTitle1En] = React.useState('A Quarter-Century of');
  const [aboutTitle1Bn, setAboutTitle1Bn] = React.useState('একটি সিকি শতাব্দী ধরে');
  const [aboutTitle2En, setAboutTitle2En] = React.useState('Industrial Excellence');
  const [aboutTitle2Bn, setAboutTitle2Bn] = React.useState('শিল্পগত শ্রেষ্ঠত্ব');
  const [aboutDescEn, setAboutDescEn] = React.useState('');
  const [aboutDescBn, setAboutDescBn] = React.useState('');
  
  const [savingSettings, setSavingSettings] = React.useState(false);

  // DB Error state
  const [dbError, setDbError] = React.useState('');

  // Form Mode & Editing States
  const [formMode, setFormMode] = React.useState<'list' | 'add' | 'edit'>('list');
  const [editingArticle, setEditingArticle] = React.useState<any>(null);
  const [editingSlide, setEditingSlide] = React.useState<any>(null);
  const [editingBranch, setEditingBranch] = React.useState<any>(null);
  
  const [savingArticle, setSavingArticle] = React.useState(false);
  const [savingSlide, setSavingSlide] = React.useState(false);
  const [savingBranch, setSavingBranch] = React.useState(false);

  // Handle Session checking
  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }

    // Get current session
    supabase!.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch articles once logged in
  const fetchArticles = async () => {
    if (!isSupabaseConfigured || !session) return;
    setLoadingArticles(true);
    setDbError('');

    try {
      const { data, error } = await supabase!
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err: any) {
      setDbError(err.message || 'Failed to fetch articles');
    } finally {
      setLoadingArticles(false);
    }
  };

  // Fetch slider slides once logged in
  const fetchSlides = async () => {
    if (!isSupabaseConfigured || !session) return;
    setLoadingSlides(true);
    setDbError('');

    try {
      const { data, error } = await supabase!
        .from('hero_slides')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (err: any) {
      setDbError(err.message || 'Failed to fetch hero slides');
    } finally {
      setLoadingSlides(false);
    }
  };

  // Fetch branches once logged in
  const fetchBranches = async () => {
    if (!isSupabaseConfigured || !session) return;
    setLoadingBranches(true);
    setDbError('');

    try {
      const { data, error } = await supabase!
        .from('branches')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBranches(data || []);
    } catch (err: any) {
      setDbError(err.message || 'Failed to fetch branches');
    } finally {
      setLoadingBranches(false);
    }
  };

  // Fetch messages once logged in
  const fetchMessages = async () => {
    if (!isSupabaseConfigured || !session) return;
    setLoadingMessages(true);
    setDbError('');

    try {
      const { data, error } = await supabase!
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      setDbError(err.message || 'Failed to fetch submitted messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Fetch captcha and story settings once logged in
  const fetchSettings = async () => {
    if (!isSupabaseConfigured || !session) return;
    setDbError('');

    try {
      const { data, error } = await supabase!
        .from('settings')
        .select('*');

      if (error) throw error;
      const enabledSetting = data?.find((s) => s.key === 'captcha_enabled');
      const keySetting = data?.find((s) => s.key === 'captcha_key');
      const at1en = data?.find((s) => s.key === 'about_title1_en');
      const at1bn = data?.find((s) => s.key === 'about_title1_bn');
      const at2en = data?.find((s) => s.key === 'about_title2_en');
      const at2bn = data?.find((s) => s.key === 'about_title2_bn');
      const aden = data?.find((s) => s.key === 'about_desc_en');
      const adbn = data?.find((s) => s.key === 'about_desc_bn');

      setCaptchaEnabled(enabledSetting?.value === 'true');
      setCaptchaKey(keySetting?.value || 'NCT-SAFE');
      setAboutTitle1En(at1en?.value || 'A Quarter-Century of');
      setAboutTitle1Bn(at1bn?.value || 'একটি সিকি শতাব্দী ধরে');
      setAboutTitle2En(at2en?.value || 'Industrial Excellence');
      setAboutTitle2Bn(at2bn?.value || 'শিল্পগত শ্রেষ্ঠত্ব');
      setAboutDescEn(aden?.value || '');
      setAboutDescBn(adbn?.value || '');
    } catch (err: any) {
      setDbError(err.message || 'Failed to fetch settings');
    }
  };

  React.useEffect(() => {
    if (session) {
      fetchArticles();
      fetchSlides();
      fetchBranches();
      fetchMessages();
      fetchSettings();
    }
  }, [session]);

  // Auth Functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    setLoginError('');
    setSubmittingLogin(true);

    try {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      setSession(data.session);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid login credentials');
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    if (!isSupabaseConfigured) return;
    await supabase!.auth.signOut();
    setSession(null);
    setFormMode('list');
  };

  // Form Actions (Articles)
  const handleSaveArticle = async (articleData: any) => {
    if (!isSupabaseConfigured || !session) return;
    setSavingArticle(true);
    setDbError('');

    try {
      if (formMode === 'add') {
        const { error } = await supabase!
          .from('news')
          .insert([articleData]);
        if (error) throw error;
      } else if (formMode === 'edit' && editingArticle) {
        const { error } = await supabase!
          .from('news')
          .update(articleData)
          .eq('id', editingArticle.id);
        if (error) throw error;
      }

      setFormMode('list');
      setEditingArticle(null);
      fetchArticles();
    } catch (err: any) {
      setDbError(err.message || 'Failed to save article');
    } finally {
      setSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!isSupabaseConfigured || !session) return;
    if (!window.confirm('Are you sure you want to delete this news?')) return;
    setDbError('');

    try {
      const { error } = await supabase!
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchArticles();
    } catch (err: any) {
      setDbError(err.message || 'Failed to delete article');
    }
  };

  // Form Actions (Hero Slides)
  const handleSaveSlide = async (slideData: any) => {
    if (!isSupabaseConfigured || !session) return;
    setSavingSlide(true);
    setDbError('');

    try {
      if (formMode === 'add') {
        const { error } = await supabase!
          .from('hero_slides')
          .insert([slideData]);
        if (error) throw error;
      } else if (formMode === 'edit' && editingSlide) {
        const { error } = await supabase!
          .from('hero_slides')
          .update(slideData)
          .eq('id', editingSlide.id);
        if (error) throw error;
      }

      setFormMode('list');
      setEditingSlide(null);
      fetchSlides();
    } catch (err: any) {
      setDbError(err.message || 'Failed to save slide');
    } finally {
      setSavingSlide(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!isSupabaseConfigured || !session) return;
    if (!window.confirm('Are you sure you want to delete this hero slide?')) return;
    setDbError('');

    try {
      const { error } = await supabase!
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSlides();
    } catch (err: any) {
      setDbError(err.message || 'Failed to delete slide');
    }
  };

  // Form Actions (Branches)
  const handleSaveBranch = async (branchData: any) => {
    if (!isSupabaseConfigured || !session) return;
    setSavingBranch(true);
    setDbError('');

    try {
      if (formMode === 'add') {
        const { error } = await supabase!
          .from('branches')
          .insert([branchData]);
        if (error) throw error;
      } else if (formMode === 'edit' && editingBranch) {
        const { error } = await supabase!
          .from('branches')
          .update(branchData)
          .eq('id', editingBranch.id);
        if (error) throw error;
      }

      setFormMode('list');
      setEditingBranch(null);
      fetchBranches();
    } catch (err: any) {
      setDbError(err.message || 'Failed to save branch');
    } finally {
      setSavingBranch(false);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!isSupabaseConfigured || !session) return;
    if (!window.confirm('Are you sure you want to delete this branch location?')) return;
    setDbError('');

    try {
      const { error } = await supabase!
        .from('branches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchBranches();
    } catch (err: any) {
      setDbError(err.message || 'Failed to delete branch');
    }
  };

  // Form Actions (Messages Inquiries)
  const handleDeleteMessage = async (id: string) => {
    if (!isSupabaseConfigured || !session) return;
    if (!window.confirm('Are you sure you want to delete this message record?')) return;
    setDbError('');

    try {
      const { error } = await supabase!
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (err: any) {
      setDbError(err.message || 'Failed to delete message');
    }
  };

  // Form Actions (Settings update)
  const handleSaveSettings = async (newSettings: any) => {
    if (!isSupabaseConfigured || !session) return;
    setSavingSettings(true);
    setDbError('');

    try {
      const settingsPayload = [
        { key: 'captcha_enabled', value: newSettings.captchaEnabled ? 'true' : 'false' },
        { key: 'captcha_key', value: newSettings.captchaKey },
        { key: 'about_title1_en', value: newSettings.aboutTitle1En },
        { key: 'about_title1_bn', value: newSettings.aboutTitle1Bn },
        { key: 'about_title2_en', value: newSettings.aboutTitle2En },
        { key: 'about_title2_bn', value: newSettings.aboutTitle2Bn },
        { key: 'about_desc_en', value: newSettings.aboutDescEn },
        { key: 'about_desc_bn', value: newSettings.aboutDescBn }
      ];

      const { error } = await supabase!
        .from('settings')
        .upsert(settingsPayload);

      if (error) throw error;

      setCaptchaEnabled(newSettings.captchaEnabled);
      setCaptchaKey(newSettings.captchaKey);
      setAboutTitle1En(newSettings.aboutTitle1En);
      setAboutTitle1Bn(newSettings.aboutTitle1Bn);
      setAboutTitle2En(newSettings.aboutTitle2En);
      setAboutTitle2Bn(newSettings.aboutTitle2Bn);
      setAboutDescEn(newSettings.aboutDescEn);
      setAboutDescBn(newSettings.aboutDescBn);

      alert('Settings updated successfully!');
    } catch (err: any) {
      setDbError(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // 1. Check if Supabase configuration is missing
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-slate-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-12 bg-slate-955 border border-white/10 rounded-[32px] text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
          <AlertCircle className="w-16 h-16 text-primary-light mx-auto animate-pulse" />
          <h2 className="text-3xl font-black uppercase tracking-tight">CMS Connection Required</h2>
          <p className="text-slate-400 text-sm leading-relaxed font-semibold">
            Supabase credentials are not configured yet. To use the Newsroom CMS, please add the credentials to your environment configuration:
          </p>
          <div className="bg-slate-900 p-4 rounded-xl border border-white/5 text-left font-mono text-[10.5px] text-slate-300 space-y-2 select-all">
            <p>VITE_SUPABASE_URL=your_supabase_url</p>
            <p>VITE_SUPABASE_ANON_KEY=your_anon_key</p>
          </div>
          <p className="text-xs text-slate-500">
            The public site will continue displaying mock data in fallback mode.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-white text-slate-950 font-black py-4 rounded-xl text-sm transition-all hover:bg-slate-100 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Website
          </button>
        </div>
      </div>
    );
  }

  // 2. Loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Checking Session...</p>
        </div>
      </div>
    );
  }

  // 3. Render login page if unauthenticated
  if (!session) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-slate-955 text-white flex items-center justify-center relative overflow-hidden">
        {/* Backdrop radial grid */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 backdrop-blur-md p-8 md:p-10 rounded-[32px] border border-white/10 shadow-2xl space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/20 text-primary-light rounded-2xl flex items-center justify-center mx-auto border border-primary/25">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight">CMS Administration</h1>
              <p className="text-slate-400 text-xs font-semibold">
                Sign in with editor credentials to manage newsroom updates.
              </p>
            </div>

            {loginError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="email"
                    required
                    placeholder="editor@ntc-global.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm placeholder:text-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm placeholder:text-slate-655 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingLogin}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-85 text-white font-black py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 mt-6"
              >
                {submittingLogin ? (
                  <>
                    <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying authorization...
                  </>
                ) : (
                  <>
                    Authorize Access <ArrowLeft className="w-4.5 h-4.5 rotate-180" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => onNavigate('home')}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-350 transition-colors uppercase tracking-widest cursor-pointer mt-4"
            >
              Return to Landing Page
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // 4. Render main CMS dashboard
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-5 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-primary/20 text-primary-light border border-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">
              CMS Panel
            </span>
            <span className="text-slate-400 text-xs font-mono hidden md:inline">
              User: <span className="text-white font-bold">{session.user.email}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-900/10"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Menu Selector Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-4 md:gap-6">
          <button
            onClick={() => { setActiveMenu('news'); setFormMode('list'); }}
            className={`py-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
              activeMenu === 'news' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            News Manager
          </button>
          <button
            onClick={() => { setActiveMenu('hero'); setFormMode('list'); }}
            className={`py-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
              activeMenu === 'hero' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Hero Images
          </button>
          <button
            onClick={() => { setActiveMenu('branch'); setFormMode('list'); }}
            className={`py-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
              activeMenu === 'branch' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Branches
          </button>
          <button
            onClick={() => { setActiveMenu('messages'); setFormMode('list'); }}
            className={`py-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
              activeMenu === 'messages' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => { setActiveMenu('settings'); setFormMode('list'); }}
            className={`py-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
              activeMenu === 'settings' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Security Settings
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error notification banner if any */}
        {dbError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl flex items-start gap-2.5 mb-8 shadow-sm">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{dbError}</span>
          </div>
        )}

        {/* CMS View Switcher */}
        {activeMenu === 'news' ? (
          formMode === 'list' ? (
            <NewsList
              articles={articles}
              loadingArticles={loadingArticles}
              onAddNews={() => {
                setEditingArticle(null);
                setFormMode('add');
              }}
              onEditNews={(article) => {
                setEditingArticle(article);
                setFormMode('edit');
              }}
              onDeleteNews={handleDeleteArticle}
              onNavigate={onNavigate}
            />
          ) : (
            <NewsForm
              formMode={formMode}
              editingId={editingArticle ? editingArticle.id : null}
              initialData={editingArticle}
              onSave={handleSaveArticle}
              onCancel={() => {
                setFormMode('list');
                setEditingArticle(null);
              }}
              savingArticle={savingArticle}
            />
          )
        ) : activeMenu === 'hero' ? (
          formMode === 'list' ? (
            <HeroList
              slides={slides}
              loadingSlides={loadingSlides}
              onAddSlide={() => {
                setEditingSlide(null);
                setFormMode('add');
              }}
              onEditSlide={(slide) => {
                setEditingSlide(slide);
                setFormMode('edit');
              }}
              onDeleteSlide={handleDeleteSlide}
            />
          ) : (
            <HeroForm
              formMode={formMode}
              editingId={editingSlide ? editingSlide.id : null}
              initialData={editingSlide}
              onSave={handleSaveSlide}
              onCancel={() => {
                setFormMode('list');
                setEditingSlide(null);
              }}
              savingSlide={savingSlide}
            />
          )
        ) : activeMenu === 'branch' ? (
          formMode === 'list' ? (
            <BranchList
              branches={branches}
              loadingBranches={loadingBranches}
              onAddBranch={() => {
                setEditingBranch(null);
                setFormMode('add');
              }}
              onEditBranch={(branch) => {
                setEditingBranch(branch);
                setFormMode('edit');
              }}
              onDeleteBranch={handleDeleteBranch}
            />
          ) : (
            <BranchForm
              formMode={formMode}
              editingId={editingBranch ? editingBranch.id : null}
              initialData={editingBranch}
              onSave={handleSaveBranch}
              onCancel={() => {
                setFormMode('list');
                setEditingBranch(null);
              }}
              savingBranch={savingBranch}
            />
          )
        ) : activeMenu === 'messages' ? (
          <MessageList
            messages={messages}
            loadingMessages={loadingMessages}
            onDeleteMessage={handleDeleteMessage}
          />
        ) : (
          <SettingsManager
            initialSettings={{
              captchaEnabled,
              captchaKey,
              aboutTitle1En,
              aboutTitle1Bn,
              aboutTitle2En,
              aboutTitle2Bn,
              aboutDescEn,
              aboutDescBn
            }}
            onSaveSettings={handleSaveSettings}
            savingSettings={savingSettings}
          />
        )}
      </main>
    </div>
  );
}
