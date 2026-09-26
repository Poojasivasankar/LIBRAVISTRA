import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Book, User, BorrowRecord, Notification, ExchangeListing, Shelf } from './types';
import {
  books as initialBooks,
  users as initialUsers,
  borrowRecords as initialBorrowRecords,
  notifications as initialNotifications,
  exchangeListings as initialExchangeListings,
  shelves as initialShelves,
} from './data';

export type Route =
  | { name: 'home' }
  | { name: 'explore' }
  | { name: 'map' }
  | { name: 'categories' }
  | { name: 'book'; bookId: string }
  | { name: 'shelf'; shelfId: string }
  | { name: 'login' }
  | { name: 'dashboard' }
  | { name: 'wishlist' }
  | { name: 'exchange' }
  | { name: 'membership' }
  | { name: 'about' }
  | { name: 'scanner' }
  | { name: 'history' }
  | { name: 'admin' }
  | { name: 'notifications' };

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreValue {
  route: Route;
  navigate: (route: Route) => void;

  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;

  books: Book[];
  shelves: Shelf[];
  borrowRecords: BorrowRecord[];
  notifications: Notification[];
  exchangeListings: ExchangeListing[];

  wishlist: string[];
  toggleWishlist: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;

  borrowBook: (bookId: string) => void;
  returnBook: (recordId: string) => void;
  reserveBook: (bookId: string) => void;

  notifyMe: (bookId: string) => void;

  toasts: Toast[];
  pushToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  markNotificationRead: (id: string) => void;
  unreadCount: number;

  highlightedShelfId: string | null;
  setHighlightedShelfId: (id: string | null) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  addBook: (book: Book) => void;
  updateBook: (id: string, patch: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addShelf: (shelf: Shelf) => void;
  updateShelf: (id: string, patch: Partial<Shelf>) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [shelves] = useState<Shelf[]>(initialShelves);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(initialBorrowRecords);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [exchangeListings, setExchangeListings] = useState<ExchangeListing[]>(initialExchangeListings);
  const [wishlist, setWishlist] = useState<string[]>(['BK-0042', 'BK-0008']);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [highlightedShelfId, setHighlightedShelfId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useCallback((r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pushToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `T${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const login = useCallback((user: User) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setRoute({ name: 'admin' });
    } else {
      setRoute({ name: 'dashboard' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setRoute({ name: 'home' });
  }, []);

  const toggleWishlist = useCallback(
    (bookId: string) => {
      setWishlist((prev) => {
        if (prev.includes(bookId)) {
          pushToast('Removed from wishlist', 'info');
          return prev.filter((id) => id !== bookId);
        }
        pushToast('Added to wishlist', 'success');
        return [...prev, bookId];
      });
    },
    [pushToast],
  );

  const isWishlisted = useCallback((bookId: string) => wishlist.includes(bookId), [wishlist]);

  const borrowBook = useCallback(
    (bookId: string) => {
      if (!currentUser) {
        pushToast('Please log in to borrow books', 'error');
        return;
      }
      const book = books.find((b) => b.id === bookId);
      if (!book || book.availableCopies <= 0) {
        pushToast('This book is not available', 'error');
        return;
      }
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b)));
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      const newRecord: BorrowRecord = {
        id: `BR${Date.now()}`,
        bookId,
        bookTitle: book.title,
        userId: currentUser.id,
        userName: currentUser.name,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        returnDate: null,
        status: 'active',
      };
      setBorrowRecords((prev) => [newRecord, ...prev]);
      pushToast(`"${book.title}" successfully borrowed. Due ${dueDate.toISOString().split('T')[0]}`, 'success');
    },
    [currentUser, books, pushToast],
  );

  const returnBook = useCallback(
    (recordId: string) => {
      const record = borrowRecords.find((r) => r.id === recordId);
      if (!record) return;
      setBorrowRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? { ...r, status: 'returned' as const, returnDate: new Date().toISOString().split('T')[0] }
            : r,
        ),
      );
      setBooks((prev) => prev.map((b) => (b.id === record.bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b)));
      pushToast(`"${record.bookTitle}" returned successfully`, 'success');
    },
    [borrowRecords, pushToast],
  );

  const reserveBook = useCallback(
    (bookId: string) => {
      if (!currentUser) {
        pushToast('Please log in to reserve books', 'error');
        return;
      }
      const book = books.find((b) => b.id === bookId);
      if (book) pushToast(`"${book.title}" reserved. You will be notified when available.`, 'info');
    },
    [currentUser, books, pushToast],
  );

  const notifyMe = useCallback(
    (bookId: string) => {
      const book = books.find((b) => b.id === bookId);
      if (book) pushToast(`We will notify you when "${book.title}" becomes available.`, 'info');
    },
    [books, pushToast],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read && n.userId === currentUser?.id).length;

  const addBook = useCallback((book: Book) => {
    setBooks((prev) => [book, ...prev]);
  }, []);

  const updateBook = useCallback((id: string, patch: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addShelf = useCallback((_shelf: Shelf) => {
    // shelves is read-only in this prototype
  }, []);

  const updateShelf = useCallback((_id: string, _patch: Partial<Shelf>) => {
    // shelves is read-only in this prototype
  }, []);

  const value: StoreValue = {
    route,
    navigate,
    currentUser,
    login,
    logout,
    books,
    shelves,
    borrowRecords,
    notifications,
    exchangeListings,
    wishlist,
    toggleWishlist,
    isWishlisted,
    borrowBook,
    returnBook,
    reserveBook,
    notifyMe,
    toasts,
    pushToast,
    dismissToast,
    markNotificationRead,
    unreadCount,
    highlightedShelfId,
    setHighlightedShelfId,
    searchQuery,
    setSearchQuery,
    addBook,
    updateBook,
    deleteBook,
    addShelf,
    updateShelf,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
