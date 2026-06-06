import React from 'react';
import { Globe, Users, ArrowRight } from 'lucide-react';

export default function ContactForm() {
  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-3xl lg:text-5xl mb-6 text-slate-900">Let's Build Something <span className="text-primary italic font-serif">Exceptional</span> Together.</h2>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed">
            Whether you're looking for a custom manufacturing partner or interested in joining our global dealership network, our team of experts is ready to assist.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-5">
              <div className="bg-primary/10 p-3 rounded-xl mt-1">
                <Globe className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Global HQ</h4>
                <p className="text-sm text-slate-500 leading-relaxed">500 Industrial Avenue, Suite 1200<br />Chicago, IL 60611, USA</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5">
              <div className="bg-primary/10 p-3 rounded-xl mt-1">
                <Users className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Dealer Relations</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Inquiries: +1 (800) 555-TOOL<br />Email: partners@nct-global.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 lg:p-12 rounded-3xl border border-slate-100">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Company Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  placeholder="Industrial Ltd."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Work Email</label>
              <input 
                type="email" 
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                placeholder="john@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Inquiry Type</label>
              <div className="relative">
                <select className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer">
                  <option>Custom Manufacturing</option>
                  <option>Dealership Application</option>
                  <option>Bulk Order Inquiry</option>
                  <option>Technical Support</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
              <textarea 
                rows={4}
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none"
                placeholder="How can we help your business?"
              ></textarea>
            </div>

            <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group">
              Send Message <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-medium">We typically respond within 24 business hours.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
