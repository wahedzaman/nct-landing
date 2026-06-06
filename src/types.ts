import React from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  category: string;
}
