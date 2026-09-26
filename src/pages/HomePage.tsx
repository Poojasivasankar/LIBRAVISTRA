import { useState } from 'react';
import { useStore } from '@/store';
import { LibraryMap } from '@/components/LibraryMap';
import { BookCard } from '@/components/BookCard';
import { books, shelves, departments, categories } from '@/data';
import { Search, MapPin, BookOpen, Users, Library, TrendingUp, ArrowRight, Sparkles, ScanLine, QrCode, Compass } from 'lucide-react';

export function HomePage() {
  const { navigate, searchQuery, setSearchQuery } = useStore();
  const [localSearch, setLocalSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const stats = [
    { label: 'Total Books', value: books.length * 12, icon: BookOpen, color: 'text-emerald-300' },
    { label: 'Available Now', value: books.filter((b) => b.availableCopies > 0).length * 8, icon: Library, color: 'text-emerald-200' },
    { label: 'Active Members', value: 1247, icon: Users, color: 'text-emerald-300' },
    { label: 'Shelves', value: shelves.length, icon: MapPin, color: 'text-emerald-200' },
    { label: 'Currently Borrowed', value: 89, icon: TrendingUp, color: 'text-amber-300' },
  ];

  const popularBooks = books.slice(0, 6);
  const recommendedBooks = books.filter((b) => b.genre === 'Computer Science').slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigate({ name: 'explore' });
  };

  const handleSearchInput = (val: string) => {
    setLocalSearch(val);
    if (val.length > 1) {
      const matches = books
        .filter((b) => b.title.toLowerCase().includes(val.toLowerCase()) || b.author.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5)
        .map((b) => b.title);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="pt-16 animate-fade-in">
      {/* Hero section with map */}
      <section className="relative max-w-[1400px] mx-auto px-4 lg:px-6 pt-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: headline + search */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light text-xs text-emerald-200 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Digital + Physical Library
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
              Find the Book. <br />
              Find the Shelf. <br />
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">Find Your Way.</span>
            </h1>

            <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
              Discover books, locate them inside the library, check availability, borrow smarter, and explore your library through an interactive digital map.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate({ name: 'map' })} className="btn-primary flex items-center gap-2">
                <Compass className="w-5 h-5" /> Explore Library
              </button>
              <button onClick={() => navigate({ name: 'explore' })} className="btn-secondary flex items-center gap-2">
                <Search className="w-5 h-5" /> Search Books
              </button>
            </div>

            {/* Smart search */}
            <div className="relative max-w-lg">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl glass-card border border-emerald-500/20 focus-within:border-emerald-400/50 transition-all">
                  <Search className="w-5 h-5 text-emerald-300" />
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    placeholder="Search books, authors, subjects or ISBN..."
                    className="bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none flex-1 text-sm"
                  />
                  <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 text-sm font-semibold transition-all">
                    Search
                  </button>
                </div>
              </form>
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full glass-card rounded-2xl p-2 animate-scale-in z-20 border border-emerald-500/20">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSearchQuery(s); navigate({ name: 'explore' }); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-500/15 text-sm text-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5 text-emerald-400" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: interactive map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Interactive Library Map
              </h2>
              <button onClick={() => navigate({ name: 'map' })} className="text-xs text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1">
                Full map <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <LibraryMap compact />
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><ScanLine className="w-3.5 h-3.5 text-emerald-400" /> Scan entry barcode</span>
              <span className="flex items-center gap-1"><QrCode className="w-3.5 h-3.5 text-emerald-400" /> Scan shelf QR</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> Find any shelf</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-10">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 text-center card-hover">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className="font-display text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories preview */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Explore Categories</h2>
          <button onClick={() => navigate({ name: 'categories' })} className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSearchQuery(cat.name); navigate({ name: 'explore' }); }}
              className="glass-card rounded-2xl p-4 card-hover text-center group"
            >
              <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${cat.color}30`, border: `1px solid ${cat.color}40` }}>
                <BookOpen className="w-5 h-5" style={{ color: cat.color }} />
              </div>
              <p className="text-xs font-semibold text-gray-200 group-hover:text-emerald-200 transition-colors">{cat.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{cat.bookCount} books</p>
            </button>
          ))}
        </div>
      </section>

      {/* Popular books */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Popular Books</h2>
          <button onClick={() => navigate({ name: 'explore' })} className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <div className="glass-card rounded-3xl p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="section-title">Recommended For You</h2>
              <p className="text-sm text-gray-400">Because you explored Computer Science and Data Science</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <h2 className="section-title mb-6">Departments</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => { setSearchQuery(dept.name); navigate({ name: 'explore' }); }}
              className="glass-card rounded-2xl p-4 card-hover text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-lg" style={{ color: dept.color }}>{dept.shortName}</span>
                <span className="text-xs text-gray-500">{dept.shelfCount} shelves</span>
              </div>
              <p className="text-sm font-semibold text-gray-200 group-hover:text-emerald-200 transition-colors">{dept.name}</p>
              <p className="text-xs text-gray-500 mt-1">{dept.bookCount} books · {dept.availableCount} available</p>
            </button>
          ))}
        </div>
      </section>

      {/* Student journey */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12">
        <div className="glass-card rounded-3xl p-6 lg:p-10">
          <h2 className="section-title mb-2">Your Library Journey</h2>
          <p className="text-gray-400 mb-8">From discovery to return — a smarter way to borrow.</p>
          <div className="flex flex-wrap items-center gap-3">
            {['Landing Page', 'Interactive Map', 'Search Book', 'Book Details', 'Find on Map', 'Locate Shelf', 'Scan QR', 'Borrow Book', 'View Due Date', 'Return Book'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <div className="px-4 py-2.5 rounded-xl glass-light text-sm text-emerald-100 font-medium border border-emerald-500/15 hover:border-emerald-400/30 transition-all">
                  <span className="text-emerald-400 font-bold mr-1.5">{i + 1}</span>
                  {step}
                </div>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-emerald-500/40" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
