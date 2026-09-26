import type { Book } from '@/types';

interface Props {
  book: Book;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function BookCover({ book, size = 'md' }: Props) {
  const dims = {
    sm: 'w-20 h-28',
    md: 'w-32 h-44',
    lg: 'w-44 h-64',
    xl: 'w-56 h-80',
  };

  const fontSize = {
    sm: 'text-[8px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  const titleSize = {
    sm: 'text-[10px]',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div
      className={`${dims[size]} rounded-lg overflow-hidden shrink-0 relative shadow-lg transition-all duration-300`}
      style={{
        background: `linear-gradient(135deg, ${book.coverColor} 0%, ${book.coverColor}dd 60%, ${book.coverColor}aa 100%)`,
      }}
    >
      {/* Spine effect */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/20" />
      <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/10" />

      {/* Decorative accent bar */}
      <div
        className="absolute top-0 left-3 right-0 h-1"
        style={{ background: book.coverAccent }}
      />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${book.coverAccent} 0, ${book.coverAccent} 1px, transparent 1px, transparent 8px)`,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col p-2.5 pl-4">
        <div className="flex-1 flex flex-col justify-center">
          <div className={`${titleSize[size]} font-display font-bold text-white leading-tight line-clamp-3 mb-1`}>
            {book.title}
          </div>
          <div className={`${fontSize[size]} text-white/60 font-medium line-clamp-1`}>
            {book.author}
          </div>
        </div>
        <div className="flex items-center gap-1 mt-auto">
          <div className="w-4 h-0.5 rounded-full" style={{ background: book.coverAccent }} />
          <span className={`${fontSize[size]} text-white/40`}>{book.year}</span>
        </div>
      </div>

      {/* Gloss effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
