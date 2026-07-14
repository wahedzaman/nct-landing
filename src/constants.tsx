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
    excerpt: 'Recognized for our sustainable production methods and high-quality safety standards in the APAC region.'
  },
  {
    id: '2',
    date: 'Sep 12, 2023',
    category: 'EXPANSION',
    title: 'New Dealership Network Launches in Western Europe',
    excerpt: 'Expanding our footprint to provide premium tool accessories to professional contractors across Europe.'
  },
  {
    id: '3',
    date: 'Aug 05, 2023',
    category: 'INNOVATION',
    title: 'Next-Gen Carbide Coating Technology Patented',
    excerpt: 'Our latest R&D breakthrough increases tool lifespan by 40% in heavy-duty industrial applications.'
  }
];
