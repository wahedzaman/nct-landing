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

export default function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <CategoriesSection />
        
        <PillarsSection />
        
        <StatsSection />
        
        <FeaturedProducts />
        
        <ProductGallery />
        
        {/* Brand/Trust Section */}
        <section className="py-20 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {['BOSCH', 'DEWALT', 'MAKITA', 'MILWAUKEE', 'HILTI', 'RYOBI'].map((brand) => (
                <span key={brand} className="text-2xl md:text-3xl font-black tracking-tighter text-slate-400 hover:text-slate-900 cursor-default">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        <NewsSection />

        <ContactForm />
        
        {/* Call to Action Section */}
        <section className="py-24 bg-primary relative overflow-hidden">
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
              <button className="bg-white text-primary hover:bg-slate-100 px-10 py-5 rounded-2xl font-black transition-all shadow-2xl shadow-black/20 text-lg">
                Request a Quote
              </button>
              <button className="bg-primary-dark/40 backdrop-blur-md text-white border-2 border-white/20 hover:bg-primary-dark/60 px-10 py-5 rounded-2xl font-black transition-all text-lg">
                Talk to an Expert
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
