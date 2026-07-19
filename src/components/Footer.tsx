import React from 'react';
import { Mail, Phone, MapPin, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: 'home' | 'about' | 'contact' | 'news' | 'news-details' | 'cms-panel', sectionId?: string, newsId?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-12 overflow-hidden relative">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-1">
            <div
              onClick={() => onNavigate?.('home')}
              className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-95 transition-opacity inline-flex"
            >
              <img src="/nct_vertical.png" alt="NCT Logo" className="w-32 h-32 object-contain" />
            </div>
            <p className="text-slate-400 leading-relaxed mb-8">
              Precision engineering for global projects. We provide the highest quality power tool accessories
              for professional workers worldwide.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/newcitytradebd" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            {/* <h4 className="text-white font-bold uppercase tracking-widest mb-8 border-l-2 border-primary pl-4">Company</h4> */}
            {/* <ul className="space-y-4 text-slate-400 font-medium">
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('about');
                  }}
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#news"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('news');
                  }}
                  className="hover:text-primary transition-colors"
                >
                  Newsroom
                </a>
              </li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
            </ul> */}
          </div>

          <div>
            {/* <h4 className="text-white font-bold uppercase tracking-widest mb-8 border-l-2 border-primary pl-4">Support</h4> */}
            <ul className="space-y-4 text-slate-400 font-medium">
              {/* <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Become a Dealer</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li> */}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-8 border-l-2 border-primary pl-4">Contact Info</h4>
            <ul className="space-y-6 text-slate-400 font-medium text-sm">
              <li className="flex gap-4">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Head Office/Depot: Snigdha Uposhohor, Bogura-5800, <br />Factory: Jatrabari, Jurain, Dhaka</span>
              </li>
              <li className="flex gap-4">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+8801894540054</span>
              </li>
              <li className="flex gap-4">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>newcityhardware@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Bottom Bar */}
        {/* <div className="bg-white/5 rounded-3xl p-8 md:p-12 mb-24 border border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-2">Subscribe to our Catalog</h3>
              <p className="text-slate-400">Get the latest industry updates and quarterly digital catalogs.</p>
            </div>
            <div className="w-full max-w-md">
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-4 focus:outline-none focus:border-primary transition-colors"
                />
                <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                  Notify Me
                </button>
              </form>
            </div>
          </div>
        </div> */}

        <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-white/10 gap-6">
          <p className="text-slate-500 text-sm font-medium">
            © 2026 NCT (New Trade Center). All Rights Reserved.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
            {/* <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Accessibility</a> */}
            <a
              href="/cms-panel"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('cms-panel');
              }}
              className="hover:text-primary transition-colors text-slate-400 font-extrabold"
            >
              CMS Panel
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
