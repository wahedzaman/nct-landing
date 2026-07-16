import React from 'react';
import { Save, X, Plus, Trash2, Upload, AlertCircle, FileImage } from 'lucide-react';

interface ProductFormProps {
  formMode: 'add' | 'edit';
  editingId: string | null;
  initialData: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  savingProduct: boolean;
}

export default function ProductForm({
  formMode,
  editingId,
  initialData,
  onSave,
  onCancel,
  savingProduct
}: ProductFormProps) {
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [category, setCategory] = React.useState(initialData?.category || 'New Products');
  const [image, setImage] = React.useState(initialData?.image || '');
  const [features, setFeatures] = React.useState<string[]>(
    Array.isArray(initialData?.features) ? initialData.features : ['']
  );
  const [isFeatured, setIsFeatured] = React.useState(!!initialData?.is_featured);
  const [isActive, setIsActive] = React.useState(
    initialData ? !!initialData.is_active : true
  );

  const [dragActive, setDragActive] = React.useState(false);
  const [imageError, setImageError] = React.useState('');
  const [formError, setFormError] = React.useState('');

  // Handle bullets list actions
  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (idx: number) => {
    if (features.length <= 1) {
      setFeatures(['']);
      return;
    }
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleFeatureChange = (idx: number, val: string) => {
    const next = [...features];
    next[idx] = val;
    setFeatures(next);
  };

  // Image upload compression canvas helper (Square 800x800)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setImageError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Force Square dimension 800x800 for product catalog alignment
        const targetWidth = 800;
        const targetHeight = 800;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw image keeping ratio and fitting it inside the square bounds (contain mix)
        ctx.fillStyle = '#ffffff'; // White background placeholder
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        let drawWidth = img.width;
        let drawHeight = img.height;
        let offsetX = 0;
        let offsetY = 0;

        const imgRatio = img.width / img.height;
        if (imgRatio > 1) {
          drawWidth = targetWidth;
          drawHeight = targetWidth / imgRatio;
          offsetY = (targetHeight - drawHeight) / 2;
        } else {
          drawHeight = targetHeight;
          drawWidth = targetHeight * imgRatio;
          offsetX = (targetWidth - drawWidth) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Convert to webp/jpeg base64
        let quality = 0.85;
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality);

        // Reduce quality if size > 1MB (roughly length of base64 text > 1.3M chars)
        while (compressedBase64.length > 1300000 && quality > 0.3) {
          quality -= 0.1;
          compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        }

        if (compressedBase64.length > 1300000) {
          setImageError('Failed to compress image below 1MB. Please use a smaller file size.');
          return;
        }

        setImage(compressedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a product title.');
      return;
    }
    if (!image) {
      setFormError('Product display image is required.');
      return;
    }

    const cleanFeatures = features.map((f) => f.trim()).filter(Boolean);
    if (cleanFeatures.length === 0) {
      setFormError('Please enter at least one product bullet description/feature.');
      return;
    }

    onSave({
      title: title.trim(),
      category: category.trim(),
      image,
      features: cleanFeatures,
      is_featured: isFeatured,
      is_active: isActive
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
          {formMode === 'add' ? 'Add Product Card' : 'Edit Product Details'}
        </h1>
        <p className="text-slate-500 font-semibold text-sm">
          {formMode === 'add'
            ? 'Populate details below to create a new industrial tool or power accessory.'
            : `Update properties for catalog item ID: ${editingId}`}
        </p>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl flex items-start gap-2.5 shadow-sm max-w-xl">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Fields */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Product Model / Title</label>
              <input
                type="text"
                required
                placeholder="e.g. EXBA18V-80"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Category Type</label>
              <input
                type="text"
                required
                placeholder="e.g. New Products, Plunge Routers, Drills & Drivers"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
              />
            </div>

            {/* Bullets lists manager */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">
                  Feature Bullets & Specifications
                </label>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bullet
                </button>
              </div>

              <div className="space-y-3">
                {features.map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-slate-800 shrink-0 inline-block rounded-none font-bold" />
                    <input
                      type="text"
                      required
                      placeholder={`Bullet item #${idx + 1}...`}
                      value={bullet}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-205 px-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                      title="Remove Bullet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Toggles */}
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Catalog Visibility</label>
                <select
                  value={isActive ? 'true' : 'false'}
                  onChange={(e) => setIsActive(e.target.value === 'true')}
                  className="w-full bg-slate-50 border border-slate-205 px-4 py-3 rounded-xl outline-none font-semibold text-sm text-slate-700 cursor-pointer"
                >
                  <option value="true">Active (Display in product catalog)</option>
                  <option value="false">Inactive (Hide from catalog)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Featured Display</label>
                <select
                  value={isFeatured ? 'true' : 'false'}
                  onChange={(e) => setIsFeatured(e.target.value === 'true')}
                  className="w-full bg-slate-50 border border-slate-205 px-4 py-3 rounded-xl outline-none font-semibold text-sm text-slate-700 cursor-pointer"
                >
                  <option value="true">Featured (Show in top featured banner selector)</option>
                  <option value="false">Regular catalog only</option>
                </select>
              </div>
            </div>

          </div>

          {/* Right Column: Image Uploader Container */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Product Photo (Square)</label>
            
            {imageError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-655 text-xs font-bold rounded-2xl flex items-start gap-2 shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{imageError}</span>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-[24px] p-6 text-center transition-all ${
                dragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-350 bg-slate-50'
              } relative min-h-[220px] flex flex-col justify-center items-center`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              {image ? (
                <div className="space-y-4">
                  <div className="w-36 h-36 border border-slate-200 rounded-2xl bg-white p-2.5 mx-auto flex items-center justify-center overflow-hidden shadow-inner select-none">
                    <img
                      src={image}
                      alt="Product preview"
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-750 uppercase">Square Image Loaded</p>
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="text-xs text-red-550 hover:underline font-bold cursor-pointer"
                    >
                      Delete Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">Drag and drop file here, or browse</p>
                    <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed">
                      * Maximum upload file size is 1MB.<br />
                      * Standardized automatically to white-spaced 800x800 square JPEG.
                    </p>
                  </div>
                  <label className="inline-block bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer transition-colors">
                    Browse File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Action button rows */}
        <div className="flex items-center gap-4 max-w-xl">
          <button
            type="submit"
            disabled={savingProduct}
            className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-85"
          >
            {savingProduct ? (
              <>
                <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving item...
              </>
            ) : (
              <>
                Save Product <Save className="w-4 h-4 text-primary-light" />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-4 px-6 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
