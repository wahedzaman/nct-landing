import React from 'react';
import { motion } from 'motion/react';
import { Factory, Handshake, Store } from 'lucide-react';

export default function PillarsSection() {
  const pillars = [
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      icon: <Factory className="w-10 h-10" />,
      description: 'Custom solutions engineered with precision. Our ISO-certified facilities ensure that every unit meets the highest quality control standards.',
      features: ['Indigenous R&D', 'OEM/ODM Services', 'Bulk Production']
    },
    {
      id: 'dealership',
      title: 'Dealership',
      icon: <Handshake className="w-10 h-10" />,
      description: 'NTC is a proud distributor of all prominent global tool brands, offering a one-stop-shop for authorized hardware needs.',
      features: ['Authorized Distributor', 'Full After-sales Support', 'Priority Stocking']
    },
    {
      id: 'reselling',
      title: 'Reselling',
      icon: <Store className="w-10 h-10" />,
      description: 'Strategic reselling channel for specialized and discontinued components, ensuring technicians get exactly what they need.',
      features: ['Global Sourcing', 'Verified QC', 'Express Logistics']
    }
  ];

  return (
    <section id="pillars" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, x: index === 0 ? -20 : index === 2 ? 20 : 0, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              className={`p-10 rounded-[32px] ${
                index === 1 ? 'bg-slate-900 text-white shadow-2xl' : 'bg-slate-50 text-slate-900'
              }`}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 ${
                index === 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-primary border border-slate-200 shadow-sm'
              }`}>
                {pillar.icon}
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">{pillar.title}</h3>
              <p className={`mb-8 leading-relaxed ${index === 1 ? 'text-slate-300' : 'text-slate-600'}`}>
                {pillar.description}
              </p>
              <ul className="space-y-3">
                {pillar.features.map(feat => (
                  <li key={feat} className="flex items-center gap-3 font-semibold text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feat}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
