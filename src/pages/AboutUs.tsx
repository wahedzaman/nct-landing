import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Award, HeartHandshake, Users, ArrowRight } from 'lucide-react';

export default function AboutUs() {
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

  const team = [
    {
      name: "Marcus Vance",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
      bio: "20+ years of industrial engineering experience. Marcus oversees the global strategic direction of NCT."
    },
    {
      name: "Dr. Elena Rostova",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      bio: "Ph.D. in Materials Science. Elena leads our R&D lab, focusing on extreme-durability alloy coatings."
    },
    {
      name: "David Chen",
      role: "VP of Operations",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
      bio: "Expert in lean manufacturing. David manages international logistics, supply chain, and global production plants."
    }
  ];

  return (
    <div className="pt-20 bg-white">
      {/* Hero Banner Section */}
      <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden text-white">
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

      {/* Corporate Story / Intro Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-8">
              A Quarter-Century of <br />
              <span className="text-primary italic font-serif normal-case">Industrial Excellence</span>
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
              <p>
                Founded at the turn of the century as a specialized manufacturing outfit, NCT (National Carbide Technology) has evolved from local roots into a leading industrial accessory provider. We set out to solve a singular problem: standard drills and blades were wearing out too quickly under continuous load, causing project delays and cost overruns.
              </p>
              <p>
                By investing heavily in metallurgical research and precision engineering, we formulated specialized carbide matrices and diamond-coated elements that lasted up to four times longer than competitors. Today, our catalog spans hundreds of custom drilling, cutting, fastening, and grinding solutions trusted across construction, aerospace, and energy sectors.
              </p>
              <p>
                Whether distributing globally recognized tool catalogs or fabricating tailor-made components for multi-million-dollar infrastructure schemes, we adhere to the same unyielding standards of precision, durability, and safety.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-primary-light rounded-3xl opacity-10 blur-lg" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" 
                alt="NTC Precision Manufacturing Facility" 
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white">
                <p className="text-xs uppercase tracking-widest text-primary-light font-black mb-1">State of the Art Facilities</p>
                <h4 className="text-lg font-bold">125k+ Sq. Ft. Smart Production Plant</h4>
              </div>
            </div>
          </motion.div>
        </div>
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
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-3xl">
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

      {/* Leadership Team Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Our Leadership</h2>
            <p className="text-slate-400 mt-4 text-base font-semibold max-w-xl mx-auto">
              Driven by engineering experts dedicated to product quality and sustainable innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group shadow-xl"
              >
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black tracking-tight mb-1">{member.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-primary-light font-black mb-4">{member.role}</p>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
