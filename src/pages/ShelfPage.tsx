import { useState } from 'react';
import { useStore } from '@/store';
import { books, shelves, getBookAvailability, getAvailabilityBadge } from '@/data';
import { BookCover } from '@/components/BookCover';
import { QrCode, Search, BookOpen, Download, Printer, RefreshCw, ArrowRight, ScanLine } from 'lucide-react';

export function ShelfPage({ shelfId }: { shelfId: string }) {
  const { navigate, pushToast } = useStore();
  const [search, setSearch] = useState('');
  const [showQR, setShowQR] = useState(false);
  const shelf = shelves.find((s) => s.id === shelfId);

  if (!shelf) { return (<div className="pt-16 min-h-screen flex items-center justify-center"><div className="text-center"><BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" /><h2 className="font-display font-bold text-white text-xl mb-2">Shelf not found</h2><button onClick={() => navigate({ name: 'map' })} className="btn-primary">Back to Map</button></div></div>); }

  const shelfBooks = books.filter((b) => b.shelfId === shelf.id);
  const filtered = search ? shelfBooks.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())) : shelfBooks;
  const availableCount = shelfBooks.filter((b) => b.availableCopies > 0).length;
  const borrowedCount = shelfBooks.length - availableCount;

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6"><button onClick={() => navigate({ name: 'map' })} className="hover:text-emerald-300 transition-colors">Library Map</button><span>/</span><span className="text-emerald-200">Shelf {shelf.id}</span></div>
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2"><div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${shelf.color}25`, border: `1px solid ${shelf.color}40` }}><BookOpen className="w-6 h-6" style={{ color: shelf.color }} /></div><div><h1 className="font-display text-2xl font-bold text-white">{shelf.id}</h1><p className="text-sm text-gray-400">{shelf.name}</p></div></div>
              <div className="flex items-center gap-2 flex-wrap mt-2"><span className="badge-gray">{shelf.department}</span><span className="badge-gray">{shelf.genre}</span><span className="badge-gray">Floor {shelf.floor}</span><span className="badge-gray">{shelf.section}</span></div>
            </div>
            <div className="flex gap-2"><button onClick={() => setShowQR(!showQR)} className="btn-secondary text-sm flex items-center gap-2"><QrCode className="w-4 h-4" /> Show QR</button><button onClick={() => navigate({ name: 'map' })} className="btn-secondary text-sm flex items-center gap-2"><ArrowRight className="w-4 h-4" /> View on Map</button></div>
          </div>
          {showQR && (
            <div className="mt-4 pt-4 border-t border-emerald-500/15 animate-slide-up flex flex-col items-center">
              <div className="glass-light rounded-2xl p-4"><div className="grid grid-cols-12 gap-px w-40 h-40">{Array.from({ length: 144 }).map((_, i) => { const seed = (i * 7 + shelf.id.charCodeAt(0) * 13 + shelf.id.charCodeAt(1) * 3) % 3; return <div key={i} className={seed === 0 ? 'bg-white' : 'bg-transparent'} />; })}</div><div className="flex justify-between mt-2 text-[10px] text-gray-400"><span>{shelf.qrCode}</span><span className="font-mono">libravista.co/s/{shelf.id}</span></div></div>
              <div className="flex gap-2 mt-3"><button onClick={() => pushToast('QR code downloaded', 'success')} className="px-3 py-1.5 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-200 text-xs font-semibold transition-all flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Download</button><button onClick={() => pushToast('Sent to printer', 'info')} className="px-3 py-1.5 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-200 text-xs font-semibold transition-all flex items-center gap-1"><Printer className="w-3.5 h-3.5" /> Print</button><button onClick={() => pushToast('QR code regenerated', 'success')} className="px-3 py-1.5 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-200 text-xs font-semibold transition-all flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Regenerate</button></div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-emerald-500/15"><div className="text-center"><p className="font-display text-2xl font-bold text-white">{shelfBooks.length}</p><p className="text-xs text-gray-400">Total Books</p></div><div className="text-center"><p className="font-display text-2xl font-bold text-emerald-300">{availableCount}</p><p className="text-xs text-gray-400">Available</p></div><div className="text-center"><p className="font-display text-2xl font-bold text-amber-300">{borrowedCount}</p><p className="text-xs text-gray-400">Borrowed</p></div></div>
        </div>
        <div className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-3 flex-wrap text-sm">{['Scan', 'Search', 'Locate', 'Borrow'].map((step, i, arr) => (<div key={step} className="flex items-center gap-3"><span className="px-3 py-1.5 rounded-lg glass-light text-emerald-100 font-medium flex items-center gap-1.5"><ScanLine className="w-3.5 h-3.5" /> {step}</span>{i < arr.length - 1 && <span className="text-emerald-500/40">{'->'}</span>}</div>))}</div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl glass-card border border-emerald-500/20 mb-6 max-w-md"><Search className="w-4 h-4 text-emerald-300" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search within this shelf..." className="bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none flex-1 text-sm" /></div>
        {filtered.length === 0 ? (<div className="glass-card rounded-3xl p-12 text-center"><BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" /><h3 className="font-display font-bold text-white text-lg mb-2">No books found</h3><p className="text-gray-400 text-sm">Try a different search term</p></div>) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((book) => { const av = getBookAvailability(book); const badge = getAvailabilityBadge(av); return (
              <div key={book.id} className="glass-card rounded-2xl p-4 card-hover">
                <div className="flex gap-3"><div className="relative cursor-pointer" onClick={() => navigate({ name: 'book', bookId: book.id })}><BookCover book={book} size="sm" /><div className={`absolute -top-1 -right-1 ${badge.class} text-[9px]`}>{badge.label}</div></div><div className="flex-1 min-w-0"><button onClick={() => navigate({ name: 'book', bookId: book.id })} className="text-left"><p className="font-display font-bold text-white text-sm line-clamp-2">{book.title}</p></button><p className="text-xs text-gray-400 mt-1">{book.author}</p><p className="text-xs text-gray-500 mt-1">{book.isbn}</p><p className="text-xs mt-1"><span className="text-emerald-300">{book.availableCopies}</span><span className="text-gray-500">/{book.totalCopies} copies</span></p></div></div>
                <button onClick={() => navigate({ name: 'book', bookId: book.id })} className="w-full mt-3 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-xs font-semibold transition-all flex items-center justify-center gap-1">View Details <ArrowRight className="w-3 h-3" /></button>
              </div>
            );})}
          </div>
        )}
      </div>
    </div>
  );
}
