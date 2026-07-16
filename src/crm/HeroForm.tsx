import React from 'react';
import { ArrowLeft, Image, UploadCloud, Camera, Trash2, Check, AlertCircle } from 'lucide-react';

interface HeroFormProps {
  formMode: 'add' | 'edit';
  editingId: string | null;
  initialData: any;
  onSave: (slideData: any) => Promise<void>;
  onCancel: () => void;
  savingSlide: boolean;
}

const compressImage = (file: File, maxWidth = 1400, maxHeight = 850, maxSizeBytes = 1048576): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Uploaded file is not an image.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        // Compress until under size limit or quality drops too low
        while (base64.length > 1.33 * maxSizeBytes && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(base64);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export default function HeroForm({
  formMode,
  editingId,
  initialData,
  onSave,
  onCancel,
  savingSlide
}: HeroFormProps) {
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [type, setType] = React.useState(initialData?.type || '');
  const [image, setImage] = React.useState(initialData?.image || '');

  const [dragOver, setDragOver] = React.useState(false);
  const [imageError, setImageError] = React.useState('');
  const [formError, setFormError] = React.useState('');

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setImageError('');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed.');
        return;
      }
      try {
        const compressed = await compressImage(file);
        setImage(compressed);
      } catch (err: any) {
        setImageError(err.message || 'Error compressing image.');
      }
    }
  };

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed.');
        return;
      }
      try {
        const compressed = await compressImage(file);
        setImage(compressed);
      } catch (err: any) {
        setImageError(err.message || 'Error compressing image.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!image) {
      setFormError('Please upload a slide image.');
      return;
    }

    const payload = {
      title,
      description,
      type,
      image
    };

    onSave(payload);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-655 hover:text-slate-900 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {formMode === 'add' ? 'Add Hero Slide' : 'Edit Hero Slide'}
          </h1>
          <p className="text-slate-555 font-semibold text-sm">
            Configure title, descriptions, type labels, and upload high-resolution slide backgrounds.
          </p>
        </div>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left config form panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[32px] p-6 space-y-6 shadow-sm">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Slide Title</label>
            <input
              type="text"
              required
              placeholder="e.g. SAFETY STARTS HERE"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Subtext Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the highlight of this slide..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 resize-none leading-relaxed"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-455">Type/Badge label</label>
            <input
              type="text"
              required
              placeholder="e.g. bolt-lock, drum-lock"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-6">
            <button
              type="submit"
              disabled={savingSlide}
              className="flex-1 bg-slate-900 text-white font-bold py-4.5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg disabled:opacity-85"
            >
              {savingSlide ? (
                <>
                  <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Slide...
                </>
              ) : (
                <>
                  Save Slide <Check className="w-4.5 h-4.5 text-primary-light" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-4.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 text-sm font-bold transition-all cursor-pointer border border-slate-200/50"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right Upload Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slide Image Background</label>

          {image ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-55 group h-[300px]">
              <img src={image} alt="Slide preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <label className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-md">
                  <Camera className="w-3.5 h-3.5" /> Replace Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleSelect} />
                </label>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-dashed border-2 rounded-[24px] p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[300px] ${
                dragOver
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-350 text-slate-500'
              }`}
              onClick={() => document.getElementById('slide-file-input')?.click()}
            >
              <UploadCloud className="w-12 h-12 mb-3 text-slate-450" />
              <p className="text-sm font-bold uppercase tracking-wider text-slate-700">Drag & drop slide background image</p>
              <p className="text-xs text-slate-450 mt-1 font-semibold">Or click to browse local files (JPEG/PNG)</p>
              <input
                id="slide-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelect}
              />
            </div>
          )}
          {imageError && (
            <p className="text-xs font-bold text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {imageError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
