import { useState } from 'react';
import { useStore } from '@/store';
import { exchangeListings as initialListings } from '@/data';
import { Repeat2, Plus, X, BookOpen, Check, Clock } from 'lucide-react';
import type { ExchangeListing } from '@/types';

export function ExchangePage() {
  const { pushToast, currentUser } = useStore();
  const [listings, setListings] = useState<ExchangeListing[]>(initialListings);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<ExchangeListing | null>(null);
  const [newListing, setNewListing] = useState({ title: '', author: '', condition: 'Good' as ExchangeListing['condition'], description: '' });

  const handleRequest = (listing: ExchangeListing) => {
    if (!currentUser) {
      pushToast('Please log in to request exchanges', 'error');
      return;
    }
    setListings((prev) => prev.map((l) => (l.id === listing.id ? { ...l, status: 'requested' } : l)));
    pushToast(`Exchange request sent for "${listing.bookTitle}"`, 'success');
    setSelectedListing(null);
  };

  const handleAddListing = () => {
    if (!newListing.title || !newListing.author) {
      pushToast('Please fill in all fields', 'error');
      return;
    }
    const listing: ExchangeListing = {
      id: `EX${Date.now()}`,
      bookTitle: newListing.title,
      author: newListing.author,
      ownerName: currentUser?.name ?? 'You',
      ownerDepartment: currentUser?.department ?? 'Unknown',
      condition: newListing.condition,
      status: 'available',
      coverColor: '#065F46',
      description: newListing.description,
    };
    setListings((prev) => [listing, ...prev]);
    setNewListing({ title: '', author: '', condition: 'Good', description: '' });
    setShowAddModal(false);
    pushToast('Book listed for exchange', 'success');
  };

  const statusBadge = (status: string) => {
    if (status === 'available') return <span className="badge-green">Available</span>;
    if (status === 'requested') return <span className="badge-orange">Requested</span>;
    return <span className="badge-gray">Exchanged</span>;
  };

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Repeat2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="section-title">Book Exchange</h1>
              <p className="text-gray-400">Trade books with fellow students</p>
            </div>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> List a Book
          </button>
        </div>

        {/* Exchange flow */}
        <div className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-3 flex-wrap text-sm">
          {['Browse', 'Request Exchange', 'Notification', 'Accept', 'Exchange Completed'].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg glass-light text-emerald-100 font-medium">{step}</span>
              {i < arr.length - 1 && <span className="text-emerald-500/40">→</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <div key={listing.id} className="glass-card rounded-2xl p-4 card-hover">
              <div className="flex gap-3">
                <div className="w-16 h-24 rounded-lg shrink-0 flex items-center justify-center p-2" style={{ background: listing.coverColor }}>
                  <BookOpen className="w-6 h-6 text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-white text-sm line-clamp-2">{listing.bookTitle}</h3>
                  <p className="text-xs text-gray-400 mt-1">{listing.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {statusBadge(listing.status)}
                    <span className="text-xs text-gray-500">{listing.condition}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 line-clamp-2">{listing.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-500/10">
                <div>
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="text-xs text-gray-200 font-medium">{listing.ownerName}</p>
                </div>
                <button
                  onClick={() => setSelectedListing(listing)}
                  disabled={listing.status !== 'available'}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-40 text-emerald-100 text-xs font-semibold transition-all"
                >
                  {listing.status === 'available' ? 'Request Exchange' : 'Pending'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add listing modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="glass-card rounded-3xl p-6 max-w-md w-full animate-scale-in border-2 border-emerald-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-white text-xl">List a Book for Exchange</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Book Title" value={newListing.title} onChange={(e) => setNewListing({ ...newListing, title: e.target.value })} className="input-field" />
              <input type="text" placeholder="Author" value={newListing.author} onChange={(e) => setNewListing({ ...newListing, author: e.target.value })} className="input-field" />
              <select value={newListing.condition} onChange={(e) => setNewListing({ ...newListing, condition: e.target.value as ExchangeListing['condition'] })} className="input-field">
                <option value="Like New" className="bg-forest-800">Like New</option>
                <option value="Good" className="bg-forest-800">Good</option>
                <option value="Fair" className="bg-forest-800">Fair</option>
              </select>
              <textarea placeholder="Description (condition, notes...)" value={newListing.description} onChange={(e) => setNewListing({ ...newListing, description: e.target.value })} className="input-field min-h-[80px] resize-none" />
            </div>
            <button onClick={handleAddListing} className="btn-primary w-full mt-4">List for Exchange</button>
          </div>
        </div>
      )}

      {/* Listing detail modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedListing(null)}>
          <div className="glass-card rounded-3xl p-6 max-w-md w-full animate-scale-in border-2 border-emerald-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <div className="w-16 h-24 rounded-lg shrink-0 flex items-center justify-center" style={{ background: selectedListing.coverColor }}>
                  <BookOpen className="w-6 h-6 text-white/40" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg">{selectedListing.bookTitle}</h3>
                  <p className="text-sm text-gray-400">{selectedListing.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {statusBadge(selectedListing.status)}
                    <span className="text-xs text-gray-500">{selectedListing.condition}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedListing(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="glass-light rounded-xl p-3 mb-4">
              <p className="text-sm text-gray-300">{selectedListing.description}</p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-emerald-500/10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white text-xs font-bold">{selectedListing.ownerName.charAt(0)}</div>
                <div>
                  <p className="text-sm text-white font-medium">{selectedListing.ownerName}</p>
                  <p className="text-xs text-gray-500">{selectedListing.ownerDepartment}</p>
                </div>
              </div>
            </div>
            <button onClick={() => handleRequest(selectedListing)} className="btn-primary w-full flex items-center justify-center gap-2">
              <Check className="w-5 h-5" /> Request Exchange
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
