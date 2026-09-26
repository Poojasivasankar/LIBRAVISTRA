import { useState } from 'react';
import { useStore } from '@/store';
import { LibraryMap } from '@/components/LibraryMap';
import { shelves, books } from '@/data';
import { Search, MapPin, BookOpen, QrCode, Navigation, X } from 'lucide-react';
import type { Shelf } from '@/types';

export function MapPage() {
  const { navigate, setHighlightedShelfId, highlightedShelfId } = useStore();
  const [search, setSearch] = useState('');
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [routeShelfId, setRouteShelfId] = useState<string | null>(null);

  const filteredShelves = search
    ? shelves.filter((s) => s.id.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()) || s.department.toLowerCase().includes(search.toLowerCase()))
    : shelves;

  const handleShelfClick = (shelf: Shelf) => {
    setSelectedShelf(shelf);
    setHighlightedShelfId(shelf.id);
  };

  const shelfBooks = selectedShelf ? books.filter((b) => b.shelfId === selectedShelf.id) : [];

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <h1 className="section-title mb-2">Library Map</h1>
        <p className="text-gray-400 mb-6">Explore the physical library layout. Click any shelf to see books, availability, and QR code.</p>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar: shelf list */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-light border border-emerald-500/15 mb-3">
                <Search className="w-4 h-4 text-emerald-300" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shelves..."
                  className="bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none w-full"
                />
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
                {filteredShelves.map((shelf) => (
                  <button
                    key={shelf.id}
                    onClick={() => handleShelfClick(shelf)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${selectedShelf?.id === shelf.id || highlightedShelfId === shelf.id ? 'bg-emerald-500/20 border-emerald-400/40' : 'glass-light border-transparent hover:border-emerald-500/20'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-white text-sm">{shelf.id}</span>
                      <span className="text-xs text-emerald-300">{shelf.availableCount}/{shelf.bookCount}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{shelf.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{shelf.department} · Floor {shelf.floor}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 space-y-4">
            <LibraryMap
              highlightShelfId={highlightedShelfId}
              onShelfClick={handleShelfClick}
              showRoute={!!routeShelfId}
              routeShelfId={routeShelfId}
            />

            {/* Selected shelf details */}
            {selectedShelf && (
              <div className="glass-card rounded-2xl p-5 animate-slide-up">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">{selectedShelf.id} — {selectedShelf.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                      <MapPin className="w-3.5 h-3.5" /> Floor {selectedShelf.floor} · {selectedShelf.section} · {selectedShelf.department}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setRouteShelfId(selectedShelf.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-xs font-semibold transition-all flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" /> Show Route
                    </button>
                    <button onClick={() => navigate({ name: 'shelf', shelfId: selectedShelf.id })} className="px-3 py-1.5 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-100 text-xs font-semibold transition-all flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> View Books
                    </button>
                  </div>
                </div>

                {/* Route visualization */}
                {routeShelfId === selectedShelf.id && (
                  <div className="flex items-center gap-2 mb-4 flex-wrap text-sm">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-200 font-semibold border border-emerald-500/20">Entrance</span>
                    <span className="text-emerald-500/50">↓</span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-200 font-semibold border border-emerald-500/20">Main Hall</span>
                    <span className="text-emerald-500/50">↓</span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-200 font-semibold border border-emerald-500/20">{selectedShelf.section}</span>
                    <span className="text-emerald-500/50">↓</span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-400/20 text-emerald-100 font-semibold border border-emerald-400/40">Shelf {selectedShelf.id}</span>
                    <span className="text-emerald-500/50">↓</span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-400/20 text-emerald-100 font-semibold border border-emerald-400/40">Book</span>
                  </div>
                )}

                {/* Books on this shelf */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {shelfBooks.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => navigate({ name: 'book', bookId: book.id })}
                      className="flex items-center gap-3 p-3 rounded-xl glass-light hover:bg-emerald-500/15 transition-all text-left"
                    >
                      <div className="w-8 h-11 rounded shrink-0" style={{ background: book.coverColor }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white line-clamp-1">{book.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{book.author}</p>
                      </div>
                      <span className={`badge ${book.availableCopies > 0 ? 'badge-green' : 'badge-red'} text-[9px] shrink-0`}>
                        {book.availableCopies > 0 ? 'Available' : 'Borrowed'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
