import React from 'react';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';

interface HeroListProps {
  slides: any[];
  loadingSlides: boolean;
  onAddSlide: () => void;
  onEditSlide: (slide: any) => void;
  onDeleteSlide: (id: string) => void;
}

export default function HeroList({
  slides,
  loadingSlides,
  onAddSlide,
  onEditSlide,
  onDeleteSlide
}: HeroListProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Hero Slides Directory
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Upload, crop, edit, and manage high-resolution homepage slider hero slides.
          </p>
        </div>

        <button
          onClick={onAddSlide}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4.5 h-4.5" /> Add Slide
        </button>
      </div>

      {/* List Board */}
      {loadingSlides ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-slate-455 text-xs font-bold uppercase tracking-wider">Syncing database...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[32px] p-16 text-center shadow-sm">
          <Image className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">No Hero Slides Available</h3>
          <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto mb-6 leading-relaxed">
            Your Supabase `hero_slides` table is empty. Click the button below to upload your first slide.
          </p>
          <button
            onClick={onAddSlide}
            className="inline-flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Upload First Slide
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="py-5 px-8">Slide Image & Title</th>
                  <th className="py-5 px-6">Description</th>
                  <th className="py-5 px-6">Type Badge</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {slides.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-8 flex items-center gap-4 max-w-md">
                      <img
                        src={item.image}
                        alt=""
                        className="w-20 h-12 rounded-lg object-cover shrink-0 border border-slate-200/85 shadow-sm"
                      />
                      <div className="truncate">
                        <h4
                          className="font-bold text-slate-900 truncate leading-snug mb-1 hover:text-primary transition-colors cursor-pointer"
                          onClick={() => onEditSlide(item)}
                        >
                          {item.title}
                        </h4>
                      </div>
                    </td>
                    <td className="py-6 px-6 max-w-xs truncate text-slate-500">
                      {item.description}
                    </td>
                    <td className="py-6 px-6">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-655 text-[9px] font-bold uppercase tracking-widest rounded-full border border-slate-200/60">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditSlide(item)}
                          title="Edit Slide"
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 rounded-xl transition-all cursor-pointer border border-transparent"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSlide(item.id)}
                          title="Delete Slide"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-55 hover:border-red-200 rounded-xl transition-all cursor-pointer border border-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
