import { useState } from 'react';
import { useStore } from '@/store';
import { users } from '@/data';
import { ScanLine, CheckCircle2, User, BookOpen, AlertTriangle, Clock, X, ArrowRight } from 'lucide-react';

export function ScannerPage() {
  const { navigate, login } = useStore();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<typeof users[0] | null>(null);

  const startScan = () => { setScanning(true); setScanned(false); setScanResult(null); setTimeout(() => { const randomStudent = users.find((u) => u.id === 'U001')!; setScanResult(randomStudent); setScanning(false); setScanned(true); }, 2500); };
  const activeBorrows = scanResult ? [{ title: 'Clean Code', dueDate: '2026-09-30', overdue: false }, { title: 'Python Crash Course', dueDate: '2026-10-05', overdue: false }] : [];

  return (
    <div className="pt-16 min-h-screen animate-fade-in">
      <div className="max-w-[800px] mx-auto px-4 lg:px-6 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light text-xs text-emerald-200 border border-emerald-500/20 mb-4"><ScanLine className="w-3.5 h-3.5" /> Library Entrance</div><h1 className="font-display text-3xl font-bold text-white mb-2">Scan your Library ID</h1><p className="text-gray-400">Scan your student barcode at the entrance to authenticate and view your library profile.</p></div>
        <div className="glass-card rounded-3xl p-8 mb-6">
          {!scanning && !scanned && (
            <div className="text-center">
              <div className="flex items-end justify-center gap-px h-32 mb-6">{Array.from({ length: 50 }).map((_, i) => (<div key={i} className="bg-emerald-200/60 rounded-sm" style={{ width: `${i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1}px`, height: '100%' }} />))}</div>
              <button onClick={startScan} className="btn-primary flex items-center gap-2 mx-auto"><ScanLine className="w-5 h-5" /> Scan Barcode</button>
              <p className="text-xs text-gray-500 mt-3">Demo: Click to simulate scanning a student ID</p>
            </div>
          )}
          {scanning && (
            <div className="text-center py-8">
              <div className="relative w-64 h-40 mx-auto rounded-2xl overflow-hidden glass-light border-2 border-emerald-400/40">
                <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-scan-line" />
                <div className="absolute inset-0 flex items-center justify-center"><ScanLine className="w-12 h-12 text-emerald-400/30" /></div>
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" /><div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" /><div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" /><div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
              </div>
              <p className="text-emerald-300 mt-4 animate-pulse">Scanning...</p>
            </div>
          )}
          {scanned && scanResult && (
            <div className="animate-scale-in">
              <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-emerald-400" /></div><div><h2 className="font-display text-xl font-bold text-white">Welcome back, {scanResult.name}</h2><p className="text-sm text-gray-400">Entry time: {new Date().toLocaleTimeString()}</p></div></div>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div className="glass-light rounded-xl p-3"><p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><User className="w-3 h-3" /> Student</p><p className="text-white font-semibold">{scanResult.name}</p><p className="text-xs text-gray-500">{scanResult.studentId} - {scanResult.department}</p></div>
                <div className="glass-light rounded-xl p-3"><p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><CheckCircle2 className="w-3 h-3" /> Membership</p><p className="text-white font-semibold">{scanResult.membershipType}</p><p className="text-xs text-emerald-300">Active until {scanResult.membershipValidTill}</p></div>
                <div className="glass-light rounded-xl p-3"><p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><BookOpen className="w-3 h-3" /> Active Borrows</p><p className="text-white font-semibold">{scanResult.currentBorrowed} books</p><p className="text-xs text-gray-500">Limit: {scanResult.borrowLimit}</p></div>
                <div className="glass-light rounded-xl p-3"><p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><AlertTriangle className="w-3 h-3" /> Overdue</p><p className="text-white font-semibold">0 books</p><p className="text-xs text-emerald-300">No overdue books</p></div>
              </div>
              <div className="glass-light rounded-xl p-4 mb-4"><h3 className="text-sm font-semibold text-white mb-3">Active Borrowed Books</h3>{activeBorrows.map((b, i) => (<div key={i} className="flex items-center justify-between py-2 border-b border-emerald-500/10 last:border-0"><div><p className="text-sm text-white">{b.title}</p><p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {b.dueDate}</p></div><span className="badge-green text-[9px]">On time</span></div>))}</div>
              <div className="flex gap-3"><button onClick={() => login(scanResult)} className="btn-primary flex-1 flex items-center justify-center gap-2">Go to Dashboard <ArrowRight className="w-4 h-4" /></button><button onClick={() => { setScanned(false); setScanResult(null); }} className="btn-secondary flex items-center gap-2"><X className="w-4 h-4" /> Scan Again</button></div>
            </div>
          )}
        </div>
        <div className="glass-card rounded-2xl p-4 text-center"><p className="text-xs text-gray-400">This is a prototype workflow using mock barcode data. No real personal information is exposed.</p></div>
      </div>
    </div>
  );
}
