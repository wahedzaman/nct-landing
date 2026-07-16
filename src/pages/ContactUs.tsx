import React from 'react';
import { motion } from 'motion/react';
import { Globe, Mail, Phone, Clock, ArrowRight, ShieldCheck, MapPin, Building } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const STATIC_BRANCHES = [
  {
    name: "Global HQ (Americas)",
    address: "500 Industrial Avenue, Suite 1200, Chicago, IL 60611, USA",
    phone: "+1 (800) 555-TOOL (8665)",
    email: "chicago@ntc-global.com",
    hours: "Mon - Fri: 8:00 AM - 6:00 PM CST"
  },
  {
    name: "EMEA Operations",
    address: "88 Logistics Boulevard, Sector 4, London, EC1A 4HD, UK",
    phone: "+44 20 7946 0958",
    email: "london@ntc-global.com",
    hours: "Mon - Fri: 9:00 AM - 5:30 PM GMT"
  },
  {
    name: "APAC Distribution Hub",
    address: "12 Marina Boulevard, Level 38, Singapore 018982",
    phone: "+65 6789 0123",
    email: "singapore@ntc-global.com",
    hours: "Mon - Fri: 9:00 AM - 6:00 PM SGT"
  }
];

export default function ContactUs() {
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [branches, setBranches] = React.useState<any[]>(isSupabaseConfigured ? [] : STATIC_BRANCHES);
  const [loadingBranches, setLoadingBranches] = React.useState(isSupabaseConfigured);

  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      setBranches(STATIC_BRANCHES);
      setLoadingBranches(false);
      return;
    }

    const fetchBranches = async () => {
      setLoadingBranches(true);
      try {
        const { data, error } = await supabase!
          .from('branches')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setBranches(data || []);
      } catch (err) {
        console.error('Error fetching branches, falling back:', err);
        setBranches(STATIC_BRANCHES);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      setFormSubmitted(true);
    }, 1200);
  };

  return (
    <div className="pt-20 bg-white">
      {/* Hero Banner Section */}
      <section className="relative py-24 bg-slate-950 overflow-hidden text-white border-b border-slate-900">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-6 border border-primary/20">
              CONTACT US
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
              Connect With <span className="text-primary-light">Our Global Team</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Have a bulk order, custom OEM inquiry, or technical question? Reach out to your local regional office below or fill out the inquiry form.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Form and Info Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Address list & SVG Map visualizer */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-4">
                Branch Directory
              </h2>
              <p className="text-slate-500 font-semibold text-sm">
                Get in touch directly with our localized logistics, distributor support, or custom engineering desks.
              </p>
            </div>


            {/* Accordion/Card list of office contacts */}
            <div className="space-y-6">
              {loadingBranches ? (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Syncing branches...</p>
                </div>
              ) : branches.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 text-center text-slate-450 font-semibold text-sm">
                  <Building className="w-8 h-8 mx-auto mb-2 text-slate-350 animate-pulse animate-duration-1000" />
                  No active office locations configured.
                </div>
              ) : (
                branches.map((branch, idx) => (
                  <motion.div
                    key={branch.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-slate-50 border border-slate-200/60 rounded-3xl flex gap-5 shadow-sm group hover:border-slate-300 transition-all duration-300"
                  >
                    <div className="bg-white border border-slate-200/80 p-3 rounded-2xl h-fit shadow-sm text-primary">
                      <Building className="w-6 h-6" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">{branch.name}</h4>
                      <div className="space-y-2 text-slate-500 text-sm font-semibold">
                        <p className="flex items-start gap-2.5 leading-relaxed">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>{branch.address}</span>
                        </p>
                        <p className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{branch.phone}</span>
                        </p>
                        <p className="flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{branch.email}</span>
                        </p>
                        <p className="flex items-center gap-2.5 pt-1 text-xs text-slate-400 border-t border-slate-200/50">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{branch.hours}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Contact form card */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200/50 rounded-[32px] p-8 md:p-12 shadow-sm relative overflow-hidden">
            {/* Background glowing flare */}
            <div className="absolute -right-24 -top-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3.5xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                Send a Message
              </h3>
              <p className="text-slate-500 text-sm font-semibold mb-8">
                Complete the form below and our regional sales engineers will follow up with you.
              </p>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-6 shadow-md"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2">Message Sent Successfully!</h4>
                    <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto leading-relaxed">
                      Thank you for contacting NCT. An inquiry ticket has been created, and our engineering desk will reach out within 24 business hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="inline-block bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-semibold text-slate-800 placeholder:text-slate-350"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Company Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-semibold text-slate-800 placeholder:text-slate-350"
                        placeholder="Industrial Ltd."
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Work Email</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-semibold text-slate-800 placeholder:text-slate-350"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-semibold text-slate-800 placeholder:text-slate-350"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Inquiry Type</label>
                    <div className="relative">
                      <select className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-semibold text-slate-800 appearance-none cursor-pointer">
                        <option>Custom Accessory Manufacturing</option>
                        <option>Dealership Application</option>
                        <option>Bulk Sourcing Inquiry</option>
                        <option>Technical Product Support</option>
                        <option>General Corporate Inquiry</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message Details</label>
                    <textarea
                      rows={5}
                      required
                      className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm font-semibold text-slate-800 placeholder:text-slate-350 resize-none"
                      placeholder="Please details your product specifications, dimensional requirements, or inquiry parameters..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white font-bold py-4.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-slate-900/10 disabled:opacity-80"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Validating inquiry...
                      </span>
                    ) : (
                      <>
                        Submit Inquiry Request <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-medium">
                    * By submitting, you agree to our standard manufacturing review parameters.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
