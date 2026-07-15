import { Drill, Scissors, Settings, Hammer, ShieldCheck, Lock } from 'lucide-react';
import React from 'react';
import { Category, NewsItem, Product, Stat } from './types';

export const CATEGORIES: Category[] = [
  { id: 'lock', name: 'Premium Pad Locks', icon: <Lock className="w-6 h-6" /> },
  { id: 'drilling', name: 'Drilling Solutions', icon: <Drill className="w-6 h-6" /> },
  { id: 'cutting', name: 'Cutting Technology', icon: <Scissors className="w-6 h-6" /> },
  { id: 'grinding', name: 'Grinding & Finishing', icon: <Settings className="w-6 h-6" /> },
  { id: 'impact', name: 'Impact Accessories', icon: <Hammer className="w-6 h-6" /> },
  { id: 'safety', name: 'Safety Equipment', icon: <ShieldCheck className="w-6 h-6" /> },
];

export const STATS: Stat[] = [
  { label: 'Years in Business', value: '15', suffix: '+' },
  { label: 'Total Products', value: '500', suffix: '+' },
  { label: 'Operating In', value: '10', suffix: 'Districts' },
  { label: 'Total Employees', value: '51', suffix: '+' },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Precision Cobalt Drill Set',
    category: 'Drilling',
    image: 'ntc_drill_bits_macro',
    isNew: true
  },
  {
    id: '2',
    name: 'Diamond Tipped Circular Blade',
    category: 'Cutting',
    image: 'ntc_saw_blades_macro'
  },
  {
    id: '3',
    name: 'Impact-Ready Hex Set',
    category: 'Impact',
    image: 'ntc_impact_bits_macro',
    isNew: true
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    date: 'Oct 24, 2023',
    category: 'AWARD',
    title: 'NCT Receives Global Excellence in Manufacturing Award',
    excerpt: 'Recognized for our sustainable production methods and high-quality safety standards in the APAC region.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
    readTime: '4 min read',
    author: {
      name: 'Marcus Vance',
      role: 'CEO & Co-Founder',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop'
    },
    tags: ['Award', 'APAC', 'Global Excellence', 'Manufacturing'],
    content: [
      'NCT is proud to announce that it has been awarded the prestigious Global Excellence in Manufacturing Award for 2023. The selection committee cited our industry-leading commitment to safety protocols, waste reduction, and clean production pipelines across our APAC operations as key deciding factors.',
      'The award ceremony, held in Singapore, recognized companies that demonstrate remarkable leadership in operational efficiency and workplace standard preservation. Our Singapore distribution hub has integrated advanced automated sorting systems that reduced packaging waste by 35% in its first fiscal year, paving the way for regional carbon footprint reductions.',
      'CEO Marcus Vance accepted the award on behalf of the engineering and operations teams. "This recognition is a testament to the hard work and passion of our global manufacturing teams who strive to prove that high-performance heavy-duty products can be built with sustainable methods," Vance stated in his keynote address.',
      'Looking ahead, NCT aims to replicate these sustainable practices in our EMEA and Chicago facilities by 2026, targeting a 50% decrease in overall waste across all assembly and distribution plants.'
    ]
  },
  {
    id: '2',
    date: 'Sep 12, 2023',
    category: 'EXPANSION',
    title: 'New Dealership Network Launches in Western Europe',
    excerpt: 'Expanding our footprint to provide premium tool accessories to professional contractors across Europe.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    readTime: '3 min read',
    author: {
      name: 'David Chen',
      role: 'VP of Operations',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop'
    },
    tags: ['Expansion', 'Europe', 'Partnership', 'Contractors'],
    content: [
      'In a strategic move to address growing demand, NCT has officially launched its new Western European dealership network. Partnering with 15 elite industrial tool distributors across Germany, France, and the United Kingdom, we will now bring our custom drilling and cutting accessories directly to European job sites.',
      'This expansion represents a critical milestone in our global distribution strategy. Up until now, European contractors sourced NCT accessories through import brokers, resulting in extended lead times and increased freight costs. The new localized network guarantees next-day delivery for standard items and a maximum of five business days for custom product fabrications.',
      'David Chen, VP of Operations, highlighted the logistics behind this launch: "By establishing regional warehousing hubs in Hamburg and Rotterdam, we have resolved import hurdles and secured competitive pricing for our dealers. This ensures local technicians get the heavy-duty components they need without delay."',
      'To celebrate the launch, local dealers will offer technical demonstration days throughout September, allowing regional contractors to test our patented carbide and diamond-tipped blades firsthand under loaded industrial conditions.'
    ]
  },
  {
    id: '3',
    date: 'Aug 05, 2023',
    category: 'INNOVATION',
    title: 'Next-Gen Carbide Coating Technology Patented',
    excerpt: 'Our latest R&D breakthrough increases tool lifespan by 40% in heavy-duty industrial applications.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    readTime: '6 min read',
    author: {
      name: 'Dr. Elena Rostova',
      role: 'Chief Technology Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
    },
    tags: ['Innovation', 'R&D', 'Carbide Coating', 'Patents'],
    content: [
      'Following three years of intensive metallurgical research, NCT has successfully patented a next-generation durable carbide coating technology. This proprietary alloy formulation is engineered to increase the lifespan of drilling and cutting accessories by up to 40% under continuous high-temperature loads.',
      'Traditional carbide coatings degrade quickly when drilling into high-strength alloys or reinforced concrete due to extreme thermal stress. Our new molecular vapor deposition technique binds micro-crystalline diamond structures directly onto the carbide matrix, creating a highly thermal-resistant shield that mitigates friction-induced wear.',
      'CTO Dr. Elena Rostova explained the breakthrough: "By controlling the crystallization of diamond elements at a molecular level during deposition, we created a surface that effectively dissipates heat. The tools stay cool, the structural integrity of the carbide is preserved, and the operator gets significantly more usage out of a single bit."',
      'The patented coating will roll out as a standard feature on all Premium Cobalt Drill Sets and Diamond-Tipped Circular Blades starting in the fourth quarter. Field testing with major infrastructure builders has confirmed dramatic reductions in tool replacement costs and downtime on major projects.'
    ]
  },
  {
    id: '4',
    date: 'Jun 18, 2023',
    category: 'SUSTAINABILITY',
    title: 'NTC Commits to Net-Zero Steel Sourcing by 2030',
    excerpt: 'Partnering with clean energy smelting operations to eliminate carbon footprint from core raw materials.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop',
    readTime: '5 min read',
    author: {
      name: 'Sarah Jenkins',
      role: 'Lead Sustainability Officer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop'
    },
    tags: ['Sustainability', 'Net-Zero', 'Green Smelting', 'Steel'],
    content: [
      'NCT (New City Trade) has announced a binding commitment to source 100% of its structural steel from net-zero certified smelters by the year 2030. The initiative aims to fully remove the indirect carbon footprint from our core raw materials, setting a new benchmark for heavy-duty tool accessory manufacturers.',
      'The production of high-grade tool steel is traditionally an energy-intensive process that relies heavily on coal-fired blast furnaces. By transitioning our supply chain to modern electric-arc furnaces powered by wind and solar energy, we will help drive down demand for high-carbon metals.',
      '"As a major buyer of raw steel alloys, our purchasing decisions have a direct impact on the environment," said Sarah Jenkins, Lead Sustainability Officer. "Our contracts will prioritize suppliers who utilize green hydrogen smelting techniques, proving that heavy manufacturing can align with international climate targets."',
      'NCT is also initiating a customer recycling program. Starting next month, contractors can return worn-out drill bits and blades to participating dealerships for recycling, earning discount credits toward future purchases while closing the loop on valuable tool alloys.'
    ]
  },
  {
    id: '5',
    date: 'May 02, 2023',
    category: 'TECH',
    title: 'Integrating IoT Diagnostics in Heavy Industrial Operations',
    excerpt: 'Embedding digital smart diagnostics to monitor tool vibration, temperature, and wear metrics in real-time.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    readTime: '5 min read',
    author: {
      name: 'Dr. Elena Rostova',
      role: 'Chief Technology Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
    },
    tags: ['Tech', 'IoT', 'Diagnostics', 'Industry 4.0'],
    content: [
      'NCT is stepping into the era of Industry 4.0 by developing smart, IoT-enabled diagnostic modules for heavy-duty cutting equipment. These sensor assemblies are designed to clip onto industrial rigs, sending real-time data regarding vibration, rotational temperature, and material fatigue directly to operators.',
      'Preventing tool failure is a constant challenge in large-scale machining. Sudden breakage not only damages workpieces but can also lead to significant operator hazard and production delays. The smart modules use high-frequency accelerometers to spot microscopic cracks and heat build-ups long before they cause mechanical failure.',
      'Operators receive alert notifications via a mobile or desktop dashboard, advising them when to slow down feed rates or schedule a replacement. Preliminary trials on automotive assembly lines showed a 95% accuracy rate in predicting tool failures, translating to substantial savings in component repair costs.',
      'Dr. Elena Rostova commented: "We are bridging the gap between mechanical durability and digital intelligence. By providing technicians with actionable diagnostic telemetry, we help them run operations at peak safety and efficiency without guessing when their tools will give out."'
    ]
  }
];
