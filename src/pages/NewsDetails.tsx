import React from 'react';
import { NEWS_ITEMS } from '../constants';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Mail, Link2, Check, ArrowRight, Award } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { NewsItem } from '../types';

interface NewsDetailsProps {
  newsId: string | null;
  onNavigate: (page: 'home' | 'about' | 'contact' | 'news' | 'news-details' | 'cms-panel', sectionId?: string, newsId?: string) => void;
}

export default function NewsDetails({ newsId, onNavigate }: NewsDetailsProps) {
  const [article, setArticle] = React.useState<NewsItem | null>(null);
  const [relatedArticles, setRelatedArticles] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!isSupabaseConfigured) {
      const mockArticle = NEWS_ITEMS.find((item) => item.id === newsId);
      if (mockArticle) {
        setArticle(mockArticle);
        setRelatedArticles(NEWS_ITEMS.filter((item) => item.id !== newsId).slice(0, 2));
      } else {
        setArticle(null);
      }
      setLoading(false);
      return;
    }

    const fetchArticleDetails = async () => {
      if (!newsId) {
        setArticle(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase!
          .from('news')
          .select('*')
          .eq('id', newsId)
          .single();

        if (error) throw error;

        if (data) {
          const mapped = {
            id: data.id,
            date: data.date,
            category: data.category,
            title: data.title,
            excerpt: data.excerpt,
            image: data.image,
            readTime: data.read_time,
            author: {
              name: data.author_name,
              role: data.author_role,
              avatar: data.author_avatar
            },
            content: data.content,
            tags: data.tags
          };
          setArticle(mapped);

          // Fetch related articles
          const { data: relatedData, error: relatedError } = await supabase!
            .from('news')
            .select('*')
            .or('status.eq.published,status.eq.scheduled')
            .neq('id', newsId)
            .limit(4);

          if (!relatedError && relatedData) {
            const activeRelated = relatedData
              .filter((item: any) => {
                if (item.status === 'published') return true;
                if (item.status === 'scheduled') {
                  return new Date(item.published_at) <= new Date();
                }
                return false;
              })
              .slice(0, 2)
              .map((item: any) => ({
                id: item.id,
                date: item.date,
                category: item.category,
                title: item.title,
                excerpt: item.excerpt,
                image: item.image,
                readTime: item.read_time,
                author: {
                  name: item.author_name,
                  role: item.author_role,
                  avatar: item.author_avatar
                },
                content: item.content,
                tags: item.tags
              }));
            setRelatedArticles(activeRelated);
          } else {
            // fallback for related
            setRelatedArticles(NEWS_ITEMS.filter((item) => item.id !== newsId).slice(0, 2));
          }
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error('Error fetching article details, using mock fallback:', err);
        const mockArticle = NEWS_ITEMS.find((item) => item.id === newsId);
        if (mockArticle) {
          setArticle(mockArticle);
          setRelatedArticles(NEWS_ITEMS.filter((item) => item.id !== newsId).slice(0, 2));
        } else {
          setArticle(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [newsId]);


  // Helper to determine if a paragraph is a blockquote (starts with a quote character)
  const isParagraphQuote = (text: string) => {
    return text.startsWith('"') || text.startsWith('“') || text.startsWith('>') || text.startsWith('`');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto animate-pulse" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest font-mono">Loading publication...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto px-4 py-16 bg-slate-50 border border-slate-200/60 rounded-[32px]">
          <Award className="w-12 h-12 text-slate-350 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Article Not Found</h2>
          <p className="text-slate-550 text-sm font-semibold mb-8">
            The publication you are looking for does not exist or has been archived.
          </p>
          <button
            onClick={() => onNavigate('news')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Newsroom
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-white">
      {/* Article Detail Container */}
      <article className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="mb-10">
          <button
            onClick={() => onNavigate('news')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-all group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Newsroom
          </button>
        </div>

        {/* Article Meta & Title Header */}
        <div className="max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Calendar className="w-4 h-4" />
              {article.date}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.05] uppercase mb-8">
            {article.title}
          </h1>

          {/* Author Card Row */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
            />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-0.5">Written By</p>
              <h4 className="text-base font-black text-slate-900 leading-none">
                {article.author.name}
              </h4>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {article.author.role}
              </p>
            </div>
          </div>
        </div>

        {/* Large Cover Hero Image */}
        <div className="w-full h-64 md:h-[450px] lg:h-[550px] rounded-[32px] md:rounded-[48px] overflow-hidden border border-slate-200 shadow-2xl mb-16 relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
        </div>

        {/* Reading Layout (Sidebar & Main content) */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Share Options & Tags (Desktop sticky) */}
          <div className="lg:col-span-3 lg:sticky lg:top-28 space-y-8 order-2 lg:order-1 border-t lg:border-t-0 border-slate-150 pt-8 lg:pt-0">
            {/* Share Panel */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-slate-400" /> Share Publication
              </h4>
              <div className="flex lg:flex-col gap-3">
                {/* Facebook Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 bg-slate-50 hover:bg-primary/5 hover:text-primary border border-slate-200/60 hover:border-primary/20 rounded-2xl text-xs font-bold text-slate-700 transition-all flex-1 lg:flex-none cursor-pointer"
                >
                  <Facebook className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline lg:inline">Share on Facebook</span>
                </a>

                {/* Email Share */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`Check out this publication from NCT: ${window.location.href}`)}`}
                  className="flex items-center justify-center lg:justify-start gap-2.5 px-4 py-3 bg-slate-50 hover:bg-primary/5 hover:text-primary border border-slate-200/60 hover:border-primary/20 rounded-2xl text-xs font-bold text-slate-700 transition-all flex-1 lg:flex-none cursor-pointer"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline lg:inline">Share via Email</span>
                </a>


              </div>
            </div>

            {/* Tags section */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 hidden lg:block">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                  Tags & Topics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-650 text-[10px] font-bold uppercase rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Right Column: Main body typography */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <div className="prose max-w-none text-slate-700 font-medium text-base leading-relaxed md:text-lg space-y-6">
              {(() => {
                // Find index of the first text paragraph (no heading, no image, no list)
                const firstTextIdx = article.content.findIndex(
                  (p) => !p.startsWith('##') && !p.startsWith('###') && !p.startsWith('![') && !p.startsWith('- ')
                );

                return article.content.map((paragraph, index) => {
                  // 1. Check if matches image: ![alt](url)
                  const imgRegex = /^!\[(.*?)\]\((.*?)\)$/;
                  const match = paragraph.match(imgRegex);
                  if (match) {
                    const alt = match[1];
                    const url = match[2];
                    return (
                      <div key={index} className="my-8 rounded-[24px] overflow-hidden border border-slate-200 shadow-xl max-w-4xl mx-auto">
                        <img src={url} alt={alt} className="w-full h-auto object-cover max-h-[500px]" />
                        {alt && (
                          <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 text-center text-xs font-semibold text-slate-500">
                            {alt}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // 2. Check if heading 2
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl md:text-3xl font-black text-slate-900 mt-10 mb-4 uppercase tracking-tight">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }

                  // 3. Check if heading 3
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl md:text-2xl font-bold text-slate-900 mt-8 mb-3 uppercase tracking-tight">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }

                  // 4. Check if quote
                  if (paragraph.startsWith('> ') || paragraph.startsWith('"') || paragraph.startsWith('“')) {
                    const cleanText = paragraph.replace(/^>\s*/, '');
                    return (
                      <blockquote
                        key={index}
                        className="border-l-4 border-primary pl-6 py-4 my-8 text-xl font-serif italic text-slate-900 leading-relaxed font-bold bg-slate-50 rounded-r-2xl pr-6 border-y border-r border-slate-200/40 shadow-sm"
                      >
                        {cleanText}
                      </blockquote>
                    );
                  }

                  // 5. Check if list
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').map((item) => item.replace(/^- /, ''));
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 my-6 text-slate-700 text-base leading-relaxed">
                        {items.map((it, i) => <li key={i} className="pl-1">{it}</li>)}
                      </ul>
                    );
                  }

                  // 6. Regular paragraph (apply drop cap to first text paragraph)
                  if (index === firstTextIdx) {
                    const firstChar = paragraph.charAt(0);
                    const restOfParagraph = paragraph.slice(1);
                    return (
                      <p key={index} className="first-letter:float-left first-letter:text-6xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:mt-1 first-letter:leading-none text-slate-700 font-medium text-base leading-relaxed md:text-lg mb-6">
                        {paragraph}
                      </p>
                    );
                  }

                  return (
                    <p key={index} className="text-slate-700 font-medium text-base leading-relaxed md:text-lg mb-6">
                      {paragraph}
                    </p>
                  );
                });
              })()}
            </div>
            {/* Mobile-only Tags block */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-8 mt-12 border-t border-slate-100 block lg:hidden">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-650 text-[10px] font-bold uppercase rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Recommended Reading Section */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary font-mono text-xs font-bold uppercase tracking-widest mb-3">
                MORE TO READ
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Related Publications
              </h2>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-sm font-bold text-slate-900 hover:text-primary transition-colors flex items-center gap-1 hover:gap-2 cursor-pointer"
            >
              All Articles <ArrowRight className="w-4 h-4 text-primary" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticles.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </div>
                    </div>
                    <h3
                      onClick={() => onNavigate('news-details', undefined, item.id)}
                      className="text-lg md:text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </div>
                <div className="p-8 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 pt-4">
                    <img
                      src={item.author.avatar}
                      alt={item.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-900 leading-none">
                        {item.author.name}
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('news-details', undefined, item.id)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-primary transition-all cursor-pointer pt-4"
                  >
                    Read <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
