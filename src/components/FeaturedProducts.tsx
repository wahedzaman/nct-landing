import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const PRODUCTS_DATA = [
  {
    id: '1',
    name: 'EXBA18V-80',
    title: 'EXBA18V-80',
    category: 'New Products',
    image: 'https://images.unsplash.com/photo-1590138221364-c477df529a8e?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1530124566582-ab05904f7641?q=80&w=800&auto=format&fit=crop',
    bullets: [
      'Efficient brushless motor – provides an equivalent of 700w of corded power for fast, clean cuts',
      'Lightweight, ergonomic design – with slim, soft grip for enhanced comfort and reduced fatigue',
      'Robust design – with maintenance-free components for durable use'
    ]
  }
];

export default function FeaturedProducts() {
  const [products, setProducts] = React.useState<any[]>(isSupabaseConfigured ? [] : PRODUCTS_DATA);
  const [loading, setLoading] = React.useState(isSupabaseConfigured);
  const [activeId, setActiveId] = React.useState('3');

  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      setProducts(PRODUCTS_DATA);
      setActiveId('3');
      setLoading(false);
      return;
    }

    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase!
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data);
          setActiveId(data[0].id);
        } else {
          setProducts(PRODUCTS_DATA);
          setActiveId('3');
        }
      } catch (err) {
        console.error('Failed to fetch featured products, falling back:', err);
        setProducts(PRODUCTS_DATA);
        setActiveId('3');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const activeProduct = products.find((item) => item.id === activeId) || products[0] || PRODUCTS_DATA[2];

  const activeTitle = activeProduct.title || activeProduct.name;
  const activeBullets = activeProduct.features || activeProduct.bullets || [];

  return (
    <section id="products" className="py-0 bg-white relative z-10 overflow-hidden">
      {/* Ribbon Header */}
      <div className="w-full bg-[#2FA353] text-center py-7 mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-[2.25rem] font-extrabold text-white tracking-widest uppercase font-sans">
          FEATURED PRODUCTS
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-3 border-slate-200/60 border-t-[#2FA353] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Syncing Featured Catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-semibold text-sm">
            No active featured products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: Vertical sharp stack selector */}
            <div className="lg:col-span-2 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none shrink-0 z-10">
              {products.map((product) => {
                const isActive = product.id === activeId;
                const titleStr = product.title || product.name;
                return (
                  <button
                    key={product.id}
                    onClick={() => setActiveId(product.id)}
                    className={`flex-1 min-w-[110px] md:min-w-[130px] lg:min-w-0 lg:w-full text-center p-3 transition-all duration-300 cursor-pointer ${isActive
                      ? 'bg-[#2FA353] text-white shadow-md'
                      : 'bg-[#f0f2f5] hover:bg-[#e2e5e9]'
                      }`}
                  >
                    {/* Thumbnail Image Container */}
                    <div className="aspect-square bg-transparent overflow-hidden mb-2 flex items-center justify-center p-1 max-h-16 md:max-h-20 mx-auto">
                      <img
                        src={product.image}
                        alt={titleStr}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Model tag under image */}
                    <span
                      className={`text-[10px] md:text-[11px] font-extrabold tracking-wider block uppercase truncate ${isActive ? 'text-white' : 'text-[#004e82]'
                        }`}
                    >
                      {titleStr}
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
                  className="w-full flex justify-center animate-duration-300"
                >
                  <div className="p-4 bg-white max-w-sm">
                    <img
                      src={activeProduct.image}
                      alt={activeTitle}
                      className="w-full h-auto aspect-square object-contain mix-blend-multiply select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT: Selected Product specifications */}
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
                  {/* Clean category text */}
                  <p className="text-[#2FA353] font-semibold text-sm mb-2">
                    {activeProduct.category}
                  </p>

                  {/* Big Bold model title */}
                  <h3 className="text-3xl md:text-[2.5rem] font-extrabold text-[#2FA353] tracking-tight leading-none mb-8 uppercase">
                    {activeTitle}
                  </h3>

                  {/* Unordered description list */}
                  <ul className="space-y-5 mb-10 text-slate-800 text-[14px]">
                    {activeBullets.map((bullet: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-[10px] h-[10px] bg-black mt-1.5 mr-3 inline-block shrink-0" />
                        <span className="leading-relaxed font-sans font-medium text-[13.5px]">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
