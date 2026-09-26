import { useState } from 'react';
import { useStore } from '@/store';
import { books, shelves, getBookAvailability, getAvailabilityBadge } from '@/data';
import { BookCover } from '@/components/BookCover';
import { LibraryMap } from '@/components/LibraryMap';
import { Star, MapPin, Heart, ArrowRight, Repeat2, BookOpen, Calendar, Building2, Hash, Library, FileText, Navigation } from 'lucide-react';

export function BookDetailPage({ bookId }: { bookId: string }) {
  const { navigate, toggleWishlist, isWishlisted, borrowBook, reserveBook, setHighlightedShelfId, currentUser, pushToast } = useStore();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="font-display font-bold text-white text-xl mb-2">Book not found</h2>
          <button onClick={() => navigate({ name: 'explore' })} className="btn-primary">Back to Explore</button>
        </div>
      </div>
    );
  }

  const shelf = shelves.find((s) => s.id === book.shelfId);
  const av = getBookAvailability(book);
  const badge = getAvailabilityBadge(av);
  const wishlisted = isWishlisted(book.id);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const handleBorrow = () => {
    if (!currentUser) {
      pushToast('Please log in to borrow books', 'error');
      navigate({ name: 'login' });
      return;
    }
    setShowBorrowModal(true);
  };

  const confirmBorrow = () => {
    borrowBook(book.id);
    setShowBorrowModal(false);
  };

  const handleFindOnMap = () => {
    setHighlightedShelfId(book.shelfId);
    setShowMap(true);
  };

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate({ name: 'explore' })} className="hover:text-emerald-300 transition-colors">Explore</button>
          <span>/</span>
          <span className="text-emerald-200">{book.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: book cover + actions */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-6 flex flex-col items-center sticky top-20">
              <div className="relative mb-4">
                <BookCover book={book} size="xl" />
                <div className={`absolute -top-2 -right-2 ${badge.class} shadow-lg`}>{badge.label}</div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-lg font-bold text-white">{book.rating}</span>
                <span className="text-sm text-gray-400">/ 5.0</span>
              </div>

              <div className="w-full space-y-2">
                {(av === 'available' || av === 'few') ? (
                  <button onClick={handleBorrow} className="btn-primary w-full flex items-center justify-center gap-2">
                    <BookOpen className="w-5 h-5" /> Borrow Book
                  </button>
                ) : (
                  <button onClick={() => reserveBook(book.id)} className="btn-primary w-full flex items-center justify-center gap-2 bg-sky-600/40">
                    Reserve Book
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleWishlist(book.id)}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${wishlisted ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'glass-light text-gray-200 hover:bg-emerald-500/15'}`}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-400 animate-heart-beat' : ''}`} />
                    {wishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                  <button onClick={() => navigate({ name: 'exchange' })} className="px-4 py-2.5 rounded-xl glass-light text-gray-200 hover:bg-emerald-500/15 text-sm font-semibold transition-all flex items-center justify-center gap-1.5">
                    <Repeat2 className="w-4 h-4" /> Exchange
                  </button>
                </div>
                <button onClick={handleFindOnMap} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5" /> Find on Map
                </button>
              </div>

              <div className="w-full mt-4 pt-4 border-t border-emerald-500/15 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Total Copies</span><span className="text-white font-semibold">{book.totalCopies}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Available</span><span className="text-emerald-300 font-semibold">{book.availableCopies}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Borrowed</span><span className="text-amber-300 font-semibold">{book.totalCopies - book.availableCopies}</span></div>
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={badge.class}>{badge.label}</span>
                <span className="badge-gray">{book.genre}</span>
                <span className="badge-gray">{book.department}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">{book.title}</h1>
              <p className="text-lg text-gray-400">by {book.author}</p>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-semibold text-emerald-100 mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{book.description}</p>
            </div>

            {/* Details grid */}
            <div className="glass-card rounded-2xl p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'ISBN', value: book.isbn, icon: Hash },
                { label: 'Publisher', value: book.publisher, icon: Building2 },
                { label: 'Publication Year', value: String(book.year), icon: Calendar },
                { label: 'Pages', value: String(book.pages), icon: FileText },
                { label: 'Language', value: book.language, icon: FileText },
                { label: 'Book ID', value: book.id, icon: Hash },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-1"><item.icon className="w-3 h-3" />{item.label}</p>
                  <p className="text-sm text-white font-medium">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-display font-semibold text-emerald-100 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" /> Location
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">You can find this book at:</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-200 text-sm font-semibold border border-emerald-500/20">Floor {book.floor}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-500/50" />
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-200 text-sm font-semibold border border-emerald-500/20">{shelf?.section ?? 'Unknown'}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-500/50" />
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-200 text-sm font-semibold border border-emerald-500/20">Shelf {book.shelfId}</span>
                  </div>
                </div>
                <button onClick={() => { setHighlightedShelfId(book.shelfId); navigate({ name: 'map' }); }} className="btn-secondary text-sm flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" /> Open Map
                </button>
              </div>

              {showMap && (
                <div className="animate-slide-up">
                  <LibraryMap compact highlightShelfId={book.shelfId} showRoute routeShelfId={book.shelfId} />
                </div>
              )}
            </div>

            {/* Related books */}
            <div>
              <h3 className="font-display font-semibold text-emerald-100 mb-3">Similar Books</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {books.filter((b) => b.genre === book.genre && b.id !== book.id).slice(0, 4).map((b) => (
                  <button key={b.id} onClick={() => navigate({ name: 'book', bookId: b.id })} className="glass-card rounded-xl p-3 card-hover text-left">
                    <BookCover book={b} size="sm" />
                    <p className="text-xs font-semibold text-white mt-2 line-clamp-2">{b.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{b.author}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow modal */}
      {showBorrowModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowBorrowModal(false)}>
          <div className="glass-card rounded-3xl p-6 max-w-md w-full animate-scale-in border-2 border-emerald-500/30" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-white text-xl mb-4">Confirm Borrow</h3>
            <div className="space-y-3 mb-5">
              <div className="flex gap-3 items-center">
                <BookCover book={book} size="sm" />
                <div>
                  <p className="font-semibold text-white">{book.title}</p>
                  <p className="text-sm text-gray-400">{book.author}</p>
                  <p className="text-xs text-gray-500">{book.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="glass-light rounded-xl p-3">
                  <p className="text-xs text-gray-400">Borrow Date</p>
                  <p className="text-white font-semibold">{new Date().toISOString().split('T')[0]}</p>
                </div>
                <div className="glass-light rounded-xl p-3">
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className="text-emerald-300 font-semibold">{dueDate.toISOString().split('T')[0]}</p>
                </div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Library Rules:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Return within 14 days to avoid overdue fines</li>
                  <li>• Maximum 5 books per member</li>
                  <li>• Handle books with care</li>
                  <li>• Return to the designated return area</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowBorrowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={confirmBorrow} className="btn-primary flex-1">Confirm Borrow</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
