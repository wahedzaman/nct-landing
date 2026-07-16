import React from 'react';
import { NEWS_ITEMS } from '../constants';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, FileText } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { NewsItem } from '../types';

interface NewsSectionProps {
  onNavigate: (page: 'home' | 'about' | 'contact' | 'news' | 'news-details' | 'cms-panel', sectionId?: string, newsId?: string) => void;
}

export default function NewsSection({ onNavigate }: NewsSectionProps) {
  const [items, setItems] = React.useState<NewsItem[]>(isSupabaseConfigured ? [] : NEWS_ITEMS.slice(0, 3));
  const [loading, setLoading] = React.useState(isSupabaseConfigured);

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchLatestNews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase!
          .from('news')
          .select('*')
          .or('status.eq.published,status.eq.scheduled')
          .order('published_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Filter out future scheduled items in memory
          const activeArticles = data
            .filter((item: any) => {
              if (item.status === 'published') return true;
              if (item.status === 'scheduled') {
                return new Date(item.published_at) <= new Date();
              }
              return false;
            })
            .slice(0, 3)
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

          setItems(activeArticles);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Error fetching news from Supabase, using mock fallback:', err);
        setItems(NEWS_ITEMS.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <section id="news" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="text-primary font-mono text-xs font-bold uppercase tracking-widest mb-4">
              STAY UPDATED
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              LATEST NEWS & <br />BLOGS
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer text-slate-800 shrink-0 w-fit"
          >
            View All News <ArrowRight className="w-4 h-4 text-primary" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-slate-250 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading latest posts...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[32px] p-12 text-center shadow-sm max-w-xl mx-auto">
            <FileText className="w-12 h-12 text-slate-350 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-1">No news available</h3>
            <p className="text-slate-500 text-sm font-semibold leading-relaxed">
              Stay tuned! We'll be posting news, updates, and technical breakthroughs soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onNavigate('news-details', undefined, item.id)}
                className="bg-white p-10 rounded-[32px] border border-slate-200 hover:shadow-2xl hover:shadow-primary/5 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-655 mb-8 leading-relaxed line-clamp-3 font-medium text-sm">
                    {item.excerpt}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('news-details', undefined, item.id);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-4 transition-all cursor-pointer"
                >
                  Read Publication
                  <ArrowRight className="w-4 h-4 text-primary" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
