import React from 'react';
import {
  ArrowLeft, LayoutGrid, Image, Sparkles, Bold, Italic, Heading2,
  Heading3, Quote, List, Link2, UploadCloud, Camera, Eye, FileText, Check, AlertCircle, Trash2
} from 'lucide-react';

interface NewsFormProps {
  formMode: 'add' | 'edit';
  editingId: string | null;
  initialData: any;
  onSave: (articleData: any) => Promise<void>;
  onCancel: () => void;
  savingArticle: boolean;
}

const compressImage = (file: File, maxWidth = 1200, maxHeight = 900, maxSizeBytes = 1048576): Promise<string> => {
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

const compressAvatar = (file: File): Promise<string> => {
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
        const SIZE = 200;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, SIZE, SIZE);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export default function NewsForm({
  formMode,
  editingId,
  initialData,
  onSave,
  onCancel,
  savingArticle
}: NewsFormProps) {
  // Form Fields State
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [excerpt, setExcerpt] = React.useState(initialData?.excerpt || '');
  const [category, setCategory] = React.useState(initialData?.category || 'INNOVATION');
  const [image, setImage] = React.useState(initialData?.image || '');
  const [readTime, setReadTime] = React.useState(initialData?.read_time || '5 min read');
  const [authorName, setAuthorName] = React.useState(initialData?.author_name || '');
  const [authorRole, setAuthorRole] = React.useState(initialData?.author_role || '');
  const [authorAvatar, setAuthorAvatar] = React.useState(initialData?.author_avatar || '');
  const [contentText, setContentText] = React.useState(initialData?.content ? initialData.content.join('\n\n') : '');
  const [tagsInput, setTagsInput] = React.useState(initialData?.tags ? initialData.tags.join(', ') : '');
  const [status, setStatus] = React.useState<'draft' | 'published' | 'scheduled'>(initialData?.status || 'published');

  // Format local publish time timestamp
  const getInitialPublishedAt = () => {
    if (initialData?.published_at) {
      const dateObj = new Date(initialData.published_at);
      const tzOffset = dateObj.getTimezoneOffset() * 60000;
      return (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
    }
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);
  };
  const [publishedAt, setPublishedAt] = React.useState(getInitialPublishedAt());

  // Component UI States
  const [activeTab, setActiveTab] = React.useState<'edit' | 'preview'>('edit');
  const [coverDragOver, setCoverDragOver] = React.useState(false);
  const [avatarDragOver, setAvatarDragOver] = React.useState(false);
  const [imageError, setImageError] = React.useState('');
  const [formError, setFormError] = React.useState('');

  const handleCoverDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setCoverDragOver(false);
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

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAvatarDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setAvatarDragOver(false);
    setImageError('');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed.');
        return;
      }
      try {
        const compressed = await compressAvatar(file);
        setAuthorAvatar(compressed);
      } catch (err: any) {
        setImageError(err.message || 'Error compressing avatar.');
      }
    }
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed.');
        return;
      }
      try {
        const compressed = await compressAvatar(file);
        setAuthorAvatar(compressed);
      } catch (err: any) {
        setImageError(err.message || 'Error compressing avatar.');
      }
    }
  };

  // Custom Markdown Editor helpers
  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById('news-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    if (syntax === 'bold') {
      replacement = `**${selectedText || 'bold text'}**`;
    } else if (syntax === 'italic') {
      replacement = `*${selectedText || 'italic text'}*`;
    } else if (syntax === 'h2') {
      replacement = `\n## ${selectedText || 'Heading 2'}\n`;
    } else if (syntax === 'h3') {
      replacement = `\n### ${selectedText || 'Heading 3'}\n`;
    } else if (syntax === 'quote') {
      replacement = `\n> ${selectedText || 'Quote text'}\n`;
    } else if (syntax === 'list') {
      replacement = `\n- ${selectedText || 'list item'}\n`;
    } else if (syntax === 'link') {
      replacement = `[${selectedText || 'link text'}](https://example.com)`;
    } else if (syntax === 'image') {
      replacement = `![${selectedText || 'image caption'}](https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop)`;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setContentText(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  // Render a paragraph preview based on simple markdown patterns
  const renderParagraphPreview = (paragraph: string, index: number, paragraphsList: string[]) => {
    // 1. Check if matches image: ![alt](url)
    const imgRegex = /^!\[(.*?)\]\((.*?)\)$/;
    const match = paragraph.match(imgRegex);
    if (match) {
      const alt = match[1];
      const url = match[2];
      return (
        <div key={index} className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-md max-w-full">
          <img src={url} alt={alt} className="w-full h-auto object-cover max-h-[350px]" />
          {alt && (
            <div className="bg-slate-55 border-t border-slate-100 px-4 py-2 text-center text-xs font-semibold text-slate-500">
              {alt}
            </div>
          )}
        </div>
      );
    }

    // 2. Check if heading 2
    if (paragraph.startsWith('## ')) {
      return (
        <h2 key={index} className="text-2xl font-bold text-slate-900 mt-6 mb-3">
          {paragraph.replace('## ', '')}
        </h2>
      );
    }

    // 3. Check if heading 3
    if (paragraph.startsWith('### ')) {
      return (
        <h3 key={index} className="text-xl font-bold text-slate-900 mt-4 mb-2">
          {paragraph.replace('### ', '')}
        </h3>
      );
    }

    // 4. Check if quote
    if (paragraph.startsWith('> ') || paragraph.startsWith('"') || paragraph.startsWith('“')) {
      const cleanText = paragraph.replace(/^>\s*/, '');
      return (
        <blockquote
          key={index}
          className="border-l-4 border-primary pl-6 py-3 my-6 text-lg font-serif italic text-slate-800 leading-relaxed bg-slate-55 rounded-r-xl"
        >
          {cleanText}
        </blockquote>
      );
    }

    // 5. Check if list
    if (paragraph.startsWith('- ')) {
      const items = paragraph.split('\n').map((item) => item.replace(/^- /, ''));
      return (
        <ul key={index} className="list-disc pl-6 space-y-1.5 my-4 text-slate-655 text-base">
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      );
    }

    // 6. Check if it's the first text paragraph
    const firstTextIdx = paragraphsList.findIndex(
      (p) => !p.startsWith('##') && !p.startsWith('###') && !p.startsWith('![')
    );

    if (index === firstTextIdx) {
      return (
        <p key={index} className="first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-2.5 first-letter:leading-none text-slate-750 text-base leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    }

    return (
      <p key={index} className="text-slate-700 text-base leading-relaxed mb-4">
        {paragraph}
      </p>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!image) {
      setFormError('Please upload a cover image.');
      return;
    }
    if (!authorAvatar) {
      setFormError('Please upload an author avatar.');
      return;
    }

    // Pre-process list inputs
    const contentParagraphs = contentText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p !== '');

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    // Format display date: e.g., "Jul 15, 2026"
    const parsedDate = new Date(publishedAt);
    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const displayDate = parsedDate.toLocaleDateString('en-US', dateOptions);

    const payload = {
      title,
      excerpt,
      category: category.toUpperCase(),
      image,
      read_time: readTime,
      author_name: authorName,
      author_role: authorRole,
      author_avatar: authorAvatar,
      content: contentParagraphs,
      tags: tagsArray,
      status,
      published_at: parsedDate.toISOString(),
      date: displayDate
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
            {formMode === 'add' ? 'Create news' : 'Edit news'}
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Write detailed news articles, load previews, and configure news timestamps.
          </p>
        </div>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-205 text-red-700 text-sm font-bold rounded-2xl flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Settings Panel (Settings & Metadata) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[32px] p-6 space-y-6 shadow-sm">
          <h3 className="font-black text-slate-900 uppercase tracking-tight text-md pb-3 border-b border-slate-100 flex items-center gap-2">
            <LayoutGrid className="w-4.5 h-4.5 text-primary" /> Settings & Meta
          </h3>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Post Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 cursor-pointer"
            >
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Publish Date/Time selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">
              {status === 'scheduled' ? 'Scheduled Release Time' : 'news Timestamp'}
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                required
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 cursor-pointer"
            >
              <option value="AWARD">Award</option>
              <option value="EXPANSION">Expansion</option>
              <option value="INNOVATION">Innovation</option>
              <option value="SUSTAINABILITY">Sustainability</option>
              <option value="TECH">Technology</option>
            </select>
          </div>

          {/* Reading time */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Reading Duration</label>
            <input
              type="text"
              required
              placeholder="e.g. 5 min read"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
            />
          </div>

          {/* Cover Image Upload (Drag & Drop) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450 flex items-center gap-1">
              <Image className="w-3.5 h-3.5" /> Cover Image (Drag & Drop)
            </label>
            
            {image ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-55 group h-40">
                <img src={image} alt="Cover preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-md">
                    <Camera className="w-3.5 h-3.5" /> Change
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                  </label>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="bg-red-500 hover:bg-red-655 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setCoverDragOver(true); }}
                onDragLeave={() => setCoverDragOver(false)}
                onDrop={handleCoverDrop}
                className={`border-dashed border-2 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                  coverDragOver
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 bg-slate-55 hover:bg-slate-100/50 hover:border-slate-350 text-slate-500'
                }`}
                onClick={() => document.getElementById('cover-file-input')?.click()}
              >
                <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Drag & drop your cover image</p>
                <p className="text-[10px] text-slate-450 mt-1 font-semibold">Or click to browse files (JPEG/PNG)</p>
                <input
                  id="cover-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverSelect}
                />
              </div>
            )}
            {imageError && (
              <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {imageError}
              </p>
            )}
          </div>

          {/* Author Selection */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Author Details</h4>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-455">Full Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-455">Designation</label>
              <input
                type="text"
                required
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
              />
            </div>

            {/* Avatar Upload (Drag & Drop) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-455">Author Avatar</label>
              <div className="flex items-center gap-4">
                {authorAvatar ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-55 group shrink-0">
                    <img src={authorAvatar} alt="Avatar preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                         onClick={() => document.getElementById('avatar-file-input')?.click()}>
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setAvatarDragOver(true); }}
                    onDragLeave={() => setAvatarDragOver(false)}
                    onDrop={handleAvatarDrop}
                    className={`w-16 h-16 rounded-full border-dashed border-2 flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 ${
                      avatarDragOver
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 bg-slate-55 hover:bg-slate-100 hover:border-slate-350 text-slate-400'
                    }`}
                    onClick={() => document.getElementById('avatar-file-input')?.click()}
                  >
                    <UploadCloud className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-bold text-slate-700">Drag & drop profile picture</p>
                  <p className="text-[10px] text-slate-450 font-semibold">Or click avatar to upload photo</p>
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Editor Panel (Title, Excerpt, Content) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Article Title</label>
            <input
              type="text"
              required
              placeholder="Enter a compelling title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-55 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-black text-slate-900 tracking-tight text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Short Summary / Excerpt</label>
            <textarea
              required
              rows={2}
              placeholder="Write a brief intro/summary of the article shown in listings..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-slate-55 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-slate-700 text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Award, Sustainability, Tech"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-55 border border-slate-200 px-5 py-3 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-slate-700 text-sm"
            />
          </div>

          {/* Editor Content Area (With rich preview) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Content</label>
              <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 ${activeTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 ${activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Live Preview
                </button>
              </div>
            </div>

            {activeTab === 'edit' ? (
              <div className="space-y-3">
                {/* Rich Text Markdown Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('bold')}
                    title="Bold Text"
                    className="p-2 hover:bg-slate-200 text-slate-655 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('italic')}
                    title="Italic Text"
                    className="p-2 hover:bg-slate-200 text-slate-655 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-slate-200 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertMarkdown('h2')}
                    title="Heading 2"
                    className="p-2 hover:bg-slate-200 text-slate-655 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('h3')}
                    title="Heading 3"
                    className="p-2 hover:bg-slate-200 text-slate-655 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-slate-200 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertMarkdown('quote')}
                    title="Blockquote"
                    className="p-2 hover:bg-slate-200 text-slate-655 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('list')}
                    title="Bullet List"
                    className="p-2 hover:bg-slate-200 text-slate-655 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('link')}
                    title="Add Link"
                    className="p-2 hover:bg-slate-200 text-slate-655 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('image')}
                    title="Insert Image"
                    className="p-2 hover:bg-slate-200 text-slate-655 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  <span className="ml-auto text-[10px] font-mono text-slate-400 pr-1.5">
                    Press Enter twice for paragraph breaks
                  </span>
                </div>

                <textarea
                  required
                  id="news-content-textarea"
                  rows={12}
                  placeholder="Write article paragraphs here. Start a paragraph with > to render it as a blockquote, or ## for headers..."
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-slate-700 text-sm resize-y leading-relaxed font-mono"
                />
              </div>
            ) : (
              /* Live Preview Tab rendering identical typography settings */
              <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl min-h-[300px] overflow-y-auto max-h-[500px]">
                {contentText ? (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-4 mb-6">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8.5px] font-black uppercase rounded border border-primary/20">
                        {category}
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 mt-2">{title || 'Untitled Article'}</h2>
                      <p className="text-slate-400 text-xs mt-1">
                        By {authorName || 'Anonymous'} &bull; {readTime}
                      </p>
                    </div>

                    {(() => {
                      const pList = contentText.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p !== '');
                      return pList.map((p, i) => renderParagraphPreview(p, i, pList));
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-400 space-y-2">
                    <Eye className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold">Preview container empty</p>
                    <p className="text-xs text-slate-500">Type content in the editor to load dynamic reviews.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-6">
            <button
              type="submit"
              disabled={savingArticle}
              className="flex-1 bg-slate-900 text-white font-bold py-4.5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg disabled:opacity-85"
            >
              {savingArticle ? (
                <>
                  <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Writing database records...
                </>
              ) : (
                <>
                  Save news <Check className="w-4.5 h-4.5 text-primary-light" />
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
      </form>
    </div>
  );
}
