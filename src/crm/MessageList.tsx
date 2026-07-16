import React from 'react';
import { Mail, Phone, Building, Trash2, Calendar, Clock, Eye, AlertCircle } from 'lucide-react';

interface MessageListProps {
  messages: any[];
  loadingMessages: boolean;
  onDeleteMessage: (id: string) => void;
}

export default function MessageList({
  messages,
  loadingMessages,
  onDeleteMessage
}: MessageListProps) {
  const [selectedMessage, setSelectedMessage] = React.useState<any>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
          Inquiries & Messages
        </h1>
        <p className="text-slate-500 font-semibold text-sm">
          Review and manage user submission requests from the corporate contact form.
        </p>
      </div>

      {loadingMessages ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Syncing database...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[32px] p-16 text-center shadow-sm">
          <Mail className="w-12 h-12 text-slate-350 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">No Inquiries Found</h3>
          <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto mb-6 leading-relaxed">
            Your Supabase `contact_messages` table has no records yet.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="py-5 px-8">Sender Details</th>
                  <th className="py-5 px-6">Inquiry Type</th>
                  <th className="py-5 px-6">Message Excerpt</th>
                  <th className="py-5 px-6">Submitted At</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {messages.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-8 max-w-xs">
                      <div className="space-y-1 font-semibold text-slate-900">
                        <p className="font-bold">{item.name}</p>
                        {item.company && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" /> {item.company}
                          </p>
                        )}
                        {(item.email || item.phone) && (
                          <div className="text-[11px] text-slate-450 space-y-0.5 pt-0.5">
                            {item.email && <p className="font-mono">{item.email}</p>}
                            {item.phone && <p>{item.phone}</p>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-655 text-[9px] font-bold uppercase tracking-widest rounded-full border border-slate-200/60">
                        {item.inquiry_type}
                      </span>
                    </td>
                    <td className="py-6 px-6 max-w-xs truncate text-slate-500 text-xs">
                      {item.message}
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col gap-0.5 text-xs text-slate-800 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono pl-4.5">
                          {new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedMessage(item)}
                          title="View Message"
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 rounded-xl transition-all cursor-pointer border border-transparent"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteMessage(item.id)}
                          title="Delete Record"
                          className="p-2 text-slate-400 hover:text-red-655 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all cursor-pointer border border-transparent"
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

      {/* Modal Dialog overlay for details viewing */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[32px] max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8.5px] font-black uppercase tracking-wider rounded border border-primary/20">
                  {selectedMessage.inquiry_type}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedMessage.name}</h3>
                <p className="text-xs text-slate-450 font-semibold mt-0.5">
                  Submitted at: {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="border-t border-b border-slate-100 py-4 space-y-3.5 text-sm font-semibold text-slate-700">
              {selectedMessage.company && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Company: <span className="text-slate-900">{selectedMessage.company}</span></span>
                </div>
              )}
              {selectedMessage.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Email: <span className="text-slate-900 font-mono select-all">{selectedMessage.email}</span></span>
                </div>
              )}
              {selectedMessage.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Phone: <span className="text-slate-900 select-all">{selectedMessage.phone}</span></span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-450">Message Details</label>
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-slate-700 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedMessage(null)}
                className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
