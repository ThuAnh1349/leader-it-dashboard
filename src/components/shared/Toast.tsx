import { useEffect, useState } from 'react';

export interface ToastData {
  id: string;
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 5000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl
        transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      <span className="text-sm text-gray-100">{toast.message}</span>
      {toast.onUndo && (
        <button
          onClick={() => { toast.onUndo?.(); onDismiss(toast.id); }}
          className="text-sm text-indigo-400 font-medium hover:text-indigo-300 whitespace-nowrap"
        >
          {toast.undoLabel ?? 'Hoàn tác'}
        </button>
      )}
      <button onClick={() => onDismiss(toast.id)} className="text-gray-500 hover:text-gray-300 ml-1">✕</button>
    </div>
  );
}

// ToastContainer
interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

// Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (msg: string, opts?: { undoLabel?: string; onUndo?: () => void }) => {
    const id = `toast-${Date.now()}`;
    setToasts(p => [...p, { id, message: msg, ...opts }]);
    return id;
  };

  const dismiss = (id: string) => setToasts(p => p.filter(t => t.id !== id));

  return { toasts, addToast, dismiss };
}
