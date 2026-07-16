import React from 'react';
import { Check, AlertCircle, ShieldAlert, Globe } from 'lucide-react';

interface SettingsManagerProps {
  initialSettings: {
    captchaEnabled: boolean;
    captchaKey: string;
    aboutTitle1En: string;
    aboutTitle1Bn: string;
    aboutTitle2En: string;
    aboutTitle2Bn: string;
    aboutDescEn: string;
    aboutDescBn: string;
  };
  onSaveSettings: (settings: any) => Promise<void>;
  savingSettings: boolean;
}

export default function SettingsManager({
  initialSettings,
  onSaveSettings,
  savingSettings
}: SettingsManagerProps) {
  const [captchaEnabled, setCaptchaEnabled] = React.useState(initialSettings.captchaEnabled);
  const [captchaKey, setCaptchaKey] = React.useState(initialSettings.captchaKey);
  
  const [aboutTitle1En, setAboutTitle1En] = React.useState(initialSettings.aboutTitle1En);
  const [aboutTitle1Bn, setAboutTitle1Bn] = React.useState(initialSettings.aboutTitle1Bn);
  const [aboutTitle2En, setAboutTitle2En] = React.useState(initialSettings.aboutTitle2En);
  const [aboutTitle2Bn, setAboutTitle2Bn] = React.useState(initialSettings.aboutTitle2Bn);
  const [aboutDescEn, setAboutDescEn] = React.useState(initialSettings.aboutDescEn);
  const [aboutDescBn, setAboutDescBn] = React.useState(initialSettings.aboutDescBn);

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
      captchaKey,
      aboutTitle1En,
      aboutTitle1Bn,
      aboutTitle2En,
      aboutTitle2Bn,
      aboutDescEn,
      aboutDescBn
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
          Portal Configurations
        </h1>
        <p className="text-slate-555 font-semibold text-sm">
          Manage system parameters, anti-spam validation settings, and page translation configurations.
        </p>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl flex items-start gap-2.5 shadow-sm max-w-xl">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Anti-Spam prevention block */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
          <h3 className="font-black text-slate-900 uppercase tracking-tight text-md pb-3 border-b border-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary animate-pulse" /> Spam Prevention Settings
          </h3>

          {/* Captcha Status */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Contact Form Captcha</label>
            <select
              value={captchaEnabled ? 'true' : 'false'}
              onChange={(e) => setCaptchaEnabled(e.target.value === 'true')}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 cursor-pointer animate-duration-300"
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
          </div>
        </div>

        {/* Corporate Story Details section */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-8 shadow-sm">
          <h3 className="font-black text-slate-900 uppercase tracking-tight text-md pb-3 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Corporate Story Configurations (En/Bn)
          </h3>

          {/* English Translations Block */}
          <div className="space-y-6">
            <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest border-l-2 border-primary pl-3">
              English Content (EN)
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Title Segment 1 (EN)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A Quarter-Century of"
                  value={aboutTitle1En}
                  onChange={(e) => setAboutTitle1En(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Title Segment 2 (EN)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Excellence"
                  value={aboutTitle2En}
                  onChange={(e) => setAboutTitle2En(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Description Details (EN)</label>
              <textarea
                required
                rows={6}
                placeholder="Write the English corporate story description paragraphs here. Separate paragraphs with double newlines..."
                value={aboutDescEn}
                onChange={(e) => setAboutDescEn(e.target.value)}
                className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 leading-relaxed resize-y font-mono"
              />
            </div>
          </div>

          {/* Bangla Translations Block */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest border-l-2 border-primary pl-3">
              Bangla Content (BN)
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Title Segment 1 (BN)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. একটি সিকি শতাব্দী ধরে"
                  value={aboutTitle1Bn}
                  onChange={(e) => setAboutTitle1Bn(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Title Segment 2 (BN)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. শিল্পগত শ্রেষ্ঠত্ব"
                  value={aboutTitle2Bn}
                  onChange={(e) => setAboutTitle2Bn(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Description Details (BN)</label>
              <textarea
                required
                rows={6}
                placeholder="বাংলায় কর্পোরেট ইতিহাস বিবরণ লিখুন..."
                value={aboutDescBn}
                onChange={(e) => setAboutDescBn(e.target.value)}
                className="w-full bg-slate-55 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-semibold text-sm text-slate-700 leading-relaxed resize-y font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="max-w-xl">
          <button
            type="submit"
            disabled={savingSettings}
            className="w-full bg-slate-900 text-white font-bold py-4.5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg disabled:opacity-85"
          >
            {savingSettings ? (
              <>
                <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating configurations...
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
