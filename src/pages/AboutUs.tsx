import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Award, HeartHandshake } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const MOCK_DESC_EN = `Founded at the turn of the century as a specialized manufacturing outfit, NCT (National Carbide Technology) has evolved from local roots into a leading industrial accessory provider. We set out to solve a singular problem: standard drills and blades were wearing out too quickly under continuous load, causing project delays and cost overruns.

By investing heavily in metallurgical research and precision engineering, we formulated specialized carbide matrices and diamond-coated elements that lasted up to four times longer than competitors. Today, our catalog spans hundreds of custom drilling, cutting, fastening, and grinding solutions trusted across construction, aerospace, and energy sectors.

Whether distributing globally recognized tool catalogs or fabricating tailor-made components for multi-million-dollar infrastructure schemes, we adhere to the same unyielding standards of precision, durability, and safety.`;

const MOCK_DESC_BN = `শতাব্দীর শুরুতে একটি বিশেষ উৎপাদনকারী প্রতিষ্ঠান হিসেবে প্রতিষ্ঠিত, NCT (ন্যাশনাল কার্বাইড টেকনোলজি) স্থানীয় ভিত্তি থেকে একটি শীর্ষস্থানীয় শিল্প আনুষঙ্গিক সরবরাহকারী হিসেবে বিকশিত হয়েছে। আমরা একটি একক সমস্যা সমাধানের উদ্দেশ্যে যাত্রা শুরু করেছিলাম: সাধারণ ড্রিল এবং ব্লেডগুলি ক্রমাগত লোডের অধীনে খুব দ্রুত ক্ষয় হয়ে যাচ্ছিল, যার ফলে প্রকল্পের বিলম্ব এবং অতিরিক্ত খরচ হতো।

ধাতব গবেষণা এবং সূক্ষ্ম প্রকৌশলে বিপুল বিনিয়োগের মাধ্যমে, আমরা বিশেষ কার্বাইড ম্যাট্রিক্স এবং ডায়মন্ড-কোটেড উপাদান তৈরি করেছি যা প্রতিযোগী ব্র্যান্ডগুলোর চেয়ে চার গুণ বেশি সময় ধরে কাজ করে। আজ, আমাদের ক্যাটালগটিতে নির্মাণ, মহাকাশ এবং শক্তি খাতে বিশ্বস্ত শত শত কাস্টম ড্রিলিং, কাটিং, ফাস্টেনিং এবং গ্রাইন্ডিং সমাধান রয়েছে।

বিশ্বব্যাপী স্বীকৃত টুলের ক্যাটালগ বিতরণ করা হোক বা মাল্টি-মিলিয়ন ডলারের অবকাঠামো স্কিমগুলির জন্য তৈরি পোশাক উপাদান তৈরি করা হোক, আমরা নির্ভুলতা, স্থায়িত্ব এবং সুরক্ষার একই অনড় মান মেনে চলি।`;

