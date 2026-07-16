import React from 'react';
import {
  Plus, Eye, Edit2, Trash2, FileText
} from 'lucide-react';

interface NewsListProps {
  articles: any[];
  loadingArticles: boolean;
  onAddNews: () => void;
  onEditNews: (article: any) => void;
  onDeleteNews: (id: string) => void;
  onNavigate: (page: 'home' | 'about' | 'contact' | 'news' | 'news-details' | 'cms-panel', sectionId?: string, newsId?: string) => void;
}

export default function NewsList({
  articles,
  loadingArticles,
  onAddNews,
  onEditNews,
  onDeleteNews,
  onNavigate
}: NewsListProps) {
  return (
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
          onClick={onAddNews}
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
            onClick={onAddNews}
            className="inline-flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
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
                          src={item.image || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=80&auto=format&fit=crop'}
                          alt=""
                          className="w-14 h-10 rounded-lg object-cover shrink-0 border border-slate-200/80 shadow-sm"
                        />
                        <div className="truncate">
                          <h4
                            className="font-bold text-slate-900 truncate leading-snug mb-1 hover:text-primary transition-colors cursor-pointer"
                            onClick={() => onEditNews(item)}
                          >
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium truncate">
                            {item.excerpt}
                          </p>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-655 text-[9px] font-bold uppercase tracking-widest rounded-full border border-slate-200/60">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-850 text-xs font-bold">
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
                            onClick={() => onEditNews(item)}
                            title="Edit Article"
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 rounded-xl transition-all cursor-pointer border border-transparent"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteNews(item.id)}
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
  );
}
