import React from 'react';
import { Menu, X, Drill } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Manufacturing', href: '#manufacturing' },
    { name: 'Dealership', href: '#dealership' },
    { name: 'Reselling', href: '#reselling' },
    { name: 'Products', href: '#products' },
    { name: 'News', href: '#news' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center relative">
            {/* Logo and Brand Title aligned left */}
            <a href="#" className="flex items-center gap-2 z-50">
              <img src="/nct_vertical.png" alt="NCT Logo" className="w-20 h-20 object-contain" />
            </a>
            {/* <a href="#" className="flex items-center gap-2 z-50">
              <div className="bg-primary p-2 rounded-lg">
                <Drill className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-black tracking-tighter italic transition-colors ${isOpen ? 'text-white' : 'text-slate-900'}`}>
                NCT
              </span>
            </a> */}

            {/* Desktop Navigation Link Menu (Centered in the viewport) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Contact Us CTA pushed to the far right */}
            <div className="hidden md:block">
              <a
                href="#contact"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/20"
              >
                Contact Us
              </a>
            </div>

            {/* Mobile Menu Toggle Button (Right aligned) */}
            <div className="md:hidden z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors focus:outline-none ${isOpen ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-slate-950 text-white flex flex-col justify-between p-8 pt-32 md:hidden"
          >
            {/* Grid Backdrop Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />

            {/* Centered Navigation Links */}
            <div className="flex flex-col gap-6 relative z-10 my-auto text-center">
              {navLinks.map((link, index) => (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3.5xl font-black uppercase tracking-tight hover:text-primary-light transition-colors text-white"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Action panel at the bottom */}
            <div className="relative z-10 w-full mt-auto space-y-6">
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl text-lg font-black tracking-wide shadow-2xl shadow-primary/30 transition-all"
              >
                Contact Us
              </a>
              <div className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest">
                NCT INDUSTRIAL SERIES // 2026
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
