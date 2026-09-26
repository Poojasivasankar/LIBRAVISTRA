import { useStore } from '@/store';
import { BookOpen, MapPin, ScanLine, QrCode, Heart, Repeat2, Sparkles, Shield, Users, Library, GraduationCap, ArrowRight, Info, Phone, Mail, HelpCircle, BookMarked } from 'lucide-react';

export function AboutPage() {
  const { navigate } = useStore();
  const features = [
    { icon: MapPin, title: 'Interactive Library Map', desc: 'Find any book physically inside the library with our isometric, clickable map of shelves, sections, and study zones.' },
    { icon: ScanLine, title: 'Barcode Entry System', desc: 'Scan your library ID at the entrance for quick authentication and access to your borrowing profile.' },
    { icon: QrCode, title: 'Shelf QR Discovery', desc: 'Every shelf has a unique QR code. Scan it to instantly see all books on that shelf and their availability.' },
    { icon: Heart, title: 'Smart Wishlist', desc: 'Save books you want to read and get notified the moment they become available for borrowing.' },
    { icon: Repeat2, title: 'Book Exchange', desc: 'Trade books with fellow students through our peer-to-peer exchange marketplace.' },
    { icon: Sparkles, title: 'LaraAI Assistant', desc: 'Ask our AI librarian where to find books, get recommendations, and navigate the library with ease.' },
  ];
  const rules = [
    'Books must be returned within 14 days of borrowing.', 'Maximum 5 books per student at any time.',
    'Overdue books incur a fine of Rs.5 per day.', 'Lost books must be replaced or paid for.',
    'Silence must be maintained in the reading area.', 'Food and drinks are not permitted inside the library.',
    'Library ID card must be carried at all times.', 'Reference books and journals are for in-library use only.',
  ];
  const stats = [
    { label: 'Books', value: '600+', icon: BookOpen }, { label: 'Shelves', value: '10', icon: Library },
    { label: 'Departments', value: '8', icon: GraduationCap }, { label: 'Members', value: '1,200+', icon: Users },
  ];
  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light text-xs text-emerald-200 border border-emerald-500/20 mb-4"><Info className="w-3.5 h-3.5" /> About LIBRAVISTA</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Your Library. <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">Smarter.</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">LIBRAVISTA is a smart digital library management and discovery platform that bridges the gap between your digital catalog and the physical library. Discover books, locate shelves, borrow smarter, and explore your library like never before.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {stats.map((s) => (<div key={s.label} className="glass-card rounded-2xl p-5 text-center card-hover"><s.icon className="w-7 h-7 mx-auto mb-2 text-emerald-400" /><p className="font-display text-3xl font-bold text-white">{s.value}</p><p className="text-sm text-gray-400 mt-1">{s.label}</p></div>))}
        </div>
        <h2 className="section-title mb-6 text-center">What Makes Us Different</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {features.map((f) => (<div key={f.title} className="glass-card rounded-2xl p-5 card-hover"><div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4"><f.icon className="w-6 h-6 text-emerald-400" /></div><h3 className="font-display font-bold text-white text-lg mb-2">{f.title}</h3><p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p></div>))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><BookMarked className="w-5 h-5 text-emerald-400" /></div><h3 className="font-display font-bold text-white text-xl">Library Rules</h3></div>
            <ul className="space-y-3">{rules.map((rule, i) => (<li key={i} className="flex items-start gap-3 text-sm text-gray-300"><span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>{rule}</li>))}</ul>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Mail className="w-5 h-5 text-emerald-400" /></div><h3 className="font-display font-bold text-white text-xl">Contact & Help</h3></div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3"><Library className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" /><div><p className="text-white font-medium">University Central Library</p><p className="text-gray-400">Block C, Ground Floor, Campus Road</p></div></div>
              <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" /><div><p className="text-white font-medium">+91 80 1234 5678</p><p className="text-gray-400">Mon-Sat, 8:00 AM - 8:00 PM</p></div></div>
              <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" /><div><p className="text-white font-medium">library@university.edu</p><p className="text-gray-400">For inquiries and support</p></div></div>
              <div className="flex items-start gap-3"><HelpCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" /><div><p className="text-white font-medium">Help Desk</p><p className="text-gray-400">Available at the reception during library hours</p></div></div>
            </div>
            <button onClick={() => navigate({ name: 'scanner' })} className="btn-secondary w-full mt-5 flex items-center justify-center gap-2"><ScanLine className="w-4 h-4" /> Try the Barcode Scanner</button>
          </div>
        </div>
        <div className="glass-card rounded-3xl p-8 text-center">
          <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white mb-2">Ready to explore?</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">Start your journey through the smart library. Search for books, locate them on the map, and borrow in seconds.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate({ name: 'map' })} className="btn-primary flex items-center gap-2"><MapPin className="w-5 h-5" /> Explore Library Map</button>
            <button onClick={() => navigate({ name: 'explore' })} className="btn-secondary flex items-center gap-2"><BookOpen className="w-5 h-5" /> Browse Books <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
