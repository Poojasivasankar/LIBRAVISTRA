import { useState } from 'react';
import { useStore } from '@/store';
import { users } from '@/data';
import { BookOpen, GraduationCap, Shield, Eye, EyeOff, ArrowRight, User, Lock } from 'lucide-react';

export function LoginPage() {
  const { login, navigate } = useStore();
  const [mode, setMode] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find((u) => {
      if (mode === 'student') return u.role === 'STUDENT' && (u.email.toLowerCase() === email.toLowerCase() || u.studentId.toLowerCase() === email.toLowerCase());
      return u.role === 'ADMIN' && (u.email.toLowerCase() === email.toLowerCase() || u.studentId.toLowerCase() === email.toLowerCase());
    });
    if (!user) { setError('Invalid credentials. Try the demo buttons below.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    login(user);
  };

  const demoLogin = (role: 'student' | 'admin') => {
    const user = role === 'student' ? users.find((u) => u.id === 'U001')! : users.find((u) => u.id === 'A001')!;
    login(user);
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3"><div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20"><BookOpen className="w-6 h-6 text-white" /></div></div>
          <h1 className="font-display text-3xl font-bold text-white">LIBRAVISTA</h1>
          <p className="text-sm text-gray-400 mt-1">Your library. Smarter.</p>
        </div>
        <div className="glass-card rounded-2xl p-1.5 mb-5 flex">
          <button onClick={() => { setMode('student'); setError(''); }} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === 'student' ? 'bg-emerald-500/30 text-emerald-100' : 'text-gray-400 hover:text-emerald-200'}`}><GraduationCap className="w-4 h-4" /> Student Login</button>
          <button onClick={() => { setMode('admin'); setError(''); }} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === 'admin' ? 'bg-sky-500/30 text-sky-100' : 'text-gray-400 hover:text-emerald-200'}`}><Shield className="w-4 h-4" /> Administrator</button>
        </div>
        <form onSubmit={handleLogin} className="glass-card rounded-3xl p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">{mode === 'student' ? 'Student ID / Email' : 'Admin ID / Email'}</label>
            <div className="flex items-center gap-2 px-3 py-3 rounded-xl glass-light border border-emerald-500/15 focus-within:border-emerald-400/40 transition-all"><User className="w-4 h-4 text-emerald-300" /><input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={mode === 'student' ? 'CS21B001 or aarav.s@university.edu' : 'ADMIN001 or admin@libravista.edu'} className="bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none flex-1 text-sm" /></div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
            <div className="flex items-center gap-2 px-3 py-3 rounded-xl glass-light border border-emerald-500/15 focus-within:border-emerald-400/40 transition-all"><Lock className="w-4 h-4 text-emerald-300" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none flex-1 text-sm" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-emerald-300 transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-gray-300"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-emerald-500" />Remember me</label>
            <button type="button" className="text-emerald-300 hover:text-emerald-200 transition-colors">Forgot password?</button>
          </div>
          {error && <div className="px-3 py-2 rounded-lg bg-red-500/15 border border-red-400/20 text-red-300 text-sm animate-fade-in">{error}</div>}
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">Login <ArrowRight className="w-4 h-4" /></button>
        </form>
        <div className="mt-5 glass-card rounded-2xl p-4">
          <p className="text-xs text-gray-400 text-center mb-3">Quick demo access - no credentials needed</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => demoLogin('student')} className="px-3 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-100 text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-emerald-500/20"><GraduationCap className="w-4 h-4" /> Demo Student</button>
            <button onClick={() => demoLogin('admin')} className="px-3 py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-100 text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-sky-500/20"><Shield className="w-4 h-4" /> Demo Admin</button>
          </div>
        </div>
        <button onClick={() => navigate({ name: 'home' })} className="w-full text-center text-sm text-gray-400 hover:text-emerald-200 transition-colors mt-5">Back to home</button>
      </div>
    </div>
  );
}
