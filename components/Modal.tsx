
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'success': return 'text-green-600 dark:text-green-400';
      default: return 'text-blue-600 dark:text-indigo-400';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-white dark:border-slate-800"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className={`text-2xl font-black tracking-tighter leading-none ${getTypeStyles()}`}>
                  {title}
                </h3>
                <button 
                  onClick={onClose}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-gray-600 dark:text-slate-300 font-medium leading-relaxed">
                {children}
              </div>

              {footer && (
                <div className="mt-10 flex flex-col space-y-3">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
