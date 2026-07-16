import React from 'react';
import { motion } from 'motion/react';
import ContactForm from '../components/ContactForm';

export default function ContactUs() {
  return (
    <div className="pt-20 bg-white">
      {/* Hero Banner Section */}
      <section className="relative py-24 bg-slate-950 overflow-hidden text-white border-b border-slate-900">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-6 border border-primary/20">
              CONTACT US
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
              Connect With <span className="text-primary-light">Our Global Team</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Have a bulk order, custom OEM inquiry, or technical question? Reach out to your local regional office below or fill out the inquiry form.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Extracted Contact Form (Directory + Message Form) */}
      <ContactForm />
    </div>
  );
}
