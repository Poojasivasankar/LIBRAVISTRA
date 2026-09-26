import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import { books } from '@/data';
import { BookCover } from '@/components/BookCover';
import { Clock, Calendar, Check, AlertTriangle, RotateCcw, Filter, BookOpen } from 'lucide-react';

export function HistoryPage() {
  const { currentUser, borrowRecords, returnBook, navigate } = useStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'returned' | 'overdue'>('all');
  const [genreFilter, setGenreFilter] = useState('all');

  if (!currentUser) {
    return (<div className="pt-16 min-h-screen flex items-center justify-center"><div className="text-center"><BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" /><h2 className="font-display font-bold text-white text-xl mb-2">Please log in</h2><button onClick={() => navigate({ name: 'login' })} className="btn-primary">Login</button></div></div>);
  }

  const myRecords = borrowRecords.filter((r) => r.userId === currentUser.id);
  const genres = useMemo(() => [...new Set(myRecords.map((r) => books.find((b) => b.id === r.bookId)?.genre).filter(Boolean))] as string[], [myRecords]);
  const filtered = myRecords.filter((r) => { if (filter !== 'all' && r.status !== filter) return false; if (genreFilter !== 'all') { const book = books.find((b) => b.id === r.bookId); if (book?.genre !== genreFilter) return false; } return true; });
  const today = new Date('2026-09-26');

  const statusBadge = (status: string, dueDate: string) => {
    const due = new Date(dueDate); const isOverdue = status !== 'returned' && due < today;
    if (status === 'returned') return <span className="badge-green"><Check className="w-3 h-3" /> Returned</span>;
    if (isOverdue || status === 'overdue') { const days = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)); return <span className="badge-red"><AlertTriangle className="w-3 h-3" /> {days} days overdue</span>; }
    return <span className="badge-blue"><Clock className="w-3 h-3" /> Active</span>;
  };

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center"><Clock className="w-6 h-6 text-emerald-400" /></div><div><h1 className="section-title">Borrowing History</h1><p className="text-gray-400">{myRecords.length} total records</p></div></div>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-emerald-300" /><select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="input-field text-sm py-2 w-auto"><option value="all" className="bg-forest-800">All Status</option><option value="active" className="bg-forest-800">Active</option><option value="returned" className="bg-forest-800">Returned</option><option value="overdue" className="bg-forest-800">Overdue</option></select></div>
          <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="input-field text-sm py-2 w-auto"><option value="all" className="bg-forest-800">All Genres</option>{genres.map((g) => <option key={g} value={g} className="bg-forest-800">{g}</option>)}</select>
        </div>
        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center"><Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" /><h3 className="font-display font-bold text-white text-lg mb-2">No records found</h3><p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p><button onClick={() => { setFilter('all'); setGenreFilter('all'); }} className="btn-secondary">Clear filters</button></div>
        ) : (
          <div className="space-y-3">
            {filtered.map((record) => { const book = books.find((b) => b.id === record.bookId); if (!book) return null; return (
              <div key={record.id} className="glass-card rounded-2xl p-4 card-hover">
                <div className="flex items-center gap-4 flex-wrap">
                  <BookCover book={book} size="sm" />
                  <div className="flex-1 min-w-0">
                    <button onClick={() => navigate({ name: 'book', bookId: book.id })} className="text-left"><p className="font-display font-bold text-white line-clamp-1">{book.title}</p><p className="text-sm text-gray-400">{book.author}</p></button>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs"><span className="flex items-center gap-1 text-gray-400"><Calendar className="w-3 h-3" /> Borrowed: {record.borrowDate}</span><span className="flex items-center gap-1 text-gray-400"><Calendar className="w-3 h-3" /> Due: {record.dueDate}</span>{record.returnDate && <span className="flex items-center gap-1 text-emerald-300"><Check className="w-3 h-3" /> Returned: {record.returnDate}</span>}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">{statusBadge(record.status, record.dueDate)}{(record.status === 'active' || record.status === 'overdue') && <button onClick={() => returnBook(record.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-xs font-semibold transition-all flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Return</button>}</div>
                </div>
              </div>
            ); })}
          </div>
        )}
      </div>
    </div>
  );
}
