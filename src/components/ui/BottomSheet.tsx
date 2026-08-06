import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-zinc-700/60 rounded-full mx-auto mb-5" />

            <div className="flex items-start justify-between mb-4 gap-2">
              <div className="min-w-0 flex-1 pr-2">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-100 leading-snug break-words">{title}</h3>
                {subtitle && <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">{subtitle}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 -mt-1 -mr-1">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="py-2">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
