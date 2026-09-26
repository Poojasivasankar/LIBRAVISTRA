import { useStore } from '@/store';
import { BookOpen, Map, Heart, Repeat2, CreditCard, Info, Library, Phone, Mail, HelpCircle } from 'lucide-react';

export function Footer() {
  const { navigate } = useStore();

  return (
    <footer className="mt-20 border-t border-emerald-500/15 bg-forest-900/50">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">LIBRAVISTA</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">Your library. Smarter.</p>
            <p className="text-xs text-gray-500 max-w-xs">A smart digital library management and discovery platform. Find books, locate shelves, and explore your library through an interactive digital map.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-emerald-100 mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Explore Books', route: { name: 'explore' as const }, icon: BookOpen },
                { label: 'Library Map', route: { name: 'map' as const }, icon: Map },
                { label: 'Wishlist', route: { name: 'wishlist' as const }, icon: Heart },
                { label: 'Book Exchange', route: { name: 'exchange' as const }, icon: Repeat2 },
                { label: 'Membership', route: { name: 'membership' as const }, icon: CreditCard },
              ].map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.route)} className="flex items-center gap-2 text-gray-400 hover:text-emerald-200 transition-colors">
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Library */}
          <div>
            <h4 className="font-display font-semibold text-emerald-100 mb-3 text-sm">Library</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About', route: { name: 'about' as const }, icon: Info },
                { label: 'Library Rules', route: { name: 'about' as const }, icon: Library },
                { label: 'Contact', route: { name: 'about' as const }, icon: Mail },
                { label: 'Help', route: { name: 'about' as const }, icon: HelpCircle },
              ].map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.route)} className="flex items-center gap-2 text-gray-400 hover:text-emerald-200 transition-colors">
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-emerald-100 mb-3 text-sm">Visit Us</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-start gap-2"><Library className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" /> University Central Library, Block C, Ground Floor</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /> +91 80 1234 5678</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> library@university.edu</p>
              <p className="text-xs text-gray-500 mt-2">Mon–Sat: 8:00 AM – 8:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2026 LIBRAVISTA. All rights reserved.</p>
          <p className="text-xs text-gray-500">Built for the modern university library.</p>
        </div>
      </div>
    </footer>
  );
}
