import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 15 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-charcoal text-white rounded-full px-7 py-3.5 z-[120] shadow-xl border border-white/10 flex items-center gap-3.5"
        >
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
            <Check size={11} strokeWidth={3} />
          </div>
          <span className="font-sans text-[11px] tracking-[1.5px] uppercase font-semibold">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
