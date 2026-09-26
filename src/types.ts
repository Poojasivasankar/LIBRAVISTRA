export type Role = 'STUDENT' | 'ADMIN';

export type Availability = 'available' | 'few' | 'borrowed' | 'reserved';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  role: Role;
  avatar: string;
  department: string;
  barcode: string;
  membershipType: 'Student' | 'Faculty' | 'Researcher';
  membershipValidTill: string;
  borrowLimit: number;
  currentBorrowed: number;
}

export interface Shelf {
  id: string;
  name: string;
  floor: number;
  section: string;
  department: string;
  genre: string;
  capacity: number;
  bookCount: number;
  availableCount: number;
  qrCode: string;
  mapX: number;
  mapY: number;
  mapW: number;
  mapH: number;
  color: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  year: number;
  genre: string;
  department: string;
  shelfId: string;
  floor: number;
  description: string;
  totalCopies: number;
  availableCopies: number;
  rating: number;
  coverColor: string;
  coverAccent: string;
  pages: number;
  language: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'active' | 'returned' | 'overdue' | 'reserved';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'available' | 'borrow' | 'return' | 'due' | 'overdue' | 'wishlist' | 'exchange' | 'reservation';
  title: string;
  message: string;
  bookId?: string;
  read: boolean;
  createdAt: string;
}

export interface ExchangeListing {
  id: string;
  bookTitle: string;
  author: string;
  ownerName: string;
  ownerDepartment: string;
  condition: 'Like New' | 'Good' | 'Fair';
  status: 'available' | 'requested' | 'exchanged';
  coverColor: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  bookCount: number;
  color: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  bookCount: number;
  availableCount: number;
  shelfCount: number;
  color: string;
}
