import React from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { motion } from 'motion/react';
import {
  Lock, Mail, Key, LogOut, ArrowLeft, Plus, Edit2, Trash2, Calendar,
  Clock, Eye, FileText, Check, AlertCircle, Bold, Italic, Heading2,
  Heading3, Quote, List, Link2, LayoutGrid, Image, Sparkles
} from 'lucide-react';
import { NewsItem } from '../types';

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

  // Articles & Database States
  const [articles, setArticles] = React.useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = React.useState(false);
  const [dbError, setDbError] = React.useState('');

  // Form Mode & Input States
  const [formMode, setFormMode] = React.useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'edit' | 'preview'>('edit');
  const [savingArticle, setSavingArticle] = React.useState(false);

  // Form Fields
  const [title, setTitle] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [category, setCategory] = React.useState('INNOVATION');
  const [image, setImage] = React.useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop');
  const [readTime, setReadTime] = React.useState('5 min read');
  const [authorName, setAuthorName] = React.useState('Dr. Elena Rostova');
  const [authorRole, setAuthorRole] = React.useState('Chief Technology Officer');
  const [authorAvatar, setAuthorAvatar] = React.useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop');
  const [contentText, setContentText] = React.useState('');
  const [tagsInput, setTagsInput] = React.useState('Innovation, R&D, Tech');
  const [status, setStatus] = React.useState<'draft' | 'published' | 'scheduled'>('published');
  const [publishedAt, setPublishedAt] = React.useState('');

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

  React.useEffect(() => {
    if (session) {
      fetchArticles();
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

  // Form Management
  const openAddForm = () => {
    setEditingId(null);
    setTitle('');
    setExcerpt('');
    setCategory('INNOVATION');
    setImage('https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop');
    setReadTime('5 min read');
    setAuthorName('Dr. Elena Rostova');
    setAuthorRole('Chief Technology Officer');
    setAuthorAvatar('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop');
    setContentText('');
    setTagsInput('');
    setStatus('published');

    // Set default published date to current local time
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);
    setPublishedAt(localISOTime);

    setFormMode('add');
    setActiveTab('edit');
  };

  const openEditForm = (article: any) => {
    setEditingId(article.id);
    setTitle(article.title);
    setExcerpt(article.excerpt);
    setCategory(article.category);
    setImage(article.image);
    setReadTime(article.read_time);
    setAuthorName(article.author_name);
    setAuthorRole(article.author_role);
    setAuthorAvatar(article.author_avatar);
    setContentText(article.content.join('\n\n'));
    setTagsInput(article.tags ? article.tags.join(', ') : '');
    setStatus(article.status);

    // Parse timestamp to local datetime-local value
    const dateObj = new Date(article.published_at);
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
    setPublishedAt(localISOTime);

    setFormMode('edit');
    setActiveTab('edit');
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !session) return;
    setSavingArticle(true);
    setDbError('');

    // Pre-process list inputs
    const contentParagraphs = contentText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p !== '');

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    // Format display date: e.g., "Jul 15, 2026"
    const parsedDate = new Date(publishedAt);
    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const displayDate = parsedDate.toLocaleDateString('en-US', dateOptions);

    const articleData = {
      title,
      excerpt,
      category: category.toUpperCase(),
      image,
      read_time: readTime,
      author_name: authorName,
      author_role: authorRole,
      author_avatar: authorAvatar,
      content: contentParagraphs,
      tags: tagsArray,
      status,
      published_at: parsedDate.toISOString(),
      date: displayDate
    };

    try {
      if (formMode === 'add') {
        const { error } = await supabase!
          .from('news')
          .insert([articleData]);
        if (error) throw error;
      } else if (formMode === 'edit' && editingId) {
        const { error } = await supabase!
          .from('news')
          .update(articleData)
          .eq('id', editingId);
        if (error) throw error;
      }

      setFormMode('list');
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

  // Custom Markdown Editor helpers
  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById('news-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    if (syntax === 'bold') {
      replacement = `**${selectedText || 'bold text'}**`;
    } else if (syntax === 'italic') {
      replacement = `*${selectedText || 'italic text'}*`;
    } else if (syntax === 'h2') {
      replacement = `\n## ${selectedText || 'Heading 2'}\n`;
    } else if (syntax === 'h3') {
      replacement = `\n### ${selectedText || 'Heading 3'}\n`;
    } else if (syntax === 'quote') {
      replacement = `\n> ${selectedText || 'Quote text'}\n`;
    } else if (syntax === 'list') {
      replacement = `\n- ${selectedText || 'list item'}\n`;
    } else if (syntax === 'link') {
      replacement = `[${selectedText || 'link text'}](https://example.com)`;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setContentText(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  // Render a paragraph preview based on simple markdown patterns
  const renderParagraphPreview = (paragraph: string, index: number) => {
    if (paragraph.startsWith('## ')) {
      return (
        <h2 key={index} className="text-2xl font-bold text-slate-900 mt-6 mb-3">
          {paragraph.replace('## ', '')}
        </h2>
      );
    }
    if (paragraph.startsWith('### ')) {
      return (
        <h3 key={index} className="text-xl font-bold text-slate-900 mt-4 mb-2">
          {paragraph.replace('### ', '')}
        </h3>
      );
    }
    if (paragraph.startsWith('> ') || paragraph.startsWith('"') || paragraph.startsWith('“')) {
      const cleanText = paragraph.replace(/^>\s*/, '');
      return (
        <blockquote
          key={index}
          className="border-l-4 border-primary pl-6 py-3 my-6 text-lg font-serif italic text-slate-800 leading-relaxed bg-slate-50 rounded-r-xl"
        >
          {cleanText}
        </blockquote>
      );
    }
    if (paragraph.startsWith('- ')) {
      const items = paragraph.split('\n').map((item) => item.replace(/^- /, ''));
      return (
        <ul key={index} className="list-disc pl-6 space-y-1.5 my-4 text-slate-650 text-base">
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      );
    }

    // Apply drop cap styles to the first paragraph
    if (index === 0) {
      const firstChar = paragraph.charAt(0);
      const restOfParagraph = paragraph.slice(1);
      return (
        <p key={index} className="first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-2.5 first-letter:leading-none text-slate-750 text-base leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    }

    return (
      <p key={index} className="text-slate-700 text-base leading-relaxed mb-4">
        {paragraph}
      </p>
    );
  };

  // 1. Check if Supabase configuration is missing
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-slate-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-12 bg-slate-950 border border-white/10 rounded-[32px] text-center space-y-6 shadow-2xl relative overflow-hidden">
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
      <div className="min-h-screen pt-32 pb-24 bg-slate-950 text-white flex items-center justify-center relative overflow-hidden">
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
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
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
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm placeholder:text-slate-650 text-white"
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
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying authorization...
                  </>
                ) : (
                  <>
                    Authorize Access <ArrowLeft className="w-4 h-4 rotate-180" />
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error notification banner if any */}
        {(dbError || loginError) && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl flex items-start gap-2.5 mb-8 shadow-sm">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{dbError || loginError}</span>
          </div>
        )}

        {/* CMS View Switcher */}
        {formMode === 'list' ? (
          /* =========================================================================
             1. ARTICLES DASHBOARD LIST
             ========================================================================= */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                  news Directory
                </h1>
                <p className="text-slate-500 font-semibold text-sm">
                  Create, edit, delete, and view all blog posts, news, and scheduled announcements.
                </p>
              </div>

              <button
                onClick={openAddForm}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer w-full sm:w-auto justify-center"
              >
                <Plus className="w-4.5 h-4.5" /> Create news
              </button>
            </div>

            {/* List Board */}
            {loadingArticles ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Syncing database...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-[32px] p-16 text-center shadow-sm">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-1">No news Available</h3>
                <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto mb-6 leading-relaxed">
                  Your Supabase `news` table is currently empty. Click the button above to add your first article.
                </p>
                <button
                  onClick={openAddForm}
                  className="inline-flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" /> Write First Article
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <th className="py-5 px-8">Cover & Title</th>
                        <th className="py-5 px-6">Category</th>
                        <th className="py-5 px-6">Publish Time</th>
                        <th className="py-5 px-6">Status</th>
                        <th className="py-5 px-8 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                      {articles.map((item) => {
                        const isScheduledFuture = item.status === 'scheduled' && new Date(item.published_at) > new Date();
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-6 px-8 flex items-center gap-4 max-w-md">
                              <img
                                src={item.image}
                                alt=""
                                className="w-14 h-10 rounded-lg object-cover shrink-0 border border-slate-200/80 shadow-sm"
                              />
                              <div className="truncate">
                                <h4 className="font-bold text-slate-900 truncate leading-snug mb-1 hover:text-primary transition-colors cursor-pointer"
                                  onClick={() => openEditForm(item)}>
                                  {item.title}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium truncate">
                                  {item.excerpt}
                                </p>
                              </div>
                            </td>
                            <td className="py-6 px-6">
                              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-650 text-[9px] font-bold uppercase tracking-widest rounded-full border border-slate-200/60">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-6 px-6">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-slate-800 text-xs font-bold">
                                  {new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold font-mono">
                                  {new Date(item.published_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </td>
                            <td className="py-6 px-6">
                              {item.status === 'published' ? (
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-widest rounded-full border border-emerald-200">
                                  Published
                                </span>
                              ) : isScheduledFuture ? (
                                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-widest rounded-full border border-amber-200">
                                  Scheduled
                                </span>
                              ) : item.status === 'scheduled' ? (
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-widest rounded-full border border-emerald-200">
                                  Published (Sch)
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 bg-slate-150 text-slate-500 text-[9px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
                                  Draft
                                </span>
                              )}
                            </td>
                            <td className="py-6 px-8 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => onNavigate('news-details', undefined, item.id)}
                                  title="View Public Link"
                                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200/50"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openEditForm(item)}
                                  title="Edit Article"
                                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 rounded-xl transition-all cursor-pointer border border-transparent"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(item.id)}
                                  title="Delete Article"
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all cursor-pointer border border-transparent"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
             2. CREATE & EDIT FORM VIEW
             ========================================================================= */
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFormMode('list')}
                className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-900 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {formMode === 'add' ? 'Create news' : 'Edit news'}
                </h1>
                <p className="text-slate-500 font-semibold text-sm">
                  Write detailed news articles, load previews, and configure news timestamps.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveArticle} className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Form Settings Panel (Settings & Metadata) */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[32px] p-6 space-y-6 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-tight text-md pb-3 border-b border-slate-100 flex items-center gap-2">
                  <LayoutGrid className="w-4.5 h-4.5 text-primary" /> Settings & Meta
                </h3>

                {/* Status Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Post Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Publish Date/Time selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">
                    {status === 'scheduled' ? 'Scheduled Release Time' : 'news Timestamp'}
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      required
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 cursor-pointer"
                  >
                    <option value="AWARD">Award</option>
                    <option value="EXPANSION">Expansion</option>
                    <option value="INNOVATION">Innovation</option>
                    <option value="SUSTAINABILITY">Sustainability</option>
                    <option value="TECH">Technology</option>
                  </select>
                </div>

                {/* Reading time */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Reading Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 min read"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                  />
                </div>

                {/* Cover Image URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 flex items-center gap-1">
                    <Image className="w-3.5 h-3.5" /> Cover Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                  />
                  {image && (
                    <div className="mt-2 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative">
                      <img src={image} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                    </div>
                  )}
                </div>

                {/* Author Selection */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Author Details</h4>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Full Name</label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Designation</label>
                    <input
                      type="text"
                      required
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Avatar URL</label>
                    <input
                      type="url"
                      required
                      value={authorAvatar}
                      onChange={(e) => setAuthorAvatar(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Right Form Editor Panel (Title, Excerpt, Content) */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Article Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter a compelling title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-black text-slate-900 tracking-tight text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Short Summary / Excerpt</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Write a brief intro/summary of the article shown in listings..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-slate-700 text-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Award, Sustainability, Tech"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-slate-700 text-sm"
                  />
                </div>

                {/* Editor Content Area (With rich preview) */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Content</label>
                    <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200/50">
                      <button
                        type="button"
                        onClick={() => setActiveTab('edit')}
                        className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 ${activeTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        <FileText className="w-3.5 h-3.5" /> Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('preview')}
                        className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 ${activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        <Eye className="w-3.5 h-3.5" /> Live Preview
                      </button>
                    </div>
                  </div>

                  {activeTab === 'edit' ? (
                    <div className="space-y-3">
                      {/* Rich Text Markdown Formatting Toolbar */}
                      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                        <button
                          type="button"
                          onClick={() => insertMarkdown('bold')}
                          title="Bold Text"
                          className="p-2 hover:bg-slate-200 text-slate-650 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('italic')}
                          title="Italic Text"
                          className="p-2 hover:bg-slate-200 text-slate-650 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-slate-200 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertMarkdown('h2')}
                          title="Heading 2"
                          className="p-2 hover:bg-slate-200 text-slate-650 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Heading2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('h3')}
                          title="Heading 3"
                          className="p-2 hover:bg-slate-200 text-slate-650 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Heading3 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-slate-200 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertMarkdown('quote')}
                          title="Blockquote"
                          className="p-2 hover:bg-slate-200 text-slate-650 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Quote className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('list')}
                          title="Bullet List"
                          className="p-2 hover:bg-slate-200 text-slate-650 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('link')}
                          title="Add Link"
                          className="p-2 hover:bg-slate-200 text-slate-650 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                        <span className="ml-auto text-[10px] font-mono text-slate-400 pr-1.5">
                          Press Enter twice for paragraph breaks
                        </span>
                      </div>

                      <textarea
                        required
                        id="news-content-textarea"
                        rows={12}
                        placeholder="Write article paragraphs here. Start a paragraph with > to render it as a blockquote, or ## for headers..."
                        value={contentText}
                        onChange={(e) => setContentText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-slate-700 text-sm resize-y leading-relaxed font-mono"
                      />
                    </div>
                  ) : (
                    /* Live Preview Tab rendering identical typography settings */
                    <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl min-h-[300px] overflow-y-auto max-h-[500px]">
                      {contentText ? (
                        <div className="space-y-4">
                          <div className="border-b border-slate-100 pb-4 mb-6">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8.5px] font-black uppercase rounded border border-primary/20">
                              {category}
                            </span>
                            <h2 className="text-xl font-bold text-slate-900 mt-2">{title || 'Untitled Article'}</h2>
                            <p className="text-slate-400 text-xs mt-1">
                              By {authorName} &bull; {readTime}
                            </p>
                          </div>

                          {contentText.split(/\n\s*\n/).map((p, i) => renderParagraphPreview(p.trim(), i))}
                        </div>
                      ) : (
                        <div className="text-center py-20 text-slate-400 space-y-2">
                          <Eye className="w-10 h-10 mx-auto text-slate-300" />
                          <p className="text-sm font-semibold">Preview container empty</p>
                          <p className="text-xs text-slate-500">Type content in the editor to load dynamic reviews.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Form actions */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-6">
                  <button
                    type="submit"
                    disabled={savingArticle}
                    className="flex-1 bg-slate-900 text-white font-bold py-4.5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg disabled:opacity-85"
                  >
                    {savingArticle ? (
                      <>
                        <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Writing database records...
                      </>
                    ) : (
                      <>
                        Save news <Check className="w-4.5 h-4.5 text-primary-light" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormMode('list')}
                    className="px-6 py-4.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 text-sm font-bold transition-all cursor-pointer border border-slate-200/50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
