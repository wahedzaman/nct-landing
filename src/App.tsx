/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoriesSection from './components/CategoriesSection';
import PillarsSection from './components/PillarsSection';
import StatsSection from './components/StatsSection';
import FeaturedProducts from './components/FeaturedProducts';
import ProductGallery from './components/ProductGallery';
import NewsSection from './components/NewsSection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import CmsPanel from './pages/CmsPanel';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<'home' | 'about' | 'contact' | 'news' | 'news-details' | 'cms-panel'>('home');
  const [selectedNewsId, setSelectedNewsId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.endsWith('/cms-panel')) {
      setCurrentPage('cms-panel');
    }
  }, []);

  const handleNavigate = (
    page: 'home' | 'about' | 'contact' | 'news' | 'news-details' | 'cms-panel',
    sectionId?: string,
    newsId?: string
  ) => {
    setCurrentPage(page);
    if (newsId) {
      setSelectedNewsId(newsId);
    }
    if (page === 'cms-panel') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/cms-panel');
      return;
    }
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `#${sectionId}`);
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <ContactUs />;
      case 'news':
        return <News onNavigate={handleNavigate} />;
      case 'news-details':
        return <NewsDetails newsId={selectedNewsId} onNavigate={handleNavigate} />;
      case 'cms-panel':
        return <CmsPanel onNavigate={handleNavigate} />;
      case 'home':
      default:
        return (
          <>
            <Hero />

            <CategoriesSection />

            <PillarsSection />

            <StatsSection />

            <FeaturedProducts />

            <ProductGallery />

            {/* Brand/Trust Section */}
            {/* <section className="py-20 bg-white border-y border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                  {['BOSCH', 'DEWALT', 'MAKITA', 'MILWAUKEE', 'HILTI', 'RYOBI'].map((brand) => (
                    <span key={brand} className="text-2xl md:text-3xl font-black tracking-tighter text-slate-400 hover:text-slate-900 cursor-default">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </section> */}

            <NewsSection onNavigate={handleNavigate} />

            <ContactForm />

            {/* Call to Action Section */}
            {/* <section className="py-24 bg-primary relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 uppercase">
                  Ready to Upgrade Your <br />Industrial Workflow?
                </h2>
                <p className="text-white/80 text-xl font-medium mb-12 max-w-2xl mx-auto">
                  Partner with NTC for high-precision components that drive global projects forward.
                  Our experts are ready to assist with custom manufacturing and bulk orders.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => handleNavigate('contact')}
                    className="bg-white text-primary hover:bg-slate-100 px-10 py-5 rounded-2xl font-black transition-all shadow-2xl shadow-black/20 text-lg cursor-pointer animate-pulse hover:animate-none"
                  >
                    Request a Quote
                  </button>
                  <button
                    onClick={() => handleNavigate('contact')}
                    className="bg-primary-dark/40 backdrop-blur-md text-white border-2 border-white/20 hover:bg-primary-dark/60 px-10 py-5 rounded-2xl font-black transition-all text-lg cursor-pointer"
                  >
                    Talk to an Expert
                  </button>
                </div>
              </div>
            </section> */}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main>
        {renderContent()}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
