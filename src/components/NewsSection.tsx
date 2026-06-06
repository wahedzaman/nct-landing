import React from 'react';
import { NEWS_ITEMS } from '../constants';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';

export default function NewsSection() {
  return (
    <section id="news" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="text-primary font-mono text-xs font-bold uppercase tracking-widest mb-4">
              Corporate Ledger
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              LATEST NEWS & <br />PUBLICATIONS.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {NEWS_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-10 rounded-[32px] border border-slate-200 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
            >
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
              <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3">
                {item.excerpt}
              </p>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-4 transition-all">
                Read Publication
                <ArrowRight className="w-4 h-4 text-primary" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
