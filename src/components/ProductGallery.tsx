import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GALLERY_PRODUCTS = [
  {
    id: 1,
    category: "New Products",
    name: "EXBA18V-80",
    description: "Expert 18V 8 Ah High Power Battery",
    image: "https://images.unsplash.com/photo-1590138221364-c477df529a8e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    category: "New Products",
    name: "GBR18V-15SN18X",
    description: "5 In. 18V Concrete Surface Grinder",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    category: "New Products",
    name: "GFP18V-10N",
    description: "18V Grease Gun",
    image: "https://images.unsplash.com/photo-1530124566582-ab05904f7641?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    category: "Plunge Routers",
    name: "GOF13-25",
    description: "1-3/4 HP Mid-Size Plunge Router",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    category: "Drills & Drivers",
    name: "GSR18V-55",
    description: "Tough System Impact Drill Driver with high torque",
    image: "https://images.unsplash.com/photo-1608613304899-ea8098577e38?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    category: "Metal Work",
    name: "GWS18V-10",
    description: "18V Brushless 4-1/2 In. Angle Grinder",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    category: "New Products",
    name: "GDR18V-200",
    description: "Compact 18V 1/4 In. Hex Impact Driver",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop"
  }
];

export default function ProductGallery() {
  const [pivotIndex, setPivotIndex] = React.useState(0);
  const [imgErrors, setImgErrors] = React.useState<Record<string | number, boolean>>({});

  const prevItem = () => {
    setPivotIndex((prev) => (prev - 1 + GALLERY_PRODUCTS.length) % GALLERY_PRODUCTS.length);
  };

  const nextItem = () => {
    setPivotIndex((prev) => (prev + 1) % GALLERY_PRODUCTS.length);
  };

  // Get visible slice (wrap around for endless sliding)
  const getVisibleProducts = () => {
    const list = [];
    for (let i = 0; i < 4; i++) {
      list.push(GALLERY_PRODUCTS[(pivotIndex + i) % GALLERY_PRODUCTS.length]);
    }
    return list;
  };

  const visibleProducts = getVisibleProducts();

  return (
    <section className="py-20 bg-[#004e82] text-white overflow-hidden relative">
      {/* Subtle Pattern Grid Accent */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Section Header matching the "NEW PRODUCTS" format & font */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-widest uppercase font-sans">
            NEW PRODUCTS
          </h2>
        </div>

        {/* Product Cards Slider Container */}
        <div className="relative mb-12">
          {/* Grid Layout that shows responsive columns in alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {visibleProducts.map((product, idx) => {
              // Determine responsive visibility classes
              let visibilityClass = "block";
              if (idx >= 1) visibilityClass += " hidden sm:block";
              if (idx >= 2) visibilityClass += " sm:hidden md:block";
              if (idx >= 3) visibilityClass += " md:hidden lg:block";

              return (
                <motion.div
                  key={`${product.id}-${pivotIndex}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`${visibilityClass} bg-white text-slate-900 rounded-none shadow-xl border border-slate-100 flex flex-col h-[460px] overflow-hidden relative w-full`}
                >
                  {/* Image container of strict, unyielding fixed height */}
                  <div className="w-full h-[180px] bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden select-none border-b border-slate-100 shrink-0">
                    {!imgErrors[product.id] ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={() => setImgErrors(prev => ({ ...prev, [product.id]: true }))}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-350 gap-2">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata & Text Content Area - flex-grow & structured to justify between */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-slate-500 font-sans text-[11px] mb-1 font-medium select-none">
                        {product.category}
                      </p>
                      <h4 className="text-md sm:text-lg font-extrabold text-[#004e82] tracking-wide mb-2 uppercase truncate" title={product.name}>
                        {product.name}
                      </h4>
                      
                      {/* Divider */}
                      <div className="w-full h-[1px] bg-slate-100 mb-4" />

                      {/* Precise solid square bullet items exactly as requested */}
                      <div className="flex items-start gap-2.5 text-slate-700 text-[13px] leading-relaxed">
                        <span className="w-[8px] h-[8px] bg-[#004e82] mt-1.5 inline-block shrink-0" />
                        <p className="font-sans font-medium line-clamp-3">
                          {product.description}
                        </p>
                      </div>
                    </div>

                   

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Nav Controls & Slider Indicator at the Bottom: "◀ 1/7 ▶" */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={prevItem}
            className="p-2.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer border border-white/10 hover:border-white/30"
            aria-label="Previous Products Set"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-[14px] md:text-[16px] font-mono font-black tracking-widest text-white/95">
            {pivotIndex + 1} / {GALLERY_PRODUCTS.length}
          </span>

          <button
            onClick={nextItem}
            className="p-2.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer border border-white/10 hover:border-white/30"
            aria-label="Next Products Set"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
