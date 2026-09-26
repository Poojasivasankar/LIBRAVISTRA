import { useStore } from '@/store';
import { books } from '@/data';
import { Bell, CheckCircle2, Clock, AlertTriangle, Heart, Repeat2, BookOpen, ArrowRight, Check } from 'lucide-react';

export function NotificationsPage() {
  const { notifications, currentUser, markNotificationRead, navigate, borrowBook } = useStore();
  if (!currentUser) { return (<div className="pt-16 min-h-screen flex items-center justify-center"><div className="text-center"><Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" /><h2 className="font-display font-bold text-white text-xl mb-2">Please log in</h2><button onClick={() => navigate({ name: 'login' })} className="btn-primary">Login</button></div></div>); }
  const myNotifs = notifications.filter((n) => n.userId === currentUser.id);
  const unread = myNotifs.filter((n) => !n.read);
  const iconMap: Record<string, typeof Bell> = { available: CheckCircle2, borrow: BookOpen, return: Check, due: Clock, overdue: AlertTriangle, wishlist: Heart, exchange: Repeat2, reservation: Bell };
  const colorMap: Record<string, string> = { available: 'text-emerald-400 bg-emerald-500/15', borrow: 'text-emerald-300 bg-emerald-500/15', return: 'text-emerald-400 bg-emerald-500/15', due: 'text-amber-400 bg-amber-500/15', overdue: 'text-red-400 bg-red-500/15', wishlist: 'text-pink-400 bg-pink-500/15', exchange: 'text-sky-400 bg-sky-500/15', reservation: 'text-sky-300 bg-sky-500/15' };

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[800px] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center"><Bell className="w-6 h-6 text-emerald-400" /></div><div><h1 className="section-title">Notifications</h1><p className="text-gray-400">{unread.length} unread - {myNotifs.length} total</p></div></div>
        {myNotifs.length === 0 ? (<div className="glass-card rounded-3xl p-12 text-center"><Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" /><h3 className="font-display font-bold text-white text-lg mb-2">No notifications</h3><p className="text-gray-400 text-sm">You're all caught up!</p></div>) : (
          <div className="space-y-3">
            {myNotifs.map((notif) => { const Icon = iconMap[notif.type] ?? Bell; const colorClass = colorMap[notif.type] ?? 'text-emerald-400 bg-emerald-500/15'; const book = notif.bookId ? books.find((b) => b.id === notif.bookId) : null; return (
              <div key={notif.id} className={`glass-card rounded-2xl p-4 card-hover ${!notif.read ? 'border-l-2 border-l-emerald-400' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}><Icon className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2"><h3 className="font-semibold text-white text-sm">{notif.title}</h3>{!notif.read && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}</div>
                    <p className="text-sm text-gray-300 mt-1">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-3">
                      {book && (notif.type === 'wishlist' || notif.type === 'available') && book.availableCopies > 0 && <button onClick={() => borrowBook(book.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-xs font-semibold transition-all flex items-center gap-1">Borrow Now <ArrowRight className="w-3 h-3" /></button>}
                      {book && <button onClick={() => navigate({ name: 'book', bookId: book.id })} className="px-3 py-1.5 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-200 text-xs font-semibold transition-all">View Book</button>}
                      {!notif.read && <button onClick={() => markNotificationRead(notif.id)} className="px-3 py-1.5 rounded-lg glass-light hover:bg-emerald-500/15 text-gray-400 text-xs font-semibold transition-all">Mark read</button>}
                    </div>
                  </div>
                </div>
              </div>
            );})}
          </div>
        )}
      </div>
    </div>
  );
}
