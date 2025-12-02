import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toastIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const toastColors: Record<ToastType, string> = {
  success: 'from-emerald-500 to-green-600 border-emerald-400',
  error: 'from-rose-500 to-red-600 border-rose-400',
  info: 'from-blue-500 to-indigo-600 border-blue-400',
  warning: 'from-amber-500 to-orange-600 border-amber-400',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
      4000,
    );
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 space-y-3 z-50 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`rounded-2xl px-5 py-3 shadow-2xl text-sm backdrop-blur-sm bg-gradient-to-r ${
                toastColors[toast.type]
              } text-white border-2 pointer-events-auto min-w-[280px] max-w-md`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  {toastIcons[toast.type]}
                </div>
                <p className="flex-1 font-medium">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}