import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store';
import { users } from '@/data';
import { Bell, Search, User, Menu, X, LogIn, Shield, BookOpen, Heart, Map, Library, Repeat2, CreditCard, Info, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';

export function Navbar() {
  const { route, navigate, currentUser, logout, unreadCount, setSearchQuery } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { label: 'Home', route: { name: 'home' as const }, icon: BookOpen },
    { label: 'Explore Books', route: { name: 'explore' as const }, icon: Search },
    { label: 'Library Map', route: { name: 'map' as const }, icon: Map },
    { label: 'Categories', route: { name: 'categories' as const }, icon: Library },
    { label: 'My Library', route: { name: 'dashboard' as const }, icon: LayoutDashboard },
    { label: 'Wishlist', route: { name: 'wishlist' as const }, icon: Heart },
    { label: 'Book Exchange', route: { name: 'exchange' as const }, icon: Repeat2 },
    { label: 'Membership', route: { name: 'membership' as const }, icon: CreditCard },
    { label: 'About', route: { name: 'about' as const }, icon: Info },
  ];

  const isActive = (name: string) => route.name === name;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    navigate({ name: 'explore' });
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-emerald-500/15">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight hidden sm:block">LIBRAVISTA</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.route)}
                className={`nav-link ${isActive(item.route.name) ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => navigate({ name: 'admin' })}
                className={`nav-link ${isActive('admin') ? 'active' : ''} flex items-center gap-1 text-emerald-300`}
              >
                <Shield className="w-3.5 h-3.5" /> Admin Portal
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Smart Search */}
            <div className="relative hidden md:block">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-light border border-emerald-500/15 hover:border-emerald-400/30 transition-all w-56 lg:w-64">
                  <Search className="w-4 h-4 text-emerald-300 shrink-0" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search books, authors..."
                    className="bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none w-full"
                  />
                </div>
              </form>
            </div>

            <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden w-9 h-9 rounded-xl glass-light flex items-center justify-center text-emerald-100 hover:bg-emerald-500/20 transition-all">
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate({ name: 'notifications' })}
              className="relative w-9 h-9 rounded-xl glass-light flex items-center justify-center text-emerald-100 hover:bg-emerald-500/20 transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce-in">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile / Login */}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl glass-light hover:bg-emerald-500/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden lg:block text-sm text-emerald-100 font-medium max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300 hidden lg:block" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-2xl p-3 animate-scale-in shadow-2xl border border-emerald-500/20">
                    <div className="pb-3 mb-2 border-b border-emerald-500/15">
                      <p className="font-semibold text-white text-sm">{currentUser.name}</p>
                      <p className="text-xs text-gray-400">{currentUser.email}</p>
                      <span className={`badge mt-1.5 ${currentUser.role === 'ADMIN' ? 'badge-blue' : 'badge-green'}`}>{currentUser.role}</span>
                    </div>
                    <button onClick={() => { navigate({ name: 'dashboard' }); setProfileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-500/15 text-sm text-gray-200 transition-colors flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    <button onClick={() => { navigate({ name: 'history' }); setProfileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-500/15 text-sm text-gray-200 transition-colors flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Borrowing History
                    </button>
                    {currentUser.role === 'ADMIN' && (
                      <button onClick={() => { navigate({ name: 'admin' }); setProfileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-500/15 text-sm text-gray-200 transition-colors flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Admin Portal
                      </button>
                    )}
                    <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/15 text-sm text-red-300 transition-colors flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate({ name: 'login' })} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-sm font-semibold transition-all border border-emerald-400/20">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:block">Login</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden w-9 h-9 rounded-xl glass-light flex items-center justify-center text-emerald-100 hover:bg-emerald-500/20 transition-all">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden pb-3 animate-slide-up">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-light border border-emerald-500/15">
                <Search className="w-4 h-4 text-emerald-300" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search books, authors..."
                  className="bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none w-full"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="xl:hidden pb-4 animate-slide-up space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { navigate(item.route); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item.route.name) ? 'bg-emerald-500/20 text-emerald-100' : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-100'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => { navigate({ name: 'admin' }); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive('admin') ? 'bg-emerald-500/20 text-emerald-100' : 'text-gray-300 hover:bg-emerald-500/10'}`}
              >
                <Shield className="w-4 h-4" /> Admin Portal
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export { users };
