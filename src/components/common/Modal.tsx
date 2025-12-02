import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-[rgb(var(--card))] rounded-3xl shadow-2xl w-full max-w-lg border-2 border-[rgb(var(--card-border))] overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient */}
              <div className="relative px-6 py-4 border-b-2 border-[rgb(var(--card-border))] bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                <h2 className="font-bold text-xl tracking-tight">{title}</h2>
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:rotate-90 duration-300"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}