import React from 'react';
import { CATEGORIES } from '../constants';
import { motion } from 'motion/react';

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="text-primary font-mono text-xs font-bold uppercase tracking-widest mb-4">
              Comprehensive Range
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              TAILORED FOR <br />EVERY INDUSTRY.
            </h2>
          </div>
          <div className="text-slate-500 max-w-sm">
            From heavy-duty construction to intricate industrial machining, our accessories are built to exceed standards.
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary transition-all flex flex-col items-center text-center gap-6 shadow-sm hover:shadow-xl hover:shadow-primary/5">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                  {category.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
