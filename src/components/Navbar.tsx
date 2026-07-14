import React from 'react';
import { Menu, X, Drill, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentPage: 'home' | 'about' | 'contact';
  onNavigate: (page: 'home' | 'about' | 'contact', sectionId?: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const [activeSection, setActiveSection] = React.useState<string>('home');

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

  React.useEffect(() => {
    if (currentPage !== 'home') {
      setActiveSection('');
      return;
    }

    const sections = ['products', 'news'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-30% 0px -30% 0px',
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    const handleScroll = () => {
      if (window.scrollY < 150) {
        setActiveSection('home');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);

  const navLinks = [
    { name: 'HOME', page: 'home' },
    { name: 'PRODUCTS', sectionId: 'products' },
    { name: 'NEWS', sectionId: 'news' },
    { name: 'ABOUT US', page: 'about' },
  ];

  const isLinkActive = (link: typeof navLinks[number]) => {
    if (link.page) {
      if (link.page === 'home') {
        return currentPage === 'home' && activeSection === 'home';
      }
      return currentPage === link.page;
    }
    return currentPage === 'home' && activeSection === link.sectionId;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center relative">
            {/* Logo and Brand Title aligned left */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="flex items-center gap-2 z-50"
            >
              <img src="/nct_vertical.png" alt="NCT Logo" className="w-30 h-20 object-contain" />
            </a>

            {/* Desktop Navigation Link Menu (Centered in the viewport) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.page ? `#${link.page}` : `#${link.sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.page) {
                      onNavigate(link.page as 'home' | 'about' | 'contact');
                    } else {
                      onNavigate('home', link.sectionId);
                    }
                  }}
                  className={`text-sm font-semibold transition-colors ${
                    isLinkActive(link)
                      ? 'text-primary font-bold'
                      : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Contact Us CTA pushed to the far right */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="tel:+8801894540055"
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+8801894540055</span>
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contact');
                }}
                className={`inline-block px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg ${currentPage === 'contact'
                  ? 'bg-slate-900 text-white shadow-slate-900/25'
                  : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20 hover:shadow-primary/30'
                  }`}
              >
                CONTACT US
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
                  href={link.page ? `#${link.page}` : `#${link.sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    if (link.page) {
                      onNavigate(link.page as 'home' | 'about' | 'contact');
                    } else {
                      onNavigate('home', link.sectionId);
                    }
                  }}
                  className={`text-3.5xl font-black uppercase tracking-tight transition-colors ${
                    isLinkActive(link)
                      ? 'text-primary-light font-black'
                      : 'text-white hover:text-primary-light'
                  }`}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Action panel at the bottom */}
            <div className="relative z-10 w-full mt-auto space-y-6">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  onNavigate('contact');
                }}
                className={`block text-center w-full py-5 rounded-2xl text-lg font-black tracking-wide transition-all ${currentPage === 'contact'
                  ? 'bg-white text-slate-950 shadow-2xl'
                  : 'bg-primary hover:bg-primary-dark text-white shadow-2xl shadow-primary/30'
                  }`}
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