export default function AboutUs() {
  const [lang, setLang] = React.useState<'en' | 'bn'>('en');

  // Dynamic Corporate Story Settings
  const [title1En, setTitle1En] = React.useState('A Quarter-Century of');
  const [title1Bn, setTitle1Bn] = React.useState('একটি সিকি শতাব্দী ধরে');
  const [title2En, setTitle2En] = React.useState('Industrial Excellence');
  const [title2Bn, setTitle2Bn] = React.useState('শিল্পগত শ্রেষ্ঠত্ব');
  const [descEn, setDescEn] = React.useState(MOCK_DESC_EN);
  const [descBn, setDescBn] = React.useState(MOCK_DESC_BN);
  const [loading, setLoading] = React.useState(isSupabaseConfigured);

  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase!
          .from('settings')
          .select('*');

        if (error) throw error;
        const at1en = data?.find((s) => s.key === 'about_title1_en');
        const at1bn = data?.find((s) => s.key === 'about_title1_bn');
        const at2en = data?.find((s) => s.key === 'about_title2_en');
        const at2bn = data?.find((s) => s.key === 'about_title2_bn');
        const aden = data?.find((s) => s.key === 'about_desc_en');
        const adbn = data?.find((s) => s.key === 'about_desc_bn');

        if (at1en) setTitle1En(at1en.value);
        if (at1bn) setTitle1Bn(at1bn.value);
        if (at2en) setTitle2En(at2en.value);
        if (at2bn) setTitle2Bn(at2bn.value);
        if (aden) setDescEn(aden.value);
        if (adbn) setDescBn(adbn.value);
      } catch (err) {
        console.error('Failed to fetch settings in AboutUs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const coreValues = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Uncompromising Safety",
      description: "Our tools and accessories undergo rigorous tests to meet international safety criteria, keeping technicians safe under the toughest conditions."
    },
    {
      icon: <Cpu className="w-8 h-8 text-primary" />,
      title: "Continuous Innovation",
      description: "Through advanced research and proprietary coating techniques, we continually redefine the limits of tool durability and efficiency."
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Premium Precision",
      description: "We design and manufacture components with micron-level tolerance, ensuring perfect compatibility and peak performance every time."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-primary" />,
      title: "Trusted Partnership",
      description: "We sustain long-term relationships with distributors, resellers, and contractors by offering responsive logistics and technical support."
    }
  ];

  const milestones = [
    { year: "2001", title: "NTC Founded", desc: "Established as a specialized carbide drill manufacturer in Chicago, IL with a team of 10 engineers." },
    { year: "2008", title: "ISO 9001 Certification", desc: "Upgraded facility standards to achieve formal international certification and expanded domestic distribution." },
    { year: "2015", title: "Global Network Expansion", desc: "Launched distribution centers in the APAC and EMEA regions, scaling up to over 200 dealership partners." },
    { year: "2023", title: "Carbide Coating Patent", desc: "Patented next-generation durable carbide coating, increasing standard tool longevity by 40%." },
    { year: "2026", title: "Smart Manufacturing Era", desc: "Integrated smart AI diagnostics and automated robotics across 125,000 sq. ft. of manufacturing floors." }
  ];

  // Split description paragraphs helper
  const activeDesc = lang === 'en' ? descEn : descBn;
  const paragraphs = activeDesc
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="pt-20 bg-white">
      {/* Hero Banner Section */}
      <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden text-white border-b border-slate-900">
        {/* Radial and Grid Backdrop */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-6 border border-primary/20">
              WHO WE ARE
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
              Engineering Trust <br /><span className="text-primary-light">One Precision Part</span> At A Time
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              NTC is a global manufacturer and authorized supplier of high-durability power tool accessories.
              We equip builders, technicians, and enterprises with the precision gear needed to shape the future safely.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Language Switcher Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex justify-end">
        <div className="bg-slate-105 rounded-xl p-1 border border-slate-200 flex items-center shadow-sm">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 text-xs font-black uppercase rounded-lg cursor-pointer transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('bn')}
            className={`px-3 py-1.5 text-xs font-black uppercase rounded-lg cursor-pointer transition-all ${lang === 'bn' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            BN
          </button>
        </div>
      </div>

      {/* Corporate Story / Intro Section */}
      <section className="py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-2" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Syncing Corporate History...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-1 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Titles segment */}
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-8">
                {lang === 'en' ? title1En : title1Bn} <br />
                <span className="text-primary italic font-serif normal-case">
                  {lang === 'en' ? title2En : title2Bn}
                </span>
              </h2>

              {/* Description paragraphs */}
              <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
                {paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">Our Core Values</h2>
            <p className="text-slate-500 mt-4 text-base font-semibold max-w-xl mx-auto">
              The fundamental principles that govern our product engineering, vendor relations, and custom operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">Milestones of Progress</h2>
          <p className="text-slate-500 mt-4 text-base font-semibold max-w-xl mx-auto">
            Charting our course from a small workshop to an international industrial accessory brand.
          </p>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 space-y-12 py-4">
          {milestones.map((ms, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-md ring-2 ring-primary/30" />

              {/* Year label left of line in desktop */}
              <div className="hidden md:block absolute -left-36 top-1 text-right w-24">
                <span className="text-2xl font-black text-slate-900 tracking-tighter">{ms.year}</span>
              </div>

              {/* Box content */}
              <div className="bg-slate-55 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-3xl">
                <span className="inline-block md:hidden bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-2">
                  {ms.year}
                </span>
                <h3 className="text-xl font-black text-slate-900 mb-2">{ms.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{ms.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
