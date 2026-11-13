import React from 'react';
import { Link } from 'react-router-dom';
import { FolderTree, ExternalLink, Sparkles } from 'lucide-react';
import { categories } from '../../data/categories';
import { useStore } from '../../context/StoreContext';

export const AdminCategoriesPage = () => {
  const { productsList } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Handmade Product Categories
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review the 7 official craft categories configured for Loop &amp; Love.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => {
          const count = productsList.filter(p => p.category === cat.slug).length;
          return (
            <div key={cat.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">0{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                    {count} active {count === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
                <p className="text-[11px] text-brand-700 font-medium italic">&ldquo;{cat.tagline}&rdquo;</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">/shop/{cat.slug}</span>
                <Link
                  to={`/shop/${cat.slug}`}
                  target="_blank"
                  className="text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 font-semibold"
                >
                  <span>Preview Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

