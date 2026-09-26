import { useStore } from '@/store';
import { CreditCard, Calendar, BookOpen, Check, Clock, User, GraduationCap, Briefcase, Microscope } from 'lucide-react';

export function MembershipPage() {
  const { currentUser, navigate } = useStore();

  const membershipTypes = [
    { type: 'Student', icon: GraduationCap, color: '#10B981', limit: 5, validity: '1 Year', features: ['Borrow up to 5 books', '14-day loan period', 'Access to digital catalog', 'Wishlist & reservations', 'Book exchange access'] },
    { type: 'Faculty', icon: Briefcase, color: '#34D399', limit: 20, validity: '2 Years', features: ['Borrow up to 20 books', '30-day loan period', 'Priority reservations', 'Research journal access', 'Inter-library loans'] },
    { type: 'Researcher', icon: Microscope, color: '#6EE7B7', limit: 15, validity: '2 Years', features: ['Borrow up to 15 books', '30-day loan period', 'Special collections access', 'Research assistance', 'Extended due dates'] },
  ];

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="section-title">Membership</h1>
            <p className="text-gray-400">Your library membership details</p>
          </div>
        </div>

        {currentUser ? (
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Membership card */}
            <div className="lg:col-span-2">
              <div className="relative rounded-3xl overflow-hidden p-8" style={{ background: 'linear-gradient(135deg, #064E3B 0%, #022C22 50%, #0B0B0B 100%)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-emerald-400/5 blur-2xl" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-display font-bold text-white">LIBRAVISTA</span>
                    </div>
                    <span className="badge-green">{currentUser.membershipType} Member</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-emerald-300/60 mb-1">Member Name</p>
                      <p className="font-display text-2xl font-bold text-white">{currentUser.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-emerald-300/60 mb-1">Member ID</p>
                        <p className="font-mono text-white">{currentUser.studentId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-300/60 mb-1">Barcode</p>
                        <p className="font-mono text-white text-sm">{currentUser.barcode}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-emerald-300/60 mb-1">Department</p>
                        <p className="text-white">{currentUser.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-300/60 mb-1">Valid Till</p>
                        <p className="text-white flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {currentUser.membershipValidTill}</p>
                      </div>
                    </div>
                  </div>

                  {/* Barcode visual */}
                  <div className="mt-6 flex items-end gap-px h-12">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="bg-emerald-200/70" style={{ width: `${i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1}px`, height: '100%' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Borrowing Limit</span>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="font-display text-3xl font-bold text-white">{currentUser.borrowLimit}</p>
                <p className="text-xs text-gray-500">books at a time</p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Currently Borrowed</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <p className="font-display text-3xl font-bold text-amber-300">{currentUser.currentBorrowed}</p>
                <p className="text-xs text-gray-500">books active</p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Remaining</span>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="font-display text-3xl font-bold text-emerald-300">{currentUser.borrowLimit - currentUser.currentBorrowed}</p>
                <p className="text-xs text-gray-500">books available to borrow</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-8 text-center mb-8">
            <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="font-display font-bold text-white text-lg mb-2">Not logged in</h3>
            <p className="text-gray-400 text-sm mb-4">Log in to view your membership details</p>
            <button onClick={() => navigate({ name: 'login' })} className="btn-primary">Login</button>
          </div>
        )}

        {/* Membership types */}
        <h2 className="section-title mb-4">Membership Types</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {membershipTypes.map((m) => (
            <div key={m.type} className="glass-card rounded-3xl p-6 card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ background: m.color }} />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${m.color}25`, border: `1px solid ${m.color}40` }}>
                  <m.icon className="w-7 h-7" style={{ color: m.color }} />
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-1">{m.type}</h3>
                <p className="text-sm text-gray-400 mb-4">Validity: {m.validity}</p>
                <div className="space-y-2">
                  {m.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
