import { useStore } from '@/store';
import { getBookAvailability, getAvailabilityBadge } from '@/data';
import { BookCover } from './BookCover';
import { Heart, ArrowRight, Repeat2, MapPin, Star } from 'lucide-react';
import type { Book } from '@/types';

interface Props {
  book: Book;
  onFindOnMap?: (book: Book) => void;
}

export function BookCard({ book, onFindOnMap }: Props) {
  const { navigate, toggleWishlist, isWishlisted, borrowBook } = useStore();
  const av = getBookAvailability(book);
  const badge = getAvailabilityBadge(av);
  const wishlisted = isWishlisted(book.id);

  return (
    <div className="glass-card rounded-2xl p-4 card-hover group flex flex-col">
      <div className="flex gap-3">
        <div className="relative cursor-pointer" onClick={() => navigate({ name: 'book', bookId: book.id })}>
          <BookCover book={book} size="sm" />
          <div className={`absolute -top-1 -right-1 ${badge.class} text-[9px]`}>
            {badge.label}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <button onClick={() => navigate({ name: 'book', bookId: book.id })} className="text-left">
            <h3 className="font-display font-bold text-white text-sm leading-tight line-clamp-2 group-hover:text-emerald-200 transition-colors">
              {book.title}
            </h3>
          </button>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{book.author}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-300">{book.rating}</span>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-400">{book.genre}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{book.shelfId} · Floor {book.floor}</span>
          </div>
        </div>

        <button
          onClick={() => toggleWishlist(book.id)}
          className="shrink-0 w-8 h-8 rounded-lg glass-light flex items-center justify-center transition-all hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-all ${wishlisted ? 'text-red-400 fill-red-400 animate-heart-beat' : 'text-gray-400'}`}
          />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mt-3">
        {av === 'available' || av === 'few' ? (
          <button
            onClick={() => borrowBook(book.id)}
            className="flex-1 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-xs font-semibold transition-all flex items-center justify-center gap-1"
          >
            Borrow <ArrowRight className="w-3 h-3" />
          </button>
        ) : (
          <button
            onClick={() => navigate({ name: 'book', bookId: book.id })}
            className="flex-1 px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 text-xs font-semibold transition-all"
          >
            Notify Me
          </button>
        )}
        <button
          onClick={() => onFindOnMap?.(book) ?? navigate({ name: 'book', bookId: book.id })}
          className="px-3 py-2 rounded-xl glass-light hover:bg-emerald-500/15 text-emerald-200 text-xs font-semibold transition-all flex items-center gap-1"
        >
          <MapPin className="w-3 h-3" /> Map
        </button>
        <button
          onClick={() => navigate({ name: 'exchange' })}
          className="px-3 py-2 rounded-xl glass-light hover:bg-emerald-500/15 text-emerald-200 text-xs font-semibold transition-all"
        >
          <Repeat2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
