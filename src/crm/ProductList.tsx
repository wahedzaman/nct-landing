import React from 'react';
import { Package, Plus, Trash2, Edit2, CheckCircle, XCircle, Award } from 'lucide-react';

interface ProductListProps {
  products: any[];
  loadingProducts: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: any) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductList({
  products,
  loadingProducts,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}: ProductListProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Product Catalog
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Manage power tool accessories showcased in the homepage gallery and featured highlights section.
          </p>
        </div>
        <button
          onClick={onAddProduct}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-primary/20 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loadingProducts ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Syncing database...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[32px] p-16 text-center shadow-sm">
          <Package className="w-12 h-12 text-slate-350 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">No Products Configured</h3>
          <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto mb-6 leading-relaxed">
            Create your first industrial tool or power accessory to showcase on the front-end page.
          </p>
          <button
            onClick={onAddProduct}
            className="inline-block bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            Create Product Card
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <th className="py-5 px-8">Image & Product Model</th>
                  <th className="py-5 px-6">Category</th>
                  <th className="py-5 px-6">Bullets Count</th>
                  <th className="py-5 px-6">Featured</th>
                  <th className="py-5 px-6">Active Status</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 shrink-0 select-none overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="font-bold text-slate-900 uppercase truncate max-w-[200px]" title={item.title}>
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-slate-505">
                      {item.category}
                    </td>
                    <td className="py-5 px-6 text-xs text-slate-400 font-mono">
                      {Array.isArray(item.features) ? item.features.length : 0} items
                    </td>
                    <td className="py-5 px-6">
                      {item.is_featured ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          <Award className="w-3 h-3 shrink-0" /> Featured
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal text-xs">-</span>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 border border-green-200 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3 shrink-0" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-0.5 border border-slate-200 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          <XCircle className="w-3 h-3 shrink-0" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditProduct(item)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 hover:border-primary/20 rounded-xl transition-all cursor-pointer border border-transparent"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(item.id)}
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
    </div>
  );
}
