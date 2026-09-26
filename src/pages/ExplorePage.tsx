import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import { BookCard } from '@/components/BookCard';
import { books, departments } from '@/data';
import { Search, SlidersHorizontal, X, BookOpen } from 'lucide-react';

export function ExplorePage() {
  const { searchQuery, setSearchQuery } = useStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: 'all',
    department: 'all',
    availability: 'all',
    year: 'all',
    sort: 'relevance',
  });

  const genres = useMemo(() => [...new Set(books.map((b) => b.genre))], []);
  const years = useMemo(() => [...new Set(books.map((b) => b.year))].sort((a, b) => b - a), []);

  const filtered = useMemo(() => {
    let result = books;

    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q) ||
          b.genre.toLowerCase().includes(q) ||
          b.department.toLowerCase().includes(q) ||
          b.shelfId.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q),
      );
    }

    if (filters.genre !== 'all') result = result.filter((b) => b.genre === filters.genre);
    if (filters.department !== 'all') result = result.filter((b) => b.department === filters.department);
    if (filters.availability !== 'all') {
      result = result.filter((b) => {
        if (filters.availability === 'available') return b.availableCopies > 1;
        if (filters.availability === 'few') return b.availableCopies === 1;
        if (filters.availability === 'borrowed') return b.availableCopies === 0;
        return true;
      });
    }
    if (filters.year !== 'all') result = result.filter((b) => b.year === Number(filters.year));

    if (filters.sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    if (filters.sort === 'year') result = [...result].sort((a, b) => b.year - a.year);
    if (filters.sort === 'title') result = [...result].sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [localSearch, filters]);

  const popularSearches = ['Python', 'Machine Learning', 'Clean Code', 'Algorithms', 'Data Science', 'Engineering'];

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <h1 className="section-title mb-2">Explore Books</h1>
        <p className="text-gray-400 mb-6">Search through {books.length} books across {departments.length} departments</p>

        {/* Search bar */}
        <div className="relative mb-4">
          <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl glass-card border border-emerald-500/20 focus-within:border-emerald-400/50 transition-all">
            <Search className="w-5 h-5 text-emerald-300" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => { setLocalSearch(e.target.value); setSearchQuery(e.target.value); }}
              placeholder="Search books, authors, subjects or ISBN..."
              className="bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none flex-1 text-base"
              autoFocus
            />
            {localSearch && (
              <button onClick={() => { setLocalSearch(''); setSearchQuery(''); }} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${showFilters ? 'bg-emerald-500/30 text-emerald-100' : 'glass-light text-gray-300'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Popular searches */}
          {!localSearch && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Popular:</span>
              {popularSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => { setLocalSearch(s); setSearchQuery(s); }}
                  className="px-2.5 py-1 rounded-full glass-light text-xs text-emerald-200 hover:bg-emerald-500/20 transition-all border border-emerald-500/15"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="glass-card rounded-2xl p-4 mb-6 animate-slide-up grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Genre</label>
              <select value={filters.genre} onChange={(e) => setFilters({ ...filters, genre: e.target.value })} className="input-field text-sm py-2">
                <option value="all" className="bg-forest-800">All Genres</option>
                {genres.map((g) => <option key={g} value={g} className="bg-forest-800">{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Department</label>
              <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} className="input-field text-sm py-2">
                <option value="all" className="bg-forest-800">All Departments</option>
                {departments.map((d) => <option key={d.id} value={d.name} className="bg-forest-800">{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Availability</label>
              <select value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })} className="input-field text-sm py-2">
                <option value="all" className="bg-forest-800">All</option>
                <option value="available" className="bg-forest-800">Available</option>
                <option value="few" className="bg-forest-800">Few Copies</option>
                <option value="borrowed" className="bg-forest-800">Borrowed</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Year</label>
              <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} className="input-field text-sm py-2">
                <option value="all" className="bg-forest-800">All Years</option>
                {years.map((y) => <option key={y} value={y} className="bg-forest-800">{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Sort By</label>
              <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="input-field text-sm py-2">
                <option value="relevance" className="bg-forest-800">Relevance</option>
                <option value="rating" className="bg-forest-800">Rating</option>
                <option value="year" className="bg-forest-800">Year (Newest)</option>
                <option value="title" className="bg-forest-800">Title (A-Z)</option>
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            {filtered.length} {filtered.length === 1 ? 'book' : 'books'} found
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="font-display font-bold text-white text-lg mb-2">No books found</h3>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
            <button onClick={() => { setLocalSearch(''); setSearchQuery(''); setFilters({ genre: 'all', department: 'all', availability: 'all', year: 'all', sort: 'relevance' }); }} className="btn-secondary">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
