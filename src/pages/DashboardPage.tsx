import { useState } from 'react';
import { useStore } from '@/store';
import { books } from '@/data';
import { BookCover } from '@/components/BookCover';
import { LibraryMap } from '@/components/LibraryMap';
import { BookCard } from '@/components/BookCard';
import { BookOpen, Clock, AlertTriangle, Heart, ArrowRight, RotateCcw, Calendar, MapPin, Sparkles, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const { currentUser, borrowRecords, returnBook, navigate, wishlist } = useStore();
  const [showReturnModal, setShowReturnModal] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center"><BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" /><h2 className="font-display font-bold text-white text-xl mb-2">Please log in</h2><button onClick={() => navigate({ name: 'login' })} className="btn-primary">Login</button></div>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const myRecords = borrowRecords.filter((r) => r.userId === currentUser.id);
  const activeRecords = myRecords.filter((r) => r.status === 'active' || r.status === 'overdue');
  const overdueRecords = myRecords.filter((r) => r.status === 'overdue');
  const dueSoonRecords = activeRecords.filter((r) => { const due = new Date(r.dueDate); const now = new Date('2026-09-26'); const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)); return diff >= 0 && diff <= 3; });
  const stats = [
    { label: 'Books Borrowed', value: activeRecords.length, icon: BookOpen, color: 'text-emerald-300' },
    { label: 'Due Soon', value: dueSoonRecords.length, icon: Clock, color: 'text-amber-300' },
    { label: 'Overdue', value: overdueRecords.length, icon: AlertTriangle, color: 'text-red-300' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, color: 'text-pink-300' },
  ];
  const recommended = books.filter((b) => b.department === currentUser.department && b.availableCopies > 0).slice(0, 4);
  const recentlyAdded = books.slice(-4);

  const confirmReturn = () => { if (showReturnModal) { returnBook(showReturnModal); setShowReturnModal(null); } };

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-xl font-bold">{currentUser.name.charAt(0)}</div>
          <div><h1 className="font-display text-2xl md:text-3xl font-bold text-white">{greeting}, {currentUser.name.split(' ')[0]}</h1><p className="text-sm text-gray-400">{currentUser.department} - {currentUser.studentId}</p></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (<div key={s.label} className="glass-card rounded-2xl p-4 card-hover"><div className="flex items-center justify-between mb-2"><s.icon className={`w-6 h-6 ${s.color}`} /><span className="font-display text-3xl font-bold text-white">{s.value}</span></div><p className="text-sm text-gray-400">{s.label}</p></div>))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4"><h2 className="font-display font-bold text-white text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-400" /> My Borrowed Books</h2><button onClick={() => navigate({ name: 'history' })} className="text-xs text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1">View History <ArrowRight className="w-3 h-3" /></button></div>
              {activeRecords.length === 0 ? (
                <div className="text-center py-8"><BookOpen className="w-10 h-10 text-gray-500 mx-auto mb-3" /><p className="text-gray-400 text-sm mb-3">No active borrows. Explore the catalog to find your next read.</p><button onClick={() => navigate({ name: 'explore' })} className="btn-secondary text-sm">Browse Books</button></div>
              ) : (
                <div className="space-y-3">
                  {activeRecords.map((record) => { const book = books.find((b) => b.id === record.bookId); if (!book) return null; const due = new Date(record.dueDate); const now = new Date('2026-09-26'); const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)); const isOverdue = daysLeft < 0; return (
                    <div key={record.id} className="flex items-center gap-3 p-3 rounded-xl glass-light hover:bg-emerald-500/10 transition-all">
                      <BookCover book={book} size="sm" />
                      <div className="flex-1 min-w-0">
                        <button onClick={() => navigate({ name: 'book', bookId: book.id })} className="text-left"><p className="font-semibold text-white text-sm line-clamp-1">{book.title}</p><p className="text-xs text-gray-400">{book.author}</p></button>
                        <div className="flex items-center gap-3 mt-1.5 text-xs"><span className="flex items-center gap-1 text-gray-400"><Calendar className="w-3 h-3" /> Due: {record.dueDate}</span>{isOverdue ? <span className="badge-red text-[9px]">{Math.abs(daysLeft)} days overdue</span> : daysLeft <= 3 ? <span className="badge-orange text-[9px]">{daysLeft} days left</span> : <span className="badge-green text-[9px]">{daysLeft} days left</span>}</div>
                      </div>
                      <button onClick={() => setShowReturnModal(record.id)} className="px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-xs font-semibold transition-all flex items-center gap-1 shrink-0"><RotateCcw className="w-3.5 h-3.5" /> Return</button>
                    </div>
                  ); })}
                </div>
              )}
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-emerald-400" /><h2 className="font-display font-bold text-white text-lg">Recommended For You</h2></div>
              <p className="text-xs text-gray-400 mb-4">Because you're in {currentUser.department}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{recommended.map((book) => (<BookCard key={book.id} book={book} />))}</div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-emerald-400" /><h2 className="font-display font-bold text-white text-lg">Recently Added Books</h2></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{recentlyAdded.map((book) => (<button key={book.id} onClick={() => navigate({ name: 'book', bookId: book.id })} className="glass-card rounded-xl p-3 card-hover text-left"><BookCover book={book} size="sm" /><p className="text-xs font-semibold text-white mt-2 line-clamp-2">{book.title}</p><p className="text-[10px] text-gray-400 mt-0.5">{book.author}</p></button>))}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4"><h3 className="font-display font-bold text-white text-sm mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> Mini Library Map</h3><LibraryMap compact /><button onClick={() => navigate({ name: 'map' })} className="btn-secondary w-full mt-3 text-sm flex items-center justify-center gap-1">Open Full Map <ArrowRight className="w-3.5 h-3.5" /></button></div>
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <h3 className="font-display font-bold text-white text-sm mb-2">Quick Actions</h3>
              {[{ label: 'Explore Books', route: { name: 'explore' as const }, icon: BookOpen }, { label: 'My Wishlist', route: { name: 'wishlist' as const }, icon: Heart }, { label: 'Book Exchange', route: { name: 'exchange' as const }, icon: Heart }, { label: 'Borrowing History', route: { name: 'history' as const }, icon: Clock }, { label: 'Membership', route: { name: 'membership' as const }, icon: Calendar }].map((a) => (<button key={a.label} onClick={() => navigate(a.route)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl glass-light hover:bg-emerald-500/15 text-sm text-gray-200 transition-all"><a.icon className="w-4 h-4 text-emerald-400" />{a.label}<ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-500" /></button>))}
            </div>
          </div>
        </div>
      </div>
      {showReturnModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowReturnModal(null)}>
          <div className="glass-card rounded-3xl p-6 max-w-sm w-full animate-scale-in border-2 border-emerald-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4"><RotateCcw className="w-6 h-6 text-emerald-400" /></div>
            <h3 className="font-display font-bold text-white text-xl mb-2">Return this book?</h3><p className="text-sm text-gray-400 mb-5">The book will be marked as returned and made available for other students to borrow.</p>
            <div className="flex gap-3"><button onClick={() => setShowReturnModal(null)} className="btn-secondary flex-1">Cancel</button><button onClick={confirmReturn} className="btn-primary flex-1">Confirm Return</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
