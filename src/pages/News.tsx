import React from 'react';
import { NEWS_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Search, ArrowRight, BookOpen } from 'lucide-react';
import { NewsItem } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

interface NewsProps {
  onNavigate: (page: 'home' | 'about' | 'contact' | 'news' | 'news-details' | 'cms-panel', sectionId?: string, newsId?: string) => void;
}

export default function News({ onNavigate }: NewsProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('ALL');
  const [dbItems, setDbItems] = React.useState<NewsItem[]>(NEWS_ITEMS);
  const [loading, setLoading] = React.useState(false);

  const categories = ['ALL', 'AWARD', 'EXPANSION', 'INNOVATION', 'SUSTAINABILITY', 'TECH'];

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase!
          .from('news')
          .select('*')
          .or('status.eq.published,status.eq.scheduled')
          .order('published_at', { ascending: false });

        if (error) throw error;
        if (data) {
          const activeArticles = data
            .filter((item: any) => {
              if (item.status === 'published') return true;
              if (item.status === 'scheduled') {
                return new Date(item.published_at) <= new Date();
              }
              return false;
            })
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

          if (activeArticles.length > 0) {
            setDbItems(activeArticles);
          }
        }
      } catch (err) {
        console.error('Error fetching news from Supabase, using mock fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredItems = dbItems.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredItem = filteredItems.length > 0 ? filteredItems[0] : null;
  const regularItems = filteredItems.length > 1 ? filteredItems.slice(1) : [];

  return (
    <div className="pt-20 bg-white">
      {/* Hero Banner Section */}
      <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden text-white">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-6 border border-primary/20">
              NTC PUBLICATIONS
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
              Newsroom & <span className="text-primary-light">Insights</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              Explore our latest milestones, technological breakthroughs, industry trends, and global dealership announcements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Category Filter Panel */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-16 border-b border-slate-100 pb-10">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Dynamic List / Grid layout */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading Publications...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-slate-50 border border-slate-200/50 rounded-[32px] max-w-xl mx-auto px-6"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Found</h3>
            <p className="text-slate-500 text-sm font-semibold leading-relaxed">
              We couldn't find any articles matching your search criteria. Try selecting a different category or clearing the search box.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-16">
            {/* Featured Post Card (Only show if we have filtered items and search is not actively showing filtered result subsets where it doesn't make sense) */}
            {featuredItem && !searchQuery && selectedCategory === 'ALL' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group"
              >
                <div className="grid lg:grid-cols-12 gap-0">
                  {/* Image container */}
                  <div className="lg:col-span-7 h-72 lg:h-[480px] overflow-hidden relative">
                    <img
                      src={featuredItem.image}
                      alt={featuredItem.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                    <span className="absolute top-6 left-6 px-4 py-1.5 bg-slate-900/90 text-primary-light text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10 backdrop-blur-md">
                      Featured Publication
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      {/* Meta */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
                          {featuredItem.category}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          {featuredItem.date}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          {featuredItem.readTime}
                        </div>
                      </div>

                      {/* Title */}
                      <h2
                        onClick={() => onNavigate('news-details', undefined, featuredItem.id)}
                        className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-tight tracking-tight hover:text-primary transition-colors cursor-pointer"
                      >
                        {featuredItem.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-slate-650 text-sm lg:text-base leading-relaxed font-medium mb-8">
                        {featuredItem.excerpt}
                      </p>
                    </div>

                    {/* Author & Action */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={featuredItem.author.avatar}
                          alt={featuredItem.author.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">
                            {featuredItem.author.name}
                          </h4>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            {featuredItem.author.role}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('news-details', undefined, featuredItem.id)}
                        className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-3 transition-all cursor-pointer group-hover:text-primary"
                      >
                        Read Article
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Standard Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {(searchQuery || selectedCategory !== 'ALL' ? filteredItems : regularItems).map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col justify-between h-full"
                  >
                    <div>
                      {/* Image */}
                      <div className="h-56 overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 to-transparent" />
                      </div>

                      {/* Content Body */}
                      <div className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                            <Clock className="w-3 h-3" />
                            {item.readTime}
                          </div>
                        </div>

                        <h3
                          onClick={() => onNavigate('news-details', undefined, item.id)}
                          className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors cursor-pointer"
                        >
                          {item.title}
                        </h3>

                        <p className="text-slate-500 text-xs leading-relaxed font-semibold line-clamp-3 mb-6">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-8 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 pt-4">
                        <img
                          src={item.author.avatar}
                          alt={item.author.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-none mb-0.5">
                            {item.author.name}
                          </h4>
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                            {item.author.role}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('news-details', undefined, item.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:gap-2.5 transition-all cursor-pointer group-hover:text-primary pt-4"
                      >
                        Read Publication
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
