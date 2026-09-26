import { useState } from 'react';
import { useStore } from '@/store';
import { users, shelves, departments, categories } from '@/data';
import { BookCover } from '@/components/BookCover';
import { LibraryMap } from '@/components/LibraryMap';
import {
  LayoutDashboard, BookOpen, Library, Layers, Users, ArrowLeftRight, RotateCcw, Bookmark,
  AlertTriangle, Repeat2, Bell, QrCode, Map, BarChart3, Settings, Plus, Edit, Trash2, X,
  Search, TrendingUp, Shield, LogOut, Menu, BookMarked, Building2,
} from 'lucide-react';
import type { Book } from '@/types';

type AdminTab = 'dashboard' | 'books' | 'shelves' | 'categories' | 'departments' | 'members' | 'borrowing' | 'returns' | 'reservations' | 'overdue' | 'exchanges' | 'notifications' | 'qr' | 'map' | 'reports' | 'settings';

export function AdminPortalPage() {
  const { currentUser, logout, navigate, books, borrowRecords, deleteBook, addBook, updateBook, pushToast } = useStore();
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [search, setSearch] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', publisher: '', year: 2024, genre: 'Computer Science', department: 'Computer Science', shelfId: 'CS-01', floor: 1, totalCopies: 3, description: '' });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (<div className="pt-16 min-h-screen flex items-center justify-center"><div className="text-center"><Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" /><h2 className="font-display font-bold text-white text-xl mb-2">Admin access required</h2><button onClick={() => navigate({ name: 'login' })} className="btn-primary">Login as Admin</button></div></div>);
  }

  const sidebarItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'shelves', label: 'Shelves', icon: Library },
    { id: 'categories', label: 'Categories', icon: BookMarked },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'borrowing', label: 'Borrowing', icon: ArrowLeftRight },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'reservations', label: 'Reservations', icon: Bookmark },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle },
    { id: 'exchanges', label: 'Exchanges', icon: Repeat2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'qr', label: 'QR Management', icon: QrCode },
    { id: 'map', label: 'Library Map', icon: Map },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.availableCopies > 0).length;
  const borrowedBooks = books.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0);
  const overdueRecords = borrowRecords.filter((r) => r.status === 'overdue');
  const studentUsers = users.filter((u) => u.role === 'STUDENT');

  const filteredBooks = search ? books.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search)) : books;

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author) { pushToast('Please fill in title and author', 'error'); return; }
    const book: Book = { id: `BK-${String(books.length + 1).padStart(4, '0')}`, ...newBook, availableCopies: newBook.totalCopies, rating: 4.0, coverColor: '#065F46', coverAccent: '#10B981', pages: 300, language: 'English' };
    addBook(book);
    setNewBook({ title: '', author: '', isbn: '', publisher: '', year: 2024, genre: 'Computer Science', department: 'Computer Science', shelfId: 'CS-01', floor: 1, totalCopies: 3, description: '' });
    setShowAddBook(false);
    pushToast(`"${book.title}" added successfully`, 'success');
  };

  const renderContent = () => {
    switch (tab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Welcome back, {currentUser.name}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[{ label: 'Total Books', value: totalBooks, icon: BookOpen, color: 'text-emerald-300' }, { label: 'Available', value: availableBooks, icon: Library, color: 'text-emerald-200' }, { label: 'Borrowed', value: borrowedBooks, icon: ArrowLeftRight, color: 'text-amber-300' }, { label: 'Overdue', value: overdueRecords.length, icon: AlertTriangle, color: 'text-red-300' }, { label: 'Members', value: studentUsers.length, icon: Users, color: 'text-emerald-300' }, { label: 'Reservations', value: 3, icon: Bookmark, color: 'text-sky-300' }, { label: 'Exchanges', value: 7, icon: Repeat2, color: 'text-emerald-200' }].map((s) => (
                <div key={s.label} className="glass-card rounded-2xl p-4 card-hover"><div className="flex items-center justify-between mb-2"><s.icon className={`w-5 h-5 ${s.color}`} /><span className="font-display text-2xl font-bold text-white">{s.value}</span></div><p className="text-xs text-gray-400">{s.label}</p></div>
              ))}
            </div>
            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display font-bold text-white text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Borrowing Trends (Last 7 Months)</h3>
                <div className="flex items-end justify-between gap-2 h-40">{[40, 65, 50, 80, 70, 90, 75].map((h, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t-lg bg-gradient-to-t from-emerald-700 to-emerald-400 transition-all hover:opacity-80" style={{ height: `${h}%` }} /><span className="text-[10px] text-gray-500">{['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][i]}</span></div>))}</div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display font-bold text-white text-sm mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-emerald-400" /> Popular Genres</h3>
                <div className="space-y-2">{[...new Set(books.map((b) => b.genre))].slice(0, 6).map((genre) => { const count = books.filter((b) => b.genre === genre).length; const pct = Math.round((count / books.length) * 100); return (<div key={genre}><div className="flex justify-between text-xs mb-1"><span className="text-gray-300">{genre}</span><span className="text-gray-500">{count} books</span></div><div className="h-2 rounded-full bg-forest-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: `${pct * 3}%` }} /></div></div>); })}</div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display font-bold text-white text-sm mb-4">Most Borrowed Books</h3>
                <div className="space-y-2">{books.slice(0, 5).map((b, i) => (<div key={b.id} className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><div className="flex-1 min-w-0"><p className="text-sm text-white line-clamp-1">{b.title}</p><p className="text-xs text-gray-400">{b.author}</p></div><span className="text-xs text-gray-500 shrink-0">{b.totalCopies - b.availableCopies} borrowed</span></div>))}</div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display font-bold text-white text-sm mb-4">Department Usage</h3>
                <div className="space-y-2">{departments.map((d) => { const pct = Math.round((d.bookCount / 50) * 100); return (<div key={d.id}><div className="flex justify-between text-xs mb-1"><span className="text-gray-300">{d.name}</span><span className="text-gray-500">{d.bookCount} books</span></div><div className="h-2 rounded-full bg-forest-800"><div className="h-full rounded-full" style={{ width: `${pct * 2}%`, background: d.color }} /></div></div>); })}</div>
              </div>
            </div>
          </div>
        );
      case 'books':
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-3"><h1 className="font-display text-2xl font-bold text-white">Books Management</h1><button onClick={() => setShowAddBook(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add Book</button></div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl glass-card border border-emerald-500/20 max-w-md"><Search className="w-4 h-4 text-emerald-300" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." className="bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none flex-1 text-sm" /></div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-emerald-500/15 text-left text-xs text-gray-400"><th className="px-4 py-3">Book</th><th className="px-4 py-3">ISBN</th><th className="px-4 py-3">Genre</th><th className="px-4 py-3">Shelf</th><th className="px-4 py-3">Copies</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{filteredBooks.slice(0, 20).map((book) => (<tr key={book.id} className="border-b border-emerald-500/10 hover:bg-emerald-500/5"><td className="px-4 py-3"><div className="flex items-center gap-2"><BookCover book={book} size="sm" /><div><p className="text-white font-medium line-clamp-1">{book.title}</p><p className="text-xs text-gray-400">{book.author}</p></div></div></td><td className="px-4 py-3 text-gray-400 text-xs">{book.isbn}</td><td className="px-4 py-3 text-gray-300">{book.genre}</td><td className="px-4 py-3 text-gray-300">{book.shelfId}</td><td className="px-4 py-3"><span className="text-emerald-300">{book.availableCopies}</span><span className="text-gray-500">/{book.totalCopies}</span></td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => navigate({ name: 'book', bookId: book.id })} className="w-7 h-7 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-300 flex items-center justify-center"><Edit className="w-3.5 h-3.5" /></button><button onClick={() => { deleteBook(book.id); pushToast(`"${book.title}" deleted`, 'info'); }} className="w-7 h-7 rounded-lg glass-light hover:bg-red-500/15 text-red-300 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>))}</tbody></table></div>
            </div>
          </div>
        );
      case 'shelves':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Shelves Management</h1><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{shelves.map((shelf) => (<div key={shelf.id} className="glass-card rounded-2xl p-4 card-hover"><div className="flex items-center justify-between mb-2"><h3 className="font-display font-bold text-white">{shelf.id}</h3><button onClick={() => navigate({ name: 'shelf', shelfId: shelf.id })} className="text-xs text-emerald-300 hover:text-emerald-200">View</button></div><p className="text-sm text-gray-400">{shelf.name}</p><div className="grid grid-cols-3 gap-2 mt-3 text-center"><div><p className="text-lg font-bold text-white">{shelf.bookCount}</p><p className="text-[10px] text-gray-500">Books</p></div><div><p className="text-lg font-bold text-emerald-300">{shelf.availableCount}</p><p className="text-[10px] text-gray-500">Available</p></div><div><p className="text-lg font-bold text-gray-400">{shelf.capacity}</p><p className="text-[10px] text-gray-500">Capacity</p></div></div><div className="flex gap-1 mt-3"><button className="flex-1 px-2 py-1.5 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1"><QrCode className="w-3 h-3" /> QR</button><button onClick={() => navigate({ name: 'map' })} className="flex-1 px-2 py-1.5 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1"><Map className="w-3 h-3" /> Map</button></div></div>))}</div></div>);
      case 'categories':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Categories</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{categories.map((c) => (<div key={c.id} className="glass-card rounded-2xl p-4 card-hover"><div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: `${c.color}25` }}><BookMarked className="w-5 h-5" style={{ color: c.color }} /></div><h3 className="font-semibold text-white text-sm">{c.name}</h3><p className="text-xs text-gray-400">{c.bookCount} books</p></div>))}</div></div>);
      case 'departments':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Departments</h1><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{departments.map((d) => (<div key={d.id} className="glass-card rounded-2xl p-4 card-hover"><div className="flex items-center justify-between mb-2"><span className="font-display font-bold text-lg" style={{ color: d.color }}>{d.shortName}</span><span className="text-xs text-gray-500">{d.shelfCount} shelves</span></div><p className="text-sm font-semibold text-gray-200">{d.name}</p><p className="text-xs text-gray-500 mt-1">{d.bookCount} books - {d.availableCount} available</p></div>))}</div></div>);
      case 'members':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Members</h1><div className="glass-card rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-emerald-500/15 text-left text-xs text-gray-400"><th className="px-4 py-3">Name</th><th className="px-4 py-3">Student ID</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Borrowed</th><th className="px-4 py-3">Membership</th></tr></thead><tbody>{studentUsers.map((u) => (<tr key={u.id} className="border-b border-emerald-500/10 hover:bg-emerald-500/5"><td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">{u.name.charAt(0)}</div><span className="text-white">{u.name}</span></div></td><td className="px-4 py-3 text-gray-400">{u.studentId}</td><td className="px-4 py-3 text-gray-300">{u.department}</td><td className="px-4 py-3"><span className="text-amber-300">{u.currentBorrowed}</span><span className="text-gray-500">/{u.borrowLimit}</span></td><td className="px-4 py-3"><span className="badge-green">{u.membershipType}</span></td></tr>))}</tbody></table></div></div></div>);
      case 'borrowing':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Borrowing Records</h1><div className="glass-card rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-emerald-500/15 text-left text-xs text-gray-400"><th className="px-4 py-3">Student</th><th className="px-4 py-3">Book</th><th className="px-4 py-3">Borrow Date</th><th className="px-4 py-3">Due Date</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{borrowRecords.filter((r) => r.status === 'active' || r.status === 'overdue').map((r) => (<tr key={r.id} className="border-b border-emerald-500/10 hover:bg-emerald-500/5"><td className="px-4 py-3 text-white">{r.userName}</td><td className="px-4 py-3 text-gray-300">{r.bookTitle}</td><td className="px-4 py-3 text-gray-400">{r.borrowDate}</td><td className="px-4 py-3 text-gray-400">{r.dueDate}</td><td className="px-4 py-3">{r.status === 'overdue' ? <span className="badge-red">Overdue</span> : <span className="badge-green">Active</span>}</td></tr>))}</tbody></table></div></div></div>);
      case 'returns':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Returns</h1><div className="glass-card rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-emerald-500/15 text-left text-xs text-gray-400"><th className="px-4 py-3">Student</th><th className="px-4 py-3">Book</th><th className="px-4 py-3">Borrow Date</th><th className="px-4 py-3">Return Date</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{borrowRecords.filter((r) => r.status === 'returned').map((r) => (<tr key={r.id} className="border-b border-emerald-500/10 hover:bg-emerald-500/5"><td className="px-4 py-3 text-white">{r.userName}</td><td className="px-4 py-3 text-gray-300">{r.bookTitle}</td><td className="px-4 py-3 text-gray-400">{r.borrowDate}</td><td className="px-4 py-3 text-emerald-300">{r.returnDate}</td><td className="px-4 py-3"><span className="badge-green">Returned</span></td></tr>))}</tbody></table></div></div></div>);
      case 'overdue':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Overdue Books</h1><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{overdueRecords.map((r) => { const due = new Date(r.dueDate); const now = new Date('2026-09-26'); const days = Math.ceil((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)); return (<div key={r.id} className="glass-card rounded-2xl p-4 border-l-2 border-l-red-400"><div className="flex items-center justify-between mb-2"><div><p className="font-semibold text-white">{r.bookTitle}</p><p className="text-xs text-gray-400">{r.userName}</p></div><span className="badge-red">{days} days overdue</span></div><p className="text-xs text-gray-400">Due: {r.dueDate}</p></div>); })}</div></div>);
      case 'reservations':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Reservations</h1><div className="glass-card rounded-3xl p-8 text-center"><Bookmark className="w-12 h-12 text-gray-500 mx-auto mb-4" /><p className="text-gray-400">No active reservations</p></div></div>);
      case 'exchanges':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Book Exchanges</h1><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[{ t: 'Head First Java', o: 'Aarav Sharma', s: 'available' }, { t: 'Cracking the Coding Interview', o: 'Vikram Singh', s: 'requested' }, { t: 'The Selfish Gene', o: 'Divya Menon', s: 'available' }].map((e, i) => (<div key={i} className="glass-card rounded-2xl p-4"><p className="font-semibold text-white">{e.t}</p><p className="text-xs text-gray-400">by {e.o}</p><span className={`badge mt-2 ${e.s === 'available' ? 'badge-green' : 'badge-orange'}`}>{e.s}</span></div>))}</div></div>);
      case 'notifications':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Notifications</h1><div className="glass-card rounded-3xl p-8 text-center"><Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" /><p className="text-gray-400">Notification management coming soon</p></div></div>);
      case 'qr':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">QR Management</h1><p className="text-gray-400 text-sm">Generate and manage QR codes for each shelf.</p><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">{shelves.map((s) => (<div key={s.id} className="glass-card rounded-2xl p-4 text-center card-hover"><div className="grid grid-cols-8 gap-px w-24 h-24 mx-auto mb-2 bg-white p-2 rounded-lg">{Array.from({ length: 64 }).map((_, i) => { const seed = (i * 7 + s.id.charCodeAt(0) * 13) % 3; return <div key={i} className={seed === 0 ? 'bg-forest-900' : 'bg-transparent'} />; })}</div><p className="font-bold text-white text-sm">{s.id}</p><p className="text-xs text-gray-400">{s.qrCode}</p><div className="flex gap-1 mt-2"><button onClick={() => pushToast(`${s.id} QR downloaded`, 'success')} className="flex-1 px-2 py-1 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-200 text-[10px] font-semibold flex items-center justify-center gap-1"><QrCode className="w-2.5 h-2.5" /> Gen</button><button onClick={() => pushToast(`${s.id} QR printed`, 'info')} className="flex-1 px-2 py-1 rounded-lg glass-light hover:bg-emerald-500/15 text-emerald-200 text-[10px] font-semibold flex items-center justify-center gap-1">Print</button></div></div>))}</div></div>);
      case 'map':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Library Map Editor</h1><p className="text-gray-400 text-sm">Visual map editor - click shelves to inspect locations.</p><LibraryMap /></div>);
      case 'reports':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Reports</h1><div className="grid lg:grid-cols-2 gap-4"><div className="glass-card rounded-2xl p-5"><h3 className="font-display font-bold text-white text-sm mb-4">Overdue Statistics</h3><div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-gray-300">Total overdue</span><span className="text-red-300 font-bold">{overdueRecords.length}</span></div><div className="flex justify-between text-sm"><span className="text-gray-300">Avg days overdue</span><span className="text-amber-300">3.5 days</span></div><div className="flex justify-between text-sm"><span className="text-gray-300">Students affected</span><span className="text-white">2</span></div></div></div><div className="glass-card rounded-2xl p-5"><h3 className="font-display font-bold text-white text-sm mb-4">Library Summary</h3><div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-gray-300">Total books</span><span className="text-white font-bold">{totalBooks}</span></div><div className="flex justify-between text-sm"><span className="text-gray-300">Available</span><span className="text-emerald-300">{availableBooks}</span></div><div className="flex justify-between text-sm"><span className="text-gray-300">Borrowed</span><span className="text-amber-300">{borrowedBooks}</span></div><div className="flex justify-between text-sm"><span className="text-gray-300">Active members</span><span className="text-white">{studentUsers.length}</span></div></div></div></div></div>);
      case 'settings':
        return (<div className="space-y-4 animate-fade-in"><h1 className="font-display text-2xl font-bold text-white">Settings</h1><div className="glass-card rounded-2xl p-5 space-y-4"><div><label className="text-xs text-gray-400 mb-1 block">Library Name</label><input type="text" defaultValue="LIBRAVISTA University Library" className="input-field" /></div><div><label className="text-xs text-gray-400 mb-1 block">Borrow Period (days)</label><input type="number" defaultValue={14} className="input-field" /></div><div><label className="text-xs text-gray-400 mb-1 block">Max Books Per Student</label><input type="number" defaultValue={5} className="input-field" /></div><div><label className="text-xs text-gray-400 mb-1 block">Overdue Fine Per Day (Rs.)</label><input type="number" defaultValue={5} className="input-field" /></div><button onClick={() => pushToast('Settings saved', 'success')} className="btn-primary">Save Settings</button></div></div>);
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass border-r border-emerald-500/15 z-40 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 flex items-center gap-2 border-b border-emerald-500/15">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center"><Shield className="w-5 h-5 text-white" /></div>
          <div><p className="font-display font-bold text-white text-sm">Admin Portal</p><p className="text-[10px] text-gray-400">{currentUser.name}</p></div>
        </div>
        <nav className="p-2 space-y-0.5 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {sidebarItems.map((item) => (<button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? 'bg-emerald-500/20 text-emerald-100' : 'text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-200'}`}><item.icon className="w-4 h-4" />{item.label}</button>))}
        </nav>
        <div className="p-2 border-t border-emerald-500/15"><button onClick={() => navigate({ name: 'home' })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-200 transition-all"><BookOpen className="w-4 h-4" /> Back to Site</button><button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-all"><LogOut className="w-4 h-4" /> Logout</button></div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="lg:hidden p-4 flex items-center justify-between glass border-b border-emerald-500/15 sticky top-0 z-20"><button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl glass-light flex items-center justify-center text-emerald-100"><Menu className="w-5 h-5" /></button><span className="font-display font-bold text-white text-sm">Admin - {sidebarItems.find((s) => s.id === tab)?.label}</span></div>
        <div className="p-4 lg:p-6 max-w-[1200px] mx-auto">{renderContent()}</div>
      </main>

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddBook(false)}>
          <div className="glass-card rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in border-2 border-emerald-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-display font-bold text-white text-xl">Add New Book</h3><button onClick={() => setShowAddBook(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">Title</label><input type="text" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} className="input-field" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Author</label><input type="text" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} className="input-field" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">ISBN</label><input type="text" value={newBook.isbn} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} className="input-field" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Publisher</label><input type="text" value={newBook.publisher} onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })} className="input-field" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Year</label><input type="number" value={newBook.year} onChange={(e) => setNewBook({ ...newBook, year: Number(e.target.value) })} className="input-field" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Genre</label><select value={newBook.genre} onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })} className="input-field">{[...new Set(books.map((b) => b.genre))].map((g) => <option key={g} value={g} className="bg-forest-800">{g}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Department</label><select value={newBook.department} onChange={(e) => setNewBook({ ...newBook, department: e.target.value })} className="input-field">{departments.map((d) => <option key={d.id} value={d.name} className="bg-forest-800">{d.name}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Shelf</label><select value={newBook.shelfId} onChange={(e) => setNewBook({ ...newBook, shelfId: e.target.value })} className="input-field">{shelves.map((s) => <option key={s.id} value={s.id} className="bg-forest-800">{s.id} - {s.name}</option>)}</select></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Total Copies</label><input type="number" value={newBook.totalCopies} onChange={(e) => setNewBook({ ...newBook, totalCopies: Number(e.target.value) })} className="input-field" /></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">Description</label><textarea value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} className="input-field min-h-[60px] resize-none" /></div>
            </div>
            <div className="flex gap-3 mt-4"><button onClick={() => setShowAddBook(false)} className="btn-secondary flex-1">Cancel</button><button onClick={handleAddBook} className="btn-primary flex-1">Add Book</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
