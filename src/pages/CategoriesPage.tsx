import { useStore } from '@/store';
import { categories } from '@/data';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export function CategoriesPage() {
  const { navigate, setSearchQuery } = useStore();

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <h1 className="section-title mb-2">Categories</h1>
        <p className="text-gray-400 mb-8">Browse books by category</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = (Icons as Record<string, Icons.LucideIcon>)[cat.icon] ?? Icons.BookOpen;
            return (
              <button
                key={cat.id}
                onClick={() => { setSearchQuery(cat.name); navigate({ name: 'explore' }); }}
                className="glass-card rounded-3xl p-6 card-hover text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{ background: cat.color }} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${cat.color}25`, border: `1px solid ${cat.color}40` }}>
                  <Icon className="w-7 h-7" style={{ color: cat.color }} />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-1 group-hover:text-emerald-200 transition-colors">{cat.name}</h3>
                <p className="text-sm text-gray-400">{cat.bookCount} books available</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-emerald-300 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
