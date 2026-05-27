/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

interface RemoveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function RemoveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: RemoveConfirmModalProps) {
  // Support Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
          />

          {/* Card Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-drawer z-10 overflow-hidden"
          >
            {/* Close Cross Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-charcoal/30 hover:text-charcoal transition-all p-1 hover:bg-surface rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Trash Icon */}
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6">
              <Trash2 size={22} />
            </div>

            {/* Title */}
            <h3 className="font-serif text-[26px] font-semibold text-charcoal text-center mb-2 tracking-tight">
              Remove item?
            </h3>

            {/* Body */}
            <p className="font-sans text-[14px] text-charcoal/60 text-center mb-8 leading-relaxed font-light">
              Are you sure you want to remove{" "}
              <span className="font-medium text-charcoal">"{itemName}"</span>{" "}
              from your cart?
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 font-sans text-[11px] tracking-[2px] uppercase border border-charcoal/20 text-charcoal rounded-full py-3.5 hover:bg-surface transition-all active:scale-[0.98] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 font-sans text-[11px] tracking-[2px] uppercase bg-red-500 hover:bg-red-600 text-white rounded-full py-3.5 transition-all shadow-md active:scale-[0.98] cursor-pointer font-medium"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
