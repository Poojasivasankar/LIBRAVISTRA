import { useStore } from '@/store';
import { books, getBookAvailability, getAvailabilityBadge } from '@/data';
import { BookCover } from '@/components/BookCover';
import { Heart, BookOpen, Bell, X, Search } from 'lucide-react';
import { useState } from 'react';

export function WishlistPage() {
  const { wishlist, toggleWishlist, navigate, borrowBook, notifyMe, currentUser } = useStore();
  const [search, setSearch] = useState('');

  const wishlistBooks = books.filter((b) => wishlist.includes(b.id));
  const filtered = search ? wishlistBooks.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())) : wishlistBooks;

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-400 fill-red-400" />
          </div>
          <div>
            <h1 className="section-title">My Wishlist</h1>
            <p className="text-gray-400">{wishlistBooks.length} books saved</p>
          </div>
        </div>

        {wishlistBooks.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center">
            <Heart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="font-display font-bold text-white text-lg mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400 text-sm mb-4">Tap the heart icon on any book to save it here</p>
            <button onClick={() => navigate({ name: 'explore' })} className="btn-primary">Explore Books</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl glass-card border border-emerald-500/20 mb-6 max-w-md">
              <Search className="w-4 h-4 text-emerald-300" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search wishlist..."
                className="bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none flex-1 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((book) => {
                const av = getBookAvailability(book);
                const badge = getAvailabilityBadge(av);
                return (
                  <div key={book.id} className="glass-card rounded-2xl p-4 card-hover">
                    <div className="flex gap-3">
                      <div className="relative cursor-pointer" onClick={() => navigate({ name: 'book', bookId: book.id })}>
                        <BookCover book={book} size="sm" />
                        <div className={`absolute -top-1 -right-1 ${badge.class} text-[9px]`}>{badge.label}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <button onClick={() => navigate({ name: 'book', bookId: book.id })} className="text-left">
                          <h3 className="font-display font-bold text-white text-sm line-clamp-2">{book.title}</h3>
                        </button>
                        <p className="text-xs text-gray-400 mt-1">{book.author}</p>
                        <p className="text-xs text-gray-500 mt-1">{book.shelfId} · Floor {book.floor}</p>
                      </div>
                      <button onClick={() => toggleWishlist(book.id)} className="shrink-0 w-8 h-8 rounded-lg glass-light flex items-center justify-center hover:scale-110 transition-all">
                        <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {(av === 'available' || av === 'few') ? (
                        <button onClick={() => { if (!currentUser) { navigate({ name: 'login' }); return; } borrowBook(book.id); }} className="flex-1 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-xs font-semibold transition-all flex items-center justify-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> Borrow
                        </button>
                      ) : (
                        <button onClick={() => notifyMe(book.id)} className="flex-1 px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 text-xs font-semibold transition-all flex items-center justify-center gap-1">
                          <Bell className="w-3.5 h-3.5" /> Notify Me
                        </button>
                      )}
                      <button onClick={() => toggleWishlist(book.id)} className="px-3 py-2 rounded-xl glass-light hover:bg-red-500/15 text-red-300 text-xs font-semibold transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
