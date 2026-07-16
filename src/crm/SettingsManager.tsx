import React from 'react';
import { Check, AlertCircle, ShieldAlert } from 'lucide-react';

interface SettingsManagerProps {
  initialSettings: { captchaEnabled: boolean; captchaKey: string };
  onSaveSettings: (settings: { captchaEnabled: boolean; captchaKey: string }) => Promise<void>;
  savingSettings: boolean;
}

export default function SettingsManager({
  initialSettings,
  onSaveSettings,
  savingSettings
}: SettingsManagerProps) {
  const [captchaEnabled, setCaptchaEnabled] = React.useState(initialSettings.captchaEnabled);
  const [captchaKey, setCaptchaKey] = React.useState(initialSettings.captchaKey);
  const [formError, setFormError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (captchaEnabled && !captchaKey.trim()) {
      setFormError('Please enter a valid Captcha Key when Captcha is enabled.');
      return;
    }

    onSaveSettings({
      captchaEnabled,
      captchaKey
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
          Security Settings
        </h1>
        <p className="text-slate-500 font-semibold text-sm">
          Configure safety filters, robot/spam checks, and configure secure captcha challenge codes.
        </p>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl flex items-start gap-2.5 shadow-sm max-w-xl">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
        <h3 className="font-black text-slate-900 uppercase tracking-tight text-md pb-3 border-b border-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" /> Spam Prevention Settings
        </h3>

        {/* Captcha Status */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Contact Form Captcha</label>
          <select
            value={captchaEnabled ? 'true' : 'false'}
            onChange={(e) => setCaptchaEnabled(e.target.value === 'true')}
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 cursor-pointer"
          >
            <option value="true">Active (Require security code to submit form)</option>
            <option value="false">Inactive (No challenge verification required)</option>
          </select>
        </div>

        {/* Captcha Key */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Captcha Security Key / Code</label>
          <input
            type="text"
            required
            placeholder="e.g. NCT-SAFE"
            value={captchaKey}
            disabled={!captchaEnabled}
            onChange={(e) => setCaptchaKey(e.target.value)}
            className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 disabled:opacity-50 disabled:bg-slate-100"
          />
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            * When captcha is active, visitors must type this exact code to submit the contact page form.
          </p>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-6">
          <button
            type="submit"
            disabled={savingSettings}
            className="w-full bg-slate-900 text-white font-bold py-4.5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg disabled:opacity-85"
          >
            {savingSettings ? (
              <>
                <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating Security configurations...
              </>
            ) : (
              <>
                Save Settings <Check className="w-4.5 h-4.5 text-primary-light" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
