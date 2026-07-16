import React from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';

interface BranchFormProps {
  formMode: 'add' | 'edit';
  editingId: string | null;
  initialData: any;
  onSave: (branchData: any) => Promise<void>;
  onCancel: () => void;
  savingBranch: boolean;
}

export default function BranchForm({
  formMode,
  editingId,
  initialData,
  onSave,
  onCancel,
  savingBranch
}: BranchFormProps) {
  const [name, setName] = React.useState(initialData?.name || '');
  const [address, setAddress] = React.useState(initialData?.address || '');
  const [phone, setPhone] = React.useState(initialData?.phone || '');
  const [email, setEmail] = React.useState(initialData?.email || '');
  const [hours, setHours] = React.useState(initialData?.hours || '');

  const [formError, setFormError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      name,
      address,
      phone,
      email,
      hours
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
            {formMode === 'add' ? 'Add Office Location' : 'Edit Office Location'}
          </h1>
          <p className="text-slate-555 font-semibold text-sm">
            Configure contact parameters, emails, phone connections, and office hours for regional branch desks.
          </p>
        </div>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-sm">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Location Title / Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Global HQ (Americas)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Postal Address</label>
          <textarea
            required
            rows={3}
            placeholder="Full mailing or regional office address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 resize-none leading-relaxed"
          />
        </div>

        {/* Phone & Email Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Phone Connection</label>
            <input
              type="text"
              required
              placeholder="e.g. +1 (800) 555-8665"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Contact Email</label>
            <input
              type="email"
              required
              placeholder="e.g. chicago@ntc-global.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
            />
          </div>
        </div>

        {/* Office Hours */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-455">Office Hours (Plain Text)</label>
          <input
            type="text"
            required
            placeholder="e.g. Mon - Fri: 8:00 AM - 6:00 PM CST"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-6">
          <button
            type="submit"
            disabled={savingBranch}
            className="flex-1 bg-slate-900 text-white font-bold py-4.5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg disabled:opacity-85"
          >
            {savingBranch ? (
              <>
                <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Writing records...
              </>
            ) : (
              <>
                Save Location <Check className="w-4.5 h-4.5 text-primary-light" />
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
      </form>
    </div>
  );
}
