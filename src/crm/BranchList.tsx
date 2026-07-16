import React from 'react';
import { Plus, Edit2, Trash2, Building } from 'lucide-react';

interface BranchListProps {
  branches: any[];
  loadingBranches: boolean;
  onAddBranch: () => void;
  onEditBranch: (branch: any) => void;
  onDeleteBranch: (id: string) => void;
}

export default function BranchList({
  branches,
  loadingBranches,
  onAddBranch,
  onEditBranch,
  onDeleteBranch
}: BranchListProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Branches & Locations
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Manage NCT's global corporate offices, engineering desks, and localized logistics hubs.
          </p>
        </div>

        <button
          onClick={onAddBranch}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4.5 h-4.5" /> Add Location
        </button>
      </div>

      {/* List Board */}
      {loadingBranches ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Syncing database...</p>
        </div>
      ) : branches.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[32px] p-16 text-center shadow-sm">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">No Branch Locations Available</h3>
          <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto mb-6 leading-relaxed">
            Your Supabase `branches` table is empty. Click the button above to configure your first office location.
          </p>
          <button
            onClick={onAddBranch}
            className="inline-flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add First Branch
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="py-5 px-8">Location Title</th>
                  <th className="py-5 px-6">Address</th>
                  <th className="py-5 px-6">Contact info</th>
                  <th className="py-5 px-6">Office Hours</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {branches.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-8 max-w-xs truncate font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl text-primary border border-slate-200/50 shrink-0">
                          <Building className="w-4 h-4" />
                        </div>
                        <span onClick={() => onEditBranch(item)} className="cursor-pointer hover:text-primary transition-colors truncate">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6 max-w-xs truncate text-slate-500">
                      {item.address}
                    </td>
                    <td className="py-6 px-6 text-slate-650">
                      <div className="space-y-0.5 text-xs font-semibold">
                        <p className="truncate">{item.phone}</p>
                        <p className="text-slate-400 font-mono truncate">{item.email}</p>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-slate-500 max-w-xs truncate">
                      {item.hours}
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditBranch(item)}
                          title="Edit Location"
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 rounded-xl transition-all cursor-pointer border border-transparent"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteBranch(item.id)}
                          title="Delete Location"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all cursor-pointer border border-transparent"
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
