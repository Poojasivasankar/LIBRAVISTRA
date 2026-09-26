import { StoreProvider, useStore } from '@/store';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/Toast';
import { Chatbot } from '@/components/Chatbot';
import { HomePage } from '@/pages/HomePage';
import { ExplorePage } from '@/pages/ExplorePage';
import { MapPage } from '@/pages/MapPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { BookDetailPage } from '@/pages/BookDetailPage';
import { ShelfPage } from '@/pages/ShelfPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { ExchangePage } from '@/pages/ExchangePage';
import { MembershipPage } from '@/pages/MembershipPage';
import { AboutPage } from '@/pages/AboutPage';
import { ScannerPage } from '@/pages/ScannerPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { AdminPortalPage } from '@/pages/AdminPortalPage';

function Router() {
  const { route } = useStore();

  switch (route.name) {
    case 'home': return <HomePage />;
    case 'explore': return <ExplorePage />;
    case 'map': return <MapPage />;
    case 'categories': return <CategoriesPage />;
    case 'book': return <BookDetailPage bookId={route.bookId} />;
    case 'shelf': return <ShelfPage shelfId={route.shelfId} />;
    case 'login': return <LoginPage />;
    case 'dashboard': return <DashboardPage />;
    case 'wishlist': return <WishlistPage />;
    case 'exchange': return <ExchangePage />;
    case 'membership': return <MembershipPage />;
    case 'about': return <AboutPage />;
    case 'scanner': return <ScannerPage />;
    case 'history': return <HistoryPage />;
    case 'notifications': return <NotificationsPage />;
    case 'admin': return <AdminPortalPage />;
    default: return <HomePage />;
  }
}

function Layout() {
  const { route } = useStore();
  const isAdminPortal = route.name === 'admin';

  if (isAdminPortal) {
    return (
      <>
        <Router />
        <ToastContainer />
        <Chatbot />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Router />
      </div>
      <Footer />
      <ToastContainer />
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <Layout />
    </StoreProvider>
  );
}

export default App;
