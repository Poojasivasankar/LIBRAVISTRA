import { useStore } from '@/store';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto glass-card rounded-2xl px-4 py-3 flex items-center gap-3 animate-slide-up shadow-2xl border border-emerald-500/20 max-w-md"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
          <p className="text-sm text-gray-100 flex-1">{toast.message}</p>
          <button onClick={() => dismissToast(toast.id)} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
