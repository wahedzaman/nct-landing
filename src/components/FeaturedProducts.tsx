import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PRODUCTS_DATA = [
  {
    id: '1',
    name: 'EXBA18V-80',
    title: 'EXBA18V-80',
    category: 'New Products',
    image: 'https://images.unsplash.com/photo-1590138221364-c477df529a8e?q=80&w=800&auto=format&fit=crop', // battery pack
    bullets: [
      'High-power tabless cell technology – provides lower inner resistance for reduced battery heating, increased power, longer runtime and optimized performance',
      'Outstanding power and runtime – deliver up to 140% more instantaneous maximum power* and up to 120% more runtime** than the core18v® 4 ah battery (gba18v40)',
      'Bosch-exclusive coolpack™ 2.0 technology – cools the battery and helps provide longer lifetime compared to non-coolpack™ bosch 18v batteries'
    ]
  },
  {
    id: '2',
    name: 'GKE18V-20N',
    title: 'GKE18V-20N',
    category: 'New Products',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop', // saw
    bullets: [
      'Efficient brushless motor – provides an equivalent of 700w of corded power for fast, clean cuts',
      'Lightweight, ergonomic design – with slim, soft grip for enhanced comfort and reduced fatigue',
      'Robust design – with maintenance-free components for durable use'
    ]
  },
  {
    id: '3',
    name: 'GSC18V-16EN',
    title: 'GSC18V-16EN',
    category: 'New Products',
    image: 'https://images.unsplash.com/photo-1530124566582-ab05904f7641?q=80&w=800&auto=format&fit=crop', // tool / bits
    bullets: [
      'Efficient brushless motor – provides an equivalent of 700w of corded power for fast, clean cuts',
      'Lightweight, ergonomic design – with slim, soft grip for enhanced comfort and reduced fatigue',
      'Robust design – with maintenance-free components for durable use'
    ]
  }
];

export default function FeaturedProducts() {
  const [activeId, setActiveId] = React.useState('3'); // GSC18V-16EN selected by default as in new screenshot
  const activeProduct = PRODUCTS_DATA.find((item) => item.id === activeId) || PRODUCTS_DATA[2];

  return (
    <section id="products" className="py-0 bg-white relative z-10 overflow-hidden">
      {/* Blue Full-width Ribbon Header exactly as shown in screenshot */}
      <div className="w-full bg-[#004e82] text-center py-7 mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-[2.25rem] font-extrabold text-white tracking-widest uppercase font-sans">
          FEATURED PRODUCTS
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Vertical sharp stack selector */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none shrink-0 z-10">
            {PRODUCTS_DATA.map((product) => {
              const isActive = product.id === activeId;
              return (
                <button
                  key={product.id}
                  onClick={() => setActiveId(product.id)}
                  className={`flex-1 min-w-[110px] md:min-w-[130px] lg:min-w-0 lg:w-full text-center p-3 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#004e82] text-white shadow-md'
                      : 'bg-[#f0f2f5] hover:bg-[#e2e5e9]'
                  }`}
                >
                  {/* Thumbnail Image Container */}
                  <div className="aspect-square bg-transparent overflow-hidden mb-2 flex items-center justify-center p-1 max-h-16 md:max-h-20 mx-auto">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Model tag under image */}
                  <span className={`text-[10px] md:text-[11px] font-extrabold tracking-wider block uppercase ${
                    isActive ? 'text-white' : 'text-[#004e82]'
                  }`}>
                    {product.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* MIDDLE: Clean white display cutout */}
          <div className="lg:col-span-6 flex justify-center items-center min-h-[300px] md:min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-full flex justify-center"
              >
                <div className="p-4 bg-white max-w-sm">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="w-full h-auto aspect-square object-cover mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Selected Product specifications exactly as in the screenshot */}
          <div className="lg:col-span-4 self-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="text-left"
              >
                {/* Clean blue-shaded category text */}
                <p className="text-[#004e82] font-semibold text-sm mb-2">
                  {activeProduct.category}
                </p>

                {/* Big Bold model title */}
                <h3 className="text-3xl md:text-[2.5rem] font-extrabold text-[#004e82] tracking-tight leading-none mb-8">
                  {activeProduct.title}
                </h3>

                {/* Unordered description list with precise square bullets */}
                <ul className="space-y-5 mb-10 text-slate-800 text-[14px]">
                  {activeProduct.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start">
                      {/* Premium real solid black square identifier */}
                      <span className="w-[10px] h-[10px] bg-black mt-1.5 mr-3 inline-block shrink-0" />
                      <span className="leading-relaxed font-sans font-medium text-[13.5px]">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Block matching exact CTA Button */}
                <button
                  onClick={() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#004e82] hover:bg-[#003c66] text-white px-7 py-3 transition-colors text-[13px] font-bold uppercase tracking-wider relative cursor-pointer"
                >
                  Product details
                </button>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

