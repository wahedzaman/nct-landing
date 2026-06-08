import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShieldCheck, Factory, Globe } from 'lucide-react';

const SLIDES = [
  {
    image: 'hero/hero1.png', // worker using professional heavy duty tool
    badge: 'SAFETY STARTS HERE',
    title: 'SAFETY STARTS HERE',
    description: 'NCT power tool accessories and diagnostic gear are engineered for heavy duty industrial safety and supreme reliability.',
    ctaText: 'Learn More',
    ctaLink: '#contact'
  },
  {
    image: 'hero/hero2.png', // professional automated factory floor
    badge: 'PRECISION ENGINEERING',
    title: 'ACCURATE TO THE MICRON',
    description: 'ISO 9001:2015 certified indigenous manufacturing lines optimized for custom tool accessories and high durability standards.',
    ctaText: 'Our Facilities',
    ctaLink: '#pillars'
  },
  {
    image: 'hero/hero3.png', // high precision carbide circular blades/gear
    badge: 'AUTHORIZED DEALERSHIP',
    title: 'TRUSTED BY ENTERPRISES',
    description: 'Connecting global brand catalogs list with local dealerships and priority project procurement programs.',
    ctaText: 'Shop Catalog',
    ctaLink: '#products'
  }
  //  {
  //   image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop', // worker using professional heavy duty tool
  //   badge: 'SAFETY STARTS HERE',
  //   title: 'SAFETY STARTS HERE',
  //   description: 'NCT power tool accessories and diagnostic gear are engineered for heavy duty industrial safety and supreme reliability.',
  //   ctaText: 'Learn More',
  //   ctaLink: '#contact'
  // },
  // {
  //   image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop', // professional automated factory floor
  //   badge: 'PRECISION ENGINEERING',
  //   title: 'ACCURATE TO THE MICRON',
  //   description: 'ISO 9001:2015 certified indigenous manufacturing lines optimized for custom tool accessories and high durability standards.',
  //   ctaText: 'Our Facilities',
  //   ctaLink: '#pillars'
  // },
  // {
  //   image: 'https://images.unsplash.com/photo-1530124566582-ab05904f7641?q=80&w=2070&auto=format&fit=crop', // high precision carbide circular blades/gear
  //   badge: 'AUTHORIZED DEALERSHIP',
  //   title: 'TRUSTED BY ENTERPRISES',
  //   description: 'Connecting global brand catalogs list with local dealerships and priority project procurement programs.',
  //   ctaText: 'Shop Catalog',
  //   ctaLink: '#products'
  // }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0); // -1 for left, 1 for right

  const nextSlide = React.useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = React.useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance
  React.useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const activeSlide = SLIDES[currentIndex];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-950">
      {/* Slider Slide Background with Fade/Slide Animations */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-slate-950/50 z-10" />
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav Arrows positioned matching premium tool aesthetic */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer backdrop-blur-sm border border-white/5"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer backdrop-blur-sm border border-white/5"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Hero Content Container aligned to left */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="flex justify-start items-center min-h-[75vh]">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative p-6 md:p-10 rounded-2xl bg-slate-950/95 border border-white/10 shadow-2xl max-w-lg w-full text-left"
          >
            {/* Opaque Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-6 border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              {activeSlide.badge}
            </div>

            {/* Resized neat Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4 uppercase">
              {activeSlide.title}
            </h1>

            {/* Subtext description */}
            <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6 font-medium">
              {activeSlide.description}
            </p>

            {/* CTA action button inside the card */}
            <div className="mb-8">
              <a
                href={activeSlide.ctaLink}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-lg shadow-primary/20"
              >
                {activeSlide.ctaText}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Micro Stats inside the compact opaque box */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-primary-light border border-white/10 shrink-0">
                  <Factory className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-white tracking-tight">125k+ Sq. Ft</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Facility</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-primary-light border border-white/10 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-white tracking-tight">500+ Dealers</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators/Bullets at the Bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-primary w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Subtle Bottom Accent Strip */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/50 to-primary" />
    </section>
  );
}

