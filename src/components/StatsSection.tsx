import React from 'react';
import { motion } from 'motion/react';
import { STATS } from '../constants';

export default function StatsSection() {
  return (
    <section className="py-24 bg-slate-100 border-y border-slate-200 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute left-0 top-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center lg:text-left"
            >
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
                    {stat.value}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {stat.suffix}
                  </span>
                </div>
                <div className="h-1 w-12 bg-primary mb-4 rounded-full" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
