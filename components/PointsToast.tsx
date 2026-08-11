import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface PointsToastData {
  id: number;
  points: number;
  message: string;
}

interface PointsToastProps {
  toast: PointsToastData | null;
  onClose: () => void;
}

export const PointsToast: React.FC<PointsToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -60, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-sm pointer-events-auto"
        >
          <div className="bg-slate-900/95 dark:bg-slate-900/95 text-white p-4 rounded-[28px] border-2 border-yellow-400 shadow-2xl shadow-yellow-500/30 flex items-center space-x-3.5 backdrop-blur-md">
            <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-amber-300 text-slate-950 rounded-2xl flex items-center justify-center font-black text-lg shadow-md shrink-0 animate-bounce">
              +{toast.points}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-yellow-400 font-black text-[11px] uppercase tracking-widest">¡Puntos Sumados!</span>
                <span className="text-sm">🎉</span>
              </div>
              <p className="text-xs font-extrabold text-slate-100 leading-snug mt-0.5">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full text-xs font-bold transition-colors"
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
